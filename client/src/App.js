import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // for Chart.js 
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import './App.css';

Chart.register(zoomPlugin);

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
    SWOT: '',
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

  const classifySWOT = (item) => {
    const sum = item.intensity + item.likelihood + item.relevance;
    const highThreshold = 15;
    const lowThreshold = 5;
    const averageThreshold = 10;
  
    if (sum >= highThreshold) {
      return 'Strengths';
    } else if (sum <= lowThreshold) {
      return 'Weaknesses';
    } else if (sum > averageThreshold) {
      return 'Opportunities';
    } else {
      return 'Threats';
    }
  };

  const applyFilters = () => {
    const filtered = data.filter(item => {
      item.SWOT = classifySWOT(item);
      const matchEndYear = !filters.endYear || item.end_year.toString() === filters.endYear;
      const matchTopics = !filters.topics || (item.topic && item.topic.includes(filters.topics));
      const matchSector = !filters.sector || item.sector === filters.sector;
      const matchRegion = !filters.region || item.region === filters.region;
      const matchPEST = !filters.PEST || item.pestle === filters.PEST;
      const matchSource = !filters.source || item.source === filters.source;
      const matchCountry = !filters.country || item.country === filters.country;
      const matchCity = !filters.city || item.city === filters.city;
      const matchSWOT = !filters.SWOT || item.SWOT === filters.SWOT;

      // Debugging logs
      console.log('Filtering Item:', item);
      console.log('Match End Year:', matchEndYear);
      console.log('Match Topics:', matchTopics);
      console.log('Match Sector:', matchSector);
      console.log('Match Region:', matchRegion);
      console.log('Match PEST:', matchPEST);
      console.log('Match Source:', matchSource);
      console.log('Match Country:', matchCountry);
      console.log('Match City:', matchCity);
      console.log('Match SWOT:', matchSWOT);

      return matchEndYear && matchTopics && matchSector && matchRegion && matchPEST &&
             matchSource && matchCountry && matchCity && matchSWOT;
    });

    console.log('Filtered Data:', filtered);
    setFilteredData(filtered);
  };

  const checkDataConsistency = (data) => {
    data.forEach(item => {
      console.log('Sector:', item.sector);
      console.log('PEST:', item.pestle);
      console.log('Source:', item.source);
      console.log('SWOT:', item.SWOT);
      console.log('City:', item.city);
    });
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

  const yearChartData = {
    labels: Array.from(new Set(filteredData.map(item => item.end_year.toString()))),
    datasets: [
      {
        label: 'Intensity',
        data: filteredData.reduce((acc, item) => {
          const year = item.end_year.toString();
          acc[year] = (acc[year] || 0) + item.intensity;
          return acc;
        }, {}),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Likelihood',
        data: filteredData.reduce((acc, item) => {
          const year = item.end_year.toString();
          acc[year] = (acc[year] || 0) + item.likelihood;
          return acc;
        }, {}),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Relevance',
        data: filteredData.reduce((acc, item) => {
          const year = item.end_year.toString();
          acc[year] = (acc[year] || 0) + item.relevance;
          return acc;
        }, {}),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  // Convert datasets from object to array
  yearChartData.datasets.forEach(dataset => {
    const dataArray = [];
    yearChartData.labels.forEach(year => {
      dataArray.push(dataset.data[year] || 0);
    });
    dataset.data = dataArray;
  });

  const swotChartData = {
    labels: Array.from(new Set(filteredData.map(item => item.SWOT))),
    datasets: [
      {
        label: 'Intensity',
        data: filteredData.reduce((acc, item) => {
          const swot = item.SWOT;
          acc[swot] = (acc[swot] || 0) + item.intensity;
          return acc;
        }, {}),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Likelihood',
        data: filteredData.reduce((acc, item) => {
          const swot = item.SWOT;
          acc[swot] = (acc[swot] || 0) + item.likelihood;
          return acc;
        }, {}),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
      {
        label: 'Relevance',
        data: filteredData.reduce((acc, item) => {
          const swot = item.SWOT;
          acc[swot] = (acc[swot] || 0) + item.relevance;
          return acc;
        }, {}),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Data Visualization'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const item = filteredData[context.dataIndex];
            return [
              `Intensity: ${item.intensity}`,
              `Likelihood: ${item.likelihood}`,
              `Relevance: ${item.relevance}`,
              `Year: ${item.end_year}`,
              `Country: ${item.country}`,
              `Region: ${item.region}`,
              `City: ${item.city}`
            ];
          }
        }
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
      x: { beginAtZero: true }
    }
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
            options={[{ value: '', label: 'Select' }, { value: 'gas', label: 'Gas' }, { value: 'oil', label: 'Oil' }]}
            onChange={option => handleFilterChange('topics', option.value)}
            value={filters.topics ? { value: filters.topics, label: filters.topics } : null}
          />
          <button onClick={() => clearFilter('topics')}>Clear Filter</button>
        </label>
        <label>
          Sector:
          <Select
            options={[{ value: '', label: 'Select' }, { value: 'Energy', label: 'Energy' }, { value: 'Retail', label: 'Retail' }]}
            onChange={option => handleFilterChange('sector', option.value)}
            value={filters.sector ? { value: filters.sector, label: filters.sector } : null}
          />
          <button onClick={() => clearFilter('sector')}>Clear Filter</button>
        </label>
        <label>
          Region:
          <Select
            options={[{ value: '', label: 'Select' }, { value: 'Asia', label: 'Asia' }, { value: 'Europe', label: 'Europe' }]}
            onChange={option => handleFilterChange('region', option.value)}
            value={filters.region ? { value: filters.region, label: filters.region } : null}
          />
          <button onClick={() => clearFilter('region')}>Clear Filter</button>
        </label>
        <label>
          PEST:
          <Select
            options={[{ value: '', label: 'Select' }, { value: 'Industries', label: 'Industries' }, { value: 'Economic', label: 'Economy' }]}
            onChange={option => handleFilterChange('PEST', option.value)}
            value={filters.PEST ? { value: filters.PEST, label: filters.PEST } : null}
          />
          <button onClick={() => clearFilter('PEST')}>Clear Filter</button>
        </label>
        <label>
          Source:
          <Select
            options={[{ value: '', label: 'Select' }, { value: 'EIA', label: 'EIA' }, { value: 'Time', label: 'Time' }]}
            onChange={option => handleFilterChange('source', option.value)}
            value={filters.source ? { value: filters.source, label: filters.source } : null}
          />
          <button onClick={() => clearFilter('source')}>Clear Filter</button>
        </label>
        <label>
          Country:
          <Select
            options={[{ value: '', label: 'Select' }, { value: 'United States of America', label: 'USA' }, { value: 'China', label: 'China' }]}
            onChange={option => handleFilterChange('country', option.value)}
            value={filters.country ? { value: filters.country, label: filters.country } : null}
          />
          <button onClick={() => clearFilter('country')}>Clear Filter</button>
        </label>
        <label>
          SWOT:
          <Select
            options={[{ value: '', label: 'Select' }, { value: 'Strengths', label: 'Strengths' }, { value: 'Weaknesses', label: 'Weaknesses' }, { value: 'Opportunities', label: 'Opportunities' }, { value: 'Threats', label: 'Threats' }]}
            onChange={option => handleFilterChange('SWOT', option.value)}
            value={filters.SWOT ? { value: filters.SWOT, label: filters.SWOT } : null}
          />
          <button onClick={() => clearFilter('SWOT')}>Clear Filter</button>
        </label>
        <label>
          City:
          <Select
            options={[{ value: '', label: 'Select' }, { value: 'New York', label: 'New York' }, { value: 'Los Angeles', label: 'Los Angeles' }]}
            onChange={option => handleFilterChange('city', option.value)}
            value={filters.city ? { value: filters.city, label: filters.city } : null}
          />
          <button onClick={() => clearFilter('city')}>Clear Filter</button>
        </label>
      </div>
      <div className="chart-container">
        <h2>Topic-Based Data</h2>
        <Bar data={chartData} options={options} />
      </div>
      <div className="chart-container">
        <h2>Year-Based Data</h2>
        <Bar data={yearChartData} options={options} />
      </div>
      <div className="chart-container">
        <h2>SWOT-Based Data</h2>
        <Bar data={swotChartData} options={options} />
      </div>
    </div>
  );
};

export default App;
