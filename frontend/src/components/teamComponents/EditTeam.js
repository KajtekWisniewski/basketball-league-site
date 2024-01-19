'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import globalStyles from '../../app/globals.css';

const validationSchema = Yup.object({
  name: Yup.string(),
  location: Yup.string(),
  conference: Yup.string(),
  division: Yup.string(),
  logoLink: Yup.string(),
  statistics: Yup.object({
    wins: Yup.number().integer().min(0).default(0),
    losses: Yup.number().integer().min(0).default(0),
    winPercentage: Yup.number().min(0).max(100)
  })
});

const EditTeamForm = ({
  teamId,
  teamName,
  teamLocation,
  teamConference,
  teamDivision,
  teamLink,
  onTeamEdit
}) => {
  const [winratio, setWinratio] = useState(100);
  const [rerender, setRerender] = useState(0);

  const handleClick = () => setRerender(rerender + 1);

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
      name: teamName,
      location: teamLocation,
      conference: teamConference,
      division: teamDivision,
      logoLink: teamLink,
      statistics: {
        wins: 0,
        losses: 0,
        winPercentage: 100
      }
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/teams/${teamId}`,
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
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="name">Team Name:</label>
        <input type="text" id="name" {...formik.getFieldProps('name')} />
        {formik.touched.name && formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" {...formik.getFieldProps('location')} />
        {formik.touched.location && formik.errors.location && (
          <div className="error">{formik.errors.location}</div>
        )}
      </div>

      <div>
        <label htmlFor="conference">Conference:</label>
        <select
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

      <div>
        <label htmlFor="division">Division:</label>
        <select id="division" {...formik.getFieldProps('division')}>
          {formik.values.conference === 'eastern' ? (
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

      <label htmlFor="logoLink">Logo Link:</label>
      <input type="text" id="logoLink" {...formik.getFieldProps('logoLink')} />
      {formik.touched.logoLink && formik.errors.logoLink ? (
        <div>{formik.errors.logoLink}</div>
      ) : null}

      <label htmlFor="statistics.wins">Wins:</label>
      <input
        type="number"
        id="statistics.wins"
        {...formik.getFieldProps('statistics.wins')}
      />
      {formik.touched.statistics && formik.touched.statistics.wins ? (
        <div>{formik.errors.statistics && formik.errors.statistics.wins}</div>
      ) : null}

      <label htmlFor="statistics.losses">Losses:</label>
      <input
        type="number"
        id="statistics.losses"
        {...formik.getFieldProps('statistics.losses')}
      />
      {formik.touched.statistics && formik.touched.statistics.losses ? (
        <div>{formik.errors.statistics && formik.errors.statistics.losses}</div>
      ) : null}

      <label htmlFor="statistics.winPercentage">Win Percentage:</label>
      <input
        type="number"
        id="statistics.winPercentage"
        {...formik.getFieldProps('statistics.winPercentage')}
        value={winratio}
      />
      {formik.touched.statistics && formik.touched.statistics.winPercentage ? (
        <div>{formik.errors.statistics && formik.errors.statistics.winPercentage}</div>
      ) : null}

      <button type="submit" onClick={handleClick}>
        Edit team
      </button>
      {formik.isSubmitting && <div>edited team</div>}
    </form>
  );
};

export default EditTeamForm;
