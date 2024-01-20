'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import globalStyles from '../../app/globals.css';
import styles from '@/components/userComponents/User.module.css';

const validationSchema = Yup.object({
  name: Yup.string().required('Team name is required'),
  location: Yup.string().required('Location is required'),
  conference: Yup.string().required('Conference is required'),
  division: Yup.string().required('Division is required'),
  logoLink: Yup.string(),
  statistics: Yup.object({
    wins: Yup.number().integer().min(0).default(0),
    losses: Yup.number().integer().min(0).default(0),
    winPercentage: Yup.number().min(0).max(100)
  })
});

const AddTeamForm = () => {
  const [teamlessPlayers, setTeamlessPlayers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [chosenPlayers, setChosenPlayers] = useState([]);
  const [winratio, setWinratio] = useState(100);

  useEffect(() => {
    const fetchTeamlessPlayers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/players/teamless`
        );
        setTeamlessPlayers(response.data);
      } catch (error) {
        console.error('Error fetching teamless players:', error);
      }
    };

    fetchTeamlessPlayers();
  }, []);

  const handleConferenceChange = (event) => {
    const selectedConference = event.target.value;
    formik.setFieldValue('conference', selectedConference);

    const availableDivisions =
      selectedConference === 'western'
        ? ['atlantic', 'central', 'southeast']
        : ['northwest', 'pacific', 'southwest'];

    if (!availableDivisions.includes(formik.values.division)) {
      formik.setFieldValue('division', availableDivisions[0]);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      location: '',
      conference: 'western',
      division: 'atlantic',
      roster: chosenPlayers,
      logoLink:
        'https://cdn.nba.com/teams/uploads/sites/1610612738/2022/05/celtics_secondary.svg',
      statistics: {
        wins: 0,
        losses: 0,
        winPercentage: winratio
      }
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams`,
          values
        );
        console.log('Team added successfully:', response.data);
        resetForm();
      } catch (error) {
        console.error('Error adding team:', error);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.loginForm}>
      <div className={styles.loginDiv}>
        <label htmlFor="name">Team Name:</label>
        <input
          className={styles.inputini}
          type="text"
          id="name"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </div>

      <div className={styles.loginDiv}>
        <label htmlFor="location">Location:</label>
        <input
          className={styles.inputini}
          type="text"
          id="location"
          {...formik.getFieldProps('location')}
        />
        {formik.touched.location && formik.errors.location && (
          <div className="error">{formik.errors.location}</div>
        )}
      </div>

      <div className={styles.loginDiv}>
        <label htmlFor="conference">Conference:</label>
        <select
          className={styles.inputini}
          id="conference"
          {...formik.getFieldProps('conference')}
          onChange={handleConferenceChange}
        >
          <option value="western">Western</option>
          <option value="eastern">Eastern</option>
        </select>
        {formik.touched.conference && formik.errors.conference && (
          <div className="error">{formik.errors.conference}</div>
        )}
      </div>

      <div className={styles.loginDiv}>
        <label htmlFor="division">Division:</label>
        <select
          className={styles.inputini}
          id="division"
          {...formik.getFieldProps('division')}
        >
          {formik.values.conference === 'western' ? (
            <>
              <option value="atlantic">Atlantic</option>
              <option value="central">Central</option>
              <option value="southeast">Southeast</option>
            </>
          ) : (
            <>
              <option value="northwest">Northwest</option>
              <option value="pacific">Pacific</option>
              <option value="southwest">Southwest</option>
            </>
          )}
        </select>
        {formik.touched.division && formik.errors.division && (
          <div className="error">{formik.errors.division}</div>
        )}
      </div>

      <div className={styles.loginDiv}>
        <label htmlFor="logoLink">Logo Link:</label>
        <input
          className={styles.inputini}
          type="text"
          id="logoLink"
          {...formik.getFieldProps('logoLink')}
        />
        {formik.touched.logoLink && formik.errors.logoLink ? (
          <div>{formik.errors.logoLink}</div>
        ) : null}
      </div>

      <div className={styles.loginDiv}>
        <label htmlFor="statistics.wins">Wins:</label>
        <input
          className={styles.inputini}
          type="number"
          id="statistics.wins"
          {...formik.getFieldProps('statistics.wins')}
        />
        {formik.touched.statistics && formik.touched.statistics.wins ? (
          <div>{formik.errors.statistics && formik.errors.statistics.wins}</div>
        ) : null}
      </div>

      <div className={styles.loginDiv}>
        <label htmlFor="statistics.losses">Losses:</label>
        <input
          className={styles.inputini}
          type="number"
          id="statistics.losses"
          {...formik.getFieldProps('statistics.losses')}
        />
        {formik.touched.statistics && formik.touched.statistics.losses ? (
          <div>{formik.errors.statistics && formik.errors.statistics.losses}</div>
        ) : null}
      </div>

      <div className={styles.loginDiv}>
        <label htmlFor="statistics.winPercentage">Win Percentage:</label>
        <input
          className={styles.inputini}
          type="number"
          id="statistics.winPercentage"
          {...formik.getFieldProps('statistics.winPercentage')}
          value={winratio}
          disabled
        />
        {formik.touched.statistics && formik.touched.statistics.winPercentage ? (
          <div>
            {formik.errors.statistics && formik.errors.statistics.winPercentage}
          </div>
        ) : null}
      </div>

      {/* <div>
        <label>
          Add teamless players to roster: TO JEST DO NAPRAWIENIA, po pierwsze checkboxy
          po drugie przy dodawniu kazdy gracz musi miec wylowyana funkcje przypisania do
          teamu + automatyczny winPercentage
        </label>
        {teamlessPlayers.map((player) => (
          <div key={player._id}>
            <input
              className={styles.inputini}
              type="checkbox"
              id={`player-${player._id}`}
              disabled
              value={player._id}
              onChange={() => {
                const updatedChosenPlayers = formik.values.roster.includes(player._id)
                  ? formik.values.roster.filter((id) => id !== player._id)
                  : [...formik.values.roster, player._id];

                setChosenPlayers(updatedChosenPlayers);
                console.log(chosenPlayers);

                formik.setFieldValue('roster', updatedChosenPlayers);
              }}
            />
            <label htmlFor={`player-${player._id}`}>{player.name}</label>
          </div>
        ))}
        {formik.touched.roster && formik.errors.roster && (
          <div className="error">{formik.errors.roster}</div>
        )}
      </div> */}

      <button
        className={styles.searchButton}
        type="submit"
        disabled={formik.isSubmitting || !formik.isValid}
      >
        Add Team
      </button>
      {submitted && (
        <Link className={globalStyles.linkStyle} href={`/teams/${playerPage}`}>
          <h2>team page</h2>
        </Link>
      )}
    </form>
  );
};

export default AddTeamForm;
