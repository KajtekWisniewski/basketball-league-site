'use client';
import styles from './TeamPreview.module.css';
import TeamPreview from './TeamPreview';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const Standings = () => {
  const [teams, setTeams] = useState([]);
  const [conferenceFilter, setConferenceFilter] = useState('eastern');
  const [divisionFilter, setDivisionFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`
        );
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

  const availableDivisions = [
    ...new Set(
      teams
        .filter(
          (team) => team.conference.toLowerCase() === conferenceFilter.toLowerCase()
        )
        .map((team) => team.division.toLowerCase())
    )
  ];

  const filteredTeams = teams.filter((team) => {
    return (
      team.conference.toLowerCase() === conferenceFilter.toLowerCase() &&
      (divisionFilter === '' ||
        team.division.toLowerCase() === divisionFilter.toLowerCase())
    );
  });

  const sortedTeams = [...filteredTeams];

  sortedTeams.sort((a, b) => {
    const orderMultiplier = sortOrder === 'asc' ? 1 : -1;
    return orderMultiplier * (b.statistics.winPercentage - a.statistics.winPercentage);
  });

  if (teams.length === 0) {
    return (
      <div className="flex justify-center">
        <ClipLoader
          color="#ffffff"
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        ></ClipLoader>
      </div>
    );
  }

  return (
    <>
      <div>
        <label>
          Conference:
          <select
            className="p-1.5 m-1"
            value={conferenceFilter}
            onChange={(e) => setConferenceFilter(e.target.value)}
          >
            <option value="eastern">Eastern</option>
            <option value="western">Western</option>
          </select>
        </label>
        <label>
          Division:
          <select
            className="p-1.5 m-1"
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
          >
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
          <select
            className="p-1.5 m-1"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <div>
          {sortedTeams.map((team, id) => {
            const position = sortOrder === 'asc' ? id + 1 : sortedTeams.length - id;

            return (
              <div key={id} className={styles.standing}>
                <h1>{position}</h1>
                <TeamPreview teamId={team._id}></TeamPreview>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Standings;
