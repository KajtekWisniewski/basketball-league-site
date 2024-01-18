'use client';
import React, { createContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import exportDataToFile from '@/functions/exportToFile';

const AdminPanel = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const endpoints = ['players', 'teams', 'matches', 'users'];
  const { userInfo } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);

  const handleEndpointChange = (event) => {
    setSelectedEndpoint(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImport = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        // const response = await axios.post(
        //   `http://127.0.0.1:3001/${selectedEndpoint}/import`,
        //   formData
        // );

        //console.log('Import result:', response.data);
      } catch (error) {
        console.error('Error importing data:', error);
      }
    } else {
      console.error('No file selected');
    }
  };

  const handleExport = () => exportDataToFile(selectedEndpoint);

  return (
    <>
      {userInfo?.user?.isAdmin ? (
        <div>
          <div>
            {' '}
            <label htmlFor="endpoints">Select Endpoint:</label>
            <select id="endpoints" onChange={handleEndpointChange}>
              <option value="" disabled>
                Select an endpoint
              </option>
              {endpoints.map((endpoint) => (
                <option key={endpoint} value={endpoint}>
                  {endpoint}
                </option>
              ))}
            </select>
            <button onClick={handleExport}>Export Data</button>
          </div>
          <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleImport}>Import Data</button>
          </div>
        </div>
      ) : (
        <div>ACCESS UNAUTHORIZED</div>
      )}
    </>
  );
};

export default AdminPanel;
