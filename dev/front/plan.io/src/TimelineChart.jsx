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

  // Process the session data for the chart
  

    // Find the earliest session start time
    const startTimes = recentTimers.map((timer) => new Date(timer.startTime));
    const firstStartTime = new Date(Math.min(...startTimes));
    const startHour = firstStartTime.getHours();

    // Generate labels for the x-axis
    const labels = generateLabels(startHour);

    // Prepare session data with default values for all hours
    const workData = new Array(24).fill(0); // Default all hours to 0
    const breakData = new Array(24).fill(0); // Default all hours to 0

    // Prepare lines for each session
    const workLines = [];
    const breakLines = [];

    recentTimers.forEach((timer) => {
      const startTime = new Date(timer.startTime);
      if (isNaN(startTime.getTime())) {
        console.warn("Invalid startTime:", timer.startTime);
        return;
      }

      const hour = startTime.getHours();
      const endTime = new Date(startTime.getTime() + timer.duration * 60000); // Calculate end time in minutes
      const endHour = endTime.getHours();

      // Handle work session
      if (timer.type === "work") {
        workData[(hour - startHour + 24) % 24] += timer.duration || 0; // Add duration to the correct hour
        workLines.push({
          x1: hour,
          y1: timer.duration,
          x2: endHour,
          y2: 0, // This will draw a line from the start hour to the end hour
          label: "Work",
        });
      } else if (timer.type === "break") {
        breakData[(hour - startHour + 24) % 24] += timer.duration || 0; // Add duration to the correct hour
        breakLines.push({
          x1: hour,
          y1: timer.duration,
          x2: endHour,
          y2: 0, // This will draw a line from the start hour to the end hour
          label: "Break",
        });
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

  // Initialize the chart on page load and update when recentTimers changes
  useEffect(() => {
    const processData = () => {
      if (!recentTimers || recentTimers.length === 0) {
        console.warn("No timers found");
        return;
      };
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
          text: "Time of Day",
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
