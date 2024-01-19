'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import globalStyles from '@/app/globals.css';
import styles from './User.module.css';
import formatDatabaseData from '@/functions/formatDatabaseData';

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      if (searchQuery === '') {
        setSearchResults([]);
      } else {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/util/search?q=${searchQuery}`
        );
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleFlag = (flag) => {
    switch (flag) {
      case 'Team': {
        return 'teams';
      }
      case 'Player': {
        return 'players';
      }
      case 'Match': {
        return 'matches';
      }
      default: {
        return '';
      }
    }
  };

  return (
    <div>
      <div className={styles.searchArea}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          className={styles.searchInput}
          placeholder="Search for a player, team or matchdate"
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
        {searchResults.length > 0 && <h1>search results</h1>}
      </div>
      <ul>
        {searchResults.map((result, index) => (
          <Link
            key={index}
            className={globalStyles.linkStyle}
            href={`${handleFlag(result.flag)}/${result._id}`}
          >
            <li
              key={result._id}
              className={`${styles.listElement} ${styles[result.flag.toLowerCase()]}`}
            >
              {result.flag}:{' '}
              {result?.name
                ? formatDatabaseData(result.name)
                : formatDatabaseData(result.opponents[0].team.name) +
                  ' vs ' +
                  formatDatabaseData(result.opponents[1].team.name) +
                  ' ' +
                  result.date.toString().slice(0, 16).replace('T', ' ') +
                  (result.played ? ' Played' : ' Upcoming')}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SearchBox;
