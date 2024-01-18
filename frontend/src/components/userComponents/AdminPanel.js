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

  const handleAssignRandomStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/assign-stats`
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error assigning stats from admin panel', error);
    }
  };

  const handleImport = async () => {
    if (file) {
      if (file.type === 'application/json') {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${selectedEndpoint}/import`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          console.log('Import result:', response.data);
          console.log(formData);
        } catch (error) {
          console.error('Error importing data:', error);
        }
      } else {
        console.error('Only JSON files are allowed');
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
          <div>Import na backendzie wspierany poki co tylko dla endpointu players</div>
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
          <div>
            <button onClick={handleAssignRandomStats}>
              Assign teams with random stats
            </button>
          </div>
        </div>
      ) : (
        <div>ACCESS UNAUTHORIZED</div>
      )}
    </>
  );
};

export default AdminPanel;
