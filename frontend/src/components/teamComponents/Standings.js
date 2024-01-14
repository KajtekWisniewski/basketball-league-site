'use client';
import styles from './TeamPreview.module.css'
import TeamPreview from './TeamPreview';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Standings = () => {
  const [teams, setTeams] = useState([]);
  const [conferenceFilter, setConferenceFilter] = useState('eastern');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/teams'); 
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const availableDivisions = [...new Set(teams.filter(team => team.conference.toLowerCase() === conferenceFilter.toLowerCase()).map(team => team.division.toLowerCase()))];

  const filteredTeams = teams.filter((team) => {
    return (
      team.conference.toLowerCase() === conferenceFilter.toLowerCase() &&
      (divisionFilter === '' || team.division.toLowerCase() === divisionFilter.toLowerCase())
    );
  });

  const sortedTeams = [...filteredTeams];

  sortedTeams.sort((a, b) => {
    const orderMultiplier = sortOrder === 'asc' ? 1 : -1;
    return orderMultiplier * (b.statistics.winPercentage - a.statistics.winPercentage);
  });

  
  return (
    <>
    <div>
      <label>
        Conference:
        <select value={conferenceFilter} onChange={(e) => setConferenceFilter(e.target.value)}>
          <option value="eastern">Eastern</option>
          <option value="western">Western</option>
        </select>
      </label>
      <label>
        Division:
        <select value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)}>
          <option value="">All</option>
          {availableDivisions.map((division) => (
            <option key={division} value={division}>
              {division.charAt(0).toUpperCase() + division.slice(1)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort Order:
        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>

        <div>
        {sortedTeams.map((team, id) => {

            const position = sortOrder === 'asc' ? id + 1 : sortedTeams.length - id;

            return (
            
          <div className={styles.standing}>
            <h1>{position}</h1>
        <TeamPreview teamId={team._id}></TeamPreview>
        </div>
        )})}
        </div>
      
    </div>
    </>
  );
};

export default Standings;