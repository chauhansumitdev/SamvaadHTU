import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({ userCount: 0, emergencyAlertCount: 0, reportCount: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stats');
        const data = response.data;
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <div className="top-section">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p>{stats.userCount}</p>
        </div>
        <div className="stat-box">
          <h3>Emergency Alerts</h3>
          <p>{stats.emergencyAlertCount}</p>
        </div>
        <div className="stat-box">
          <h3>Reports</h3>
          <p>{stats.reportCount}</p>
        </div>
      </div>

      <div className="map-section">
        <h3>City Map</h3>
        <iframe
          title="City Map"
          width="100%"
          height="400"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.856031413603!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dded82cb87fb1%3A0x654d8a3063bd4367!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1646471055719!5m2!1sen!2sin"
          allowfullscreen=""
          loading="lazy"
        ></iframe>
      </div>

      <div className="server-stats">
        <h3>Server Stats</h3>
        <div className="stat-box">
          <p>Memory Usage: __%</p>
        </div>
        <div className="stat-box">
          <p>CPU Usage: __%</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
