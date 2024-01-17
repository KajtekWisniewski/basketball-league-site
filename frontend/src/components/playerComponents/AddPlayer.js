import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styles from './PlayerPreview.module.css';
import React, { useState, useEffect, useReducer } from 'react';
import Link from 'next/link';
import { INITIAL_STATE, addPlayerReducer } from '@/reducers/AddPlayerReducer';

function getRandomNumber(min, max) {
  min = typeof min === 'number' ? min : 0;
  max = typeof max === 'number' ? max : 100;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const AddPlayerForm = () => {
  const [state, dispatch] = useReducer(addPlayerReducer, INITIAL_STATE);

  const initialValues = {
    name: '',
    age: state.calculatedAge,
    birthdate: '',
    countryOfOrigin: '',
    height: '',
    team: 'teamless',
    position: '',
    teamNumber: getRandomNumber(0, 100),
    pictureLink: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1627885.png',
    fantasyScore: 0,
    statistics: {
      gamesPlayed: 0,
      rebounds: 0,
      points: 0,
      foulsCommitted: 0,
      freeThrowsMade: 0,
      freeThrowPercentage: 0
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'name cannot be shorter than three characters'),
    age: Yup.number(),
    birthdate: Yup.date()
      .required('Birthdate is required')
      .max(
        new Date('2006-01-01'),
        'Selected date cannot be in the future and before 2006'
      ),
    countryOfOrigin: Yup.string().required('Country of Origin is required'),
    height: Yup.number()
      .required('Height is required')
      .min(160, 'Dwarves dont play in NBA')
      .max(240, 'This aint robert wadlow'),
    position: Yup.string().required('Position is required'),
    teamNumber: Yup.number()
      .required('Team Number is required')
      .min(0, 'Player cannot have a negative number')
      .max(99, 'Player cannot have number above 100'),
    pictureLink: Yup.string().url('Invalid URL').required('Picture Link is required'),
    fantasyScore: Yup.number()
      .min(0, 'Must be greater or equal to 0')
      .max(100, 'cant be higher than 100'),
    statistics: Yup.object().shape({
      gamesPlayed: Yup.number().min(0, 'Cant go into negatives'),
      rebounds: Yup.number().min(0, 'Cant go into negatives'),
      points: Yup.number().min(0, 'Cant go into negatives'),
      foulsCommitted: Yup.number().min(0, 'Cant go into negatives'),
      freeThrowsMade: Yup.number().min(0, 'Cant go into negatives'),
      freeThrowPercentage: Yup.number()
        .min(0, 'Cant go into negatives')
        .max(100, 'Percentage ends at 100')
    })
  });

  const onSubmit = async (values, { resetForm }) => {
    console.log(values);
    values.age = state.calculatedAge;
    try {
      const response = await axios.post('http://127.0.0.1:3001/players', values);
      console.log('Player added successfully:', response.data);
      dispatch({ type: 'SUBMIT', payload: response.data._id });
      resetForm();
    } catch (error) {
      dispatch({ type: 'ERROR' });
      console.error('Error adding player:', error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  useEffect(() => {
    const calculateAge = () => {
      const birthdate = formik.values.birthdate;
      const today = new Date();
      const birthDate = new Date(birthdate);
      let age = today.getFullYear() - birthDate.getFullYear();

      const todayMonth = today.getMonth();
      const birthMonth = birthDate.getMonth();

      if (
        todayMonth < birthMonth ||
        (todayMonth === birthMonth && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      dispatch({ type: 'CALCULATE', payload: age });
    };

    calculateAge();
  }, [formik.values.birthdate]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" {...formik.getFieldProps('name')} />
        {formik.touched.name && formik.errors.name && (
          <div className={styles.error}>{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          {...formik.getFieldProps('age')}
          value={state.calculatedAge}
          disabled
        />
        {formik.touched.age && formik.errors.age && (
          <div className={styles.error}>{formik.errors.age}</div>
        )}
      </div>

      <div>
        <label htmlFor="birthdate">Birthdate:</label>
        <input type="date" id="birthdate" {...formik.getFieldProps('birthdate')} />
        {formik.touched.birthdate && formik.errors.birthdate && (
          <div className={styles.error}>{formik.errors.birthdate}</div>
        )}
      </div>

      <div>
        <label htmlFor="countryOfOrigin">Country of Origin:</label>
        <select id="countryOfOrigin" {...formik.getFieldProps('countryOfOrigin')}>
          <option value="">Select Country</option>
          <option value="united-states">United States</option>
          <option value="canada">Canada</option>
        </select>
        {formik.touched.countryOfOrigin && formik.errors.countryOfOrigin && (
          <div className={styles.error}>{formik.errors.countryOfOrigin}</div>
        )}
      </div>

      <div>
        <label htmlFor="height">Height:</label>
        <input type="number" id="height" {...formik.getFieldProps('height')} />
        {formik.touched.height && formik.errors.height && (
          <div className={styles.error}>{formik.errors.height}</div>
        )}
      </div>

      <div>
        <label htmlFor="team">Team:</label>
        <input type="text" id="team" {...formik.getFieldProps('team')} disabled />
        {formik.touched.team && formik.errors.team && (
          <div className={styles.error}>{formik.errors.team}</div>
        )}
      </div>

      <div>
        <label htmlFor="position">Position:</label>
        <select id="position" {...formik.getFieldProps('position')}>
          <option value="">Select Position</option>
          <option value="point-guard">Point Guard</option>
          <option value="forward-guard">Forward Guard</option>
        </select>
        {formik.touched.position && formik.errors.position && (
          <div className={styles.error}>{formik.errors.position}</div>
        )}
      </div>

      <div>
        <label htmlFor="teamNumber">Team Number:</label>
        <input
          type="number"
          id="teamNumber"
          {...formik.getFieldProps('teamNumber')}
          disabled
        />
        {formik.touched.teamNumber && formik.errors.teamNumber && (
          <div className={styles.error}>{formik.errors.teamNumber}</div>
        )}
      </div>

      <div>
        <label htmlFor="pictureLink">Picture Link:</label>
        <input type="text" id="pictureLink" {...formik.getFieldProps('pictureLink')} />
        {formik.touched.pictureLink && formik.errors.pictureLink && (
          <div className={styles.error}>{formik.errors.pictureLink}</div>
        )}
      </div>

      <div>
        <label htmlFor="fantasyScore">Fantasy Score:</label>
        <input
          type="number"
          id="fantasyScore"
          {...formik.getFieldProps('fantasyScore')}
        />
        {formik.touched.fantasyScore && formik.errors.fantasyScore && (
          <div className={styles.error}>{formik.errors.fantasyScore}</div>
        )}
      </div>

      <div>
        <label htmlFor="statistics.gamesPlayed">Games Played:</label>
        <input
          type="number"
          id="statistics.gamesPlayed"
          {...formik.getFieldProps('statistics.gamesPlayed')}
        />
        {formik.touched['statistics.gamesPlayed'] &&
          formik.errors['statistics.gamesPlayed'] && (
            <div className={styles.error}>
              {formik.errors['statistics.gamesPlayed']}
            </div>
          )}
      </div>

      <div>
        <label htmlFor="statistics.rebounds">Rebounds:</label>
        <input
          type="number"
          id="statistics.rebounds"
          {...formik.getFieldProps('statistics.rebounds')}
        />
        {formik.touched['statistics.rebounds'] &&
          formik.errors['statistics.rebounds'] && (
            <div className={styles.error}>{formik.errors['statistics.rebounds']}</div>
          )}
      </div>

      <div>
        <label htmlFor="statistics.points">Points:</label>
        <input
          type="number"
          id="statistics.points"
          {...formik.getFieldProps('statistics.points')}
        />
        {formik.touched['statistics.points'] && formik.errors['statistics.points'] && (
          <div className={styles.error}>{formik.errors['statistics.points']}</div>
        )}
      </div>

      <div>
        <label htmlFor="statistics.foulsCommitted">Fouls Committed:</label>
        <input
          type="number"
          id="statistics.foulsCommitted"
          {...formik.getFieldProps('statistics.foulsCommitted')}
        />
        {formik.touched['statistics.foulsCommitted'] &&
          formik.errors['statistics.foulsCommitted'] && (
            <div className={styles.error}>
              {formik.errors['statistics.foulsCommitted']}
            </div>
          )}
      </div>

      <div>
        <label htmlFor="statistics.freeThrowsMade">Free Throws Made:</label>
        <input
          type="number"
          id="statistics.freeThrowsMade"
          {...formik.getFieldProps('statistics.freeThrowsMade')}
        />
        {formik.touched['statistics.freeThrowsMade'] &&
          formik.errors['statistics.freeThrowsMade'] && (
            <div className={styles.error}>
              {formik.errors['statistics.freeThrowsMade']}
            </div>
          )}
      </div>

      <div>
        <label htmlFor="statistics.freeThrowPercentage">Free Throw Percentage:</label>
        <input
          type="number"
          id="statistics.freeThrowPercentage"
          {...formik.getFieldProps('statistics.freeThrowPercentage')}
        />
        {formik.touched['statistics.freeThrowPercentage'] &&
          formik.errors['statistics.freeThrowPercentage'] && (
            <div className={styles.error}>
              {formik.errors['statistics.freeThrowPercentage']}
            </div>
          )}
      </div>

      <button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
        Add Player
      </button>
      {state.nameError && (
        <p className={styles.error}>Player with this name already exists</p>
      )}
      {state.submitted && (
        <Link className={styles.linkStyle} href={`/players/${state.playerPage}`}>
          <h2>player page</h2>
        </Link>
      )}
    </form>
  );
};

export default AddPlayerForm;
