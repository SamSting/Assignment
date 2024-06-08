import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // for Chart.js v3 and above
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    endYear: '',
    topics: '',
    sector: '',
    region: '',
    PEST: '',
    source: '',
    country: '',
    city: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      applyFilters();
    }
  }, [filters, data]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      setData(response.data);
      console.log('Fetched Data:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilter = (name) => {
    setFilters({
      ...filters,
      [name]: ''
    });
  };

  const applyFilters = () => {
    const filtered = data.filter(item => {
      return (
        (!filters.endYear || item.end_year === filters.endYear) &&
        (!filters.topics || item.topic.includes(filters.topics)) &&
        (!filters.sector || item.sector === filters.sector) &&
        (!filters.region || item.region === filters.region) &&
        (!filters.PEST || item.pestle === filters.PEST) &&
        (!filters.source || item.source === filters.source) &&
        (!filters.country || item.country === filters.country) &&
        (!filters.city || item.city === filters.city)
      );
    });

    console.log('Filtered Data:', filtered);
    setFilteredData(filtered);
  };

  const chartData = {
    labels: filteredData.map(item => item.topic),
    datasets: [
      {
        label: 'Intensity',
        data: filteredData.map(item => item.intensity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Likelihood',
        data: filteredData.map(item => item.likelihood),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Relevance',
        data: filteredData.map(item => item.relevance),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <div className="container">
      <h1>Data Visualization Dashboard</h1>
      <div className="filters">
        <label>
          End Year:
          <DatePicker
            selected={filters.endYear ? new Date(filters.endYear) : null}
            onChange={date => handleFilterChange('endYear', date ? date.getFullYear().toString() : '')}
            dateFormat="yyyy"
            showYearPicker
          />
          <button onClick={() => clearFilter('endYear')}>Clear Filter</button>
        </label>
        <label>
          Topics:
          <Select
  options={[{ value: '', label: 'Select' }, { value: 'gas', label: 'Gas' }, { value: 'oil', label: 'Oil' }]} // Replace with actual topic options
  onChange={option => handleFilterChange('topics', option.value)}
  value={filters.topics ? { value: filters.topics, label: filters.topics } : null}
/>

          <button onClick={() => clearFilter('topics')}>Clear Filter</button>
        </label>
        <label>
          Sector:
          <Select
  options={[{ value: '', label: 'Select' }, { value: 'Energy', label: 'Energy' }, { value: 'Technology', label: 'Technology' }]} // Replace with actual sector options
  onChange={option => handleFilterChange('sector', option.value)}
  value={filters.sector ? { value: filters.sector, label: filters.sector } : null}
/>

          <button onClick={() => clearFilter('sector')}>Clear Filter</button>
        </label>
        <label>
          Region:
          <Select
  options={[{ value: '', label: 'Select' }, { value: 'Northern America', label: 'Northern America' }, { value: 'Europe', label: 'Europe' }]} // Replace with actual region options
  onChange={option => handleFilterChange('region', option.value)}
  value={filters.region ? { value: filters.region, label: filters.region } : null}
/>

          <button onClick={() => clearFilter('region')}>Clear Filter</button>
        </label>
        <label>
          PEST:
          <Select
  options={[{ value: '', label: 'Select' }, { value: 'Industries', label: 'Industries' }, { value: 'Economy', label: 'Economy' }]} // Replace with actual PEST options
  onChange={option => handleFilterChange('PEST', option.value)}
  value={filters.PEST ? { value: filters.PEST, label: filters.PEST } : null}
/>

          <button onClick={() => clearFilter('PEST')}>Clear Filter</button>
        </label>
        <label>
          Source:
          <Select
  options={[{ value: '', label: 'Select' }, { value: 'EIA', label: 'EIA' }, { value: 'UN', label: 'UN' }]} // Replace with actual source options
  onChange={option => handleFilterChange('source', option.value)}
  value={filters.source ? { value: filters.source, label: filters.source } : null}
/>

          <button onClick={() => clearFilter('source')}>Clear Filter</button>
        </label>
        <label>
          Country:
          <Select
  options={[{ value: '', label: 'Select' }, { value: 'United States of America', label: 'United States of America' }, { value: 'Canada', label: 'Canada' }]} // Replace with actual country options
  onChange={option => handleFilterChange('country', option.value)}
  value={filters.country ? { value: filters.country, label: filters.country } : null}
/>

          <button onClick={() => clearFilter('country')}>Clear Filter</button>
        </label>
        <label>
          City:
          <Select
  options={[{ value: '', label: 'Select' }, { value: 'New York', label: 'New York' }, { value: 'Los Angeles', label: 'Los Angeles' }]} // Replace with actual city options
  onChange={option => handleFilterChange('city', option.value)}
  value={filters.city ? { value: filters.city, label: filters.city } : null}
/>

          <button onClick={() => clearFilter('city')}>Clear Filter</button>
        </label>
      </div>
      <div id="chart">
        {filteredData.length > 0 ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              title: { text: 'Data Visualization', display: true },
              scales: {
                y: { beginAtZero: true },
                x: { beginAtZero: true }
              }
            }}
            height={400}
            width={600}
          />
        ) : (
          <p style={{ color: 'red', textAlign: 'center' }}>No Data Available</p>
        )}
      </div>
    </div>
  );
};

export default App;
