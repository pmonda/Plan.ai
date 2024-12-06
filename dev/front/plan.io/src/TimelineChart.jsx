import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimelineChart = ({ recentTimers }) => {
  const chartRef = useRef(null);

  // State to store chart data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  // Format the x-axis labels based on the starting hour
  const generateLabels = (startHour) => {
    const labels = [];
    for (let i = 0; i < 24; i++) {
      const hour = (startHour + i) % 24; // Wrap around to 24-hour format
      labels.push(`${hour}:00`);
    }
    return labels;
  };

  // Helper function to convert a given date to EST
  const convertToEST = (date) => {
    const localDate = new Date(date);
    return new Date(localDate.toLocaleString("en-US", { timeZone: "America/New_York" }));
  };

  // Process the session data for the chart
  useEffect(() => {
    const processData = () => {
      if (!recentTimers || recentTimers.length === 0) {
        console.warn("No timers found");
        return;
      }

      // Convert all times to EST
      const startTimes = recentTimers.map((timer) => convertToEST(timer.startTime));
      const firstStartTime = new Date(Math.min(...startTimes));
      const startHour = firstStartTime.getHours();

      // Generate labels for the x-axis
      const labels = generateLabels(startHour);

      // Prepare session data with default values for all hours
      const workData = new Array(24).fill(0); // Default all hours to 0
      const breakData = new Array(24).fill(0); // Default all hours to 0

      // Loop through each timer and accumulate the durations by hour
      recentTimers.forEach((timer) => {
        const startTime = convertToEST(timer.startTime); // Convert start time to EST
        if (isNaN(startTime.getTime())) {
          console.warn("Invalid startTime:", timer.startTime);
          return;
        }

        const duration = timer.duration || 0;
        const startHour = startTime.getHours();
        const endTime = new Date(startTime.getTime() + duration * 60000); // Calculate end time in EST
        const endHour = endTime.getHours();

        // Add the session's duration to all hours it spans
        if (timer.type === "work") {
          for (let i = startHour; i <= endHour; i++) {
            const hourIndex = (i + 24) % 24 -12; // Wrap the index around the 24-hour format
            workData[hourIndex] += duration / (endHour - startHour + 1); // Distribute duration evenly across all hours
          }
        } else if (timer.type === "break") {
          for (let i = startHour; i <= endHour; i++) {
            const hourIndex = (i + 24) % 24 - 12; // Wrap the index around the 24-hour format
            breakData[hourIndex] += duration / (endHour - startHour + 1); // Distribute duration evenly across all hours
          }
        }
      });

      // Update chart data with both work and break session lines
      setChartData({
        labels,
        datasets: [
          {
            label: "Work Sessions",
            data: workData,
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.3)",
            fill: true,
            lineTension: 0, // Prevent curves
          },
          {
            label: "Break Sessions",
            data: breakData,
            borderColor: "orange",
            backgroundColor: "rgba(255, 165, 0, 0.3)",
            fill: true,
            lineTension: 0, // Prevent curves
          },
        ],
      });
    };

    processData();
  }, [recentTimers]);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const minutes = tooltipItem.raw;
            return `${minutes} minutes`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Time of Day (EST)",
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Session Duration (minutes)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div style={{ position: "relative", height: "400px" }}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TimelineChart;
