import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HuggingFaceInference = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState(1);

  // Function to animate loading dots
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingDots((prevDots) => (prevDots % 3) + 1); // Cycles between 1, 2, and 3 dots
      }, 500); // Changes every 500ms
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    const API_URL = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-13b-chat';
    const API_KEY = process.env.REACT_APP_HF_API_KEY; // Securely use API key from environment variables

    const options = {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: inputText,
      }),
    };

    try {
      const response = await fetch(API_URL, options);
      const data = await response.json();
      setResult(data[0]?.generated_text || 'No result returned');
    } catch (error) {
      console.error('Error fetching data from Hugging Face:', error);
      setResult('Error fetching result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
          rows={5}
          cols={50}
        />
        <button type="submit" disabled={loading}>
          {loading ? `Generating${'.'.repeat(loadingDots)}` : 'Generate'}
        </button>
      </form>
      <div>
        <h2>Generated Output</h2>
        <p>{loading ? `Loading${'.'.repeat(loadingDots)}` : result}</p>
      </div>
    </div>
  );
};

export default HuggingFaceInference;
