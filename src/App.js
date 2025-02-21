import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const API_URL = 'https://bfhl-backend-1jvsg469m-anas-khans-projects-72a4b0fa.vercel.app '; // Replace with your deployed backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post(`${API_URL}/bfhl`, parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON or API error');
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const renderFilteredResponse = () => {
    if (!response || !response.is_success) return null;

    const filteredData = {};
    if (selectedFilters.includes('Alphabets')) filteredData.alphabets = response.alphabets;
    if (selectedFilters.includes('Numbers')) filteredData.numbers = response.numbers;
    if (selectedFilters.includes('Highest alphabet')) filteredData.highest_alphabet = response.highest_alphabet;

    return (
      <div className="mt-4 p-3 bg-dark text-light rounded">
        <h4>Filtered Response:</h4>
        {filteredData.numbers && <p>🔢 <strong>Numbers:</strong> {filteredData.numbers.join(', ')}</p>}
        {filteredData.alphabets && <p>🔠 <strong>Alphabets:</strong> {filteredData.alphabets.join(', ')}</p>}
        {filteredData.highest_alphabet && <p>🔝 <strong>Highest Alphabet:</strong> {filteredData.highest_alphabet.join(', ')}</p>}
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="mb-4 text-white bg-primary p-3 rounded">🚀 BFHL Challenge</h1>
      </div>

      <div className="card shadow-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Enter JSON (e.g. {"data": ["M", "1", "334", "4", "B"]})'
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Submit 🚀</button>
        </form>
      </div>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {response && response.is_success && (
        <div className="mt-4">
          <h4 className="mb-3">Multi-Select Filters:</h4>
          <div className="btn-group mb-3">
            {['Alphabets', 'Numbers', 'Highest alphabet'].map((filter) => (
              <button
                key={filter}
                className={`btn btn-outline-primary ${selectedFilters.includes(filter) ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
