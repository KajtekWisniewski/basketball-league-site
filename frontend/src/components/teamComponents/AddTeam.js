import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const formatTeamName = (teamName) => {
    return teamName.toLowerCase().replaceAll(" ", '-');
  };

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
  conference: Yup.string().required('Required'),
  division: Yup.string().required('Required'),
});

const AddTeamForm = () => {
  const [teamlessPlayers, setTeamlessPlayers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTeamlessPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/players/teamless');
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
      selectedPlayers: [],
      statistics: Yup.object().shape({
        wins: Yup.number().min(0, "Cant go into negatives"),
        losses: Yup.number().min(0, "Cant go into negatives"),
        winPercentage: Yup.number().min(0, "Cant go into negatives").max(100, "Percentage ends at 100"),
      }),
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:3001/teams', values);
        console.log('Team added successfully:', response.data);
      } catch (error) {
        console.error('Error adding team:', error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="name">Team Name:</label>
        <input
          type="text"
          id="name"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="error">{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          {...formik.getFieldProps('location')}
        />
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

      <div>
        <label>Add teamless players to roster:</label>
        {teamlessPlayers.map((player) => (
          <div key={player._id}>
            <input
              type="checkbox"
              id={`player-${player._id}`}
              value={player._id}
              onChange={() =>
                formik.setFieldValue(
                  'selectedPlayers',
                  formik.values.selectedPlayers.includes(player._id)
                    ? formik.values.selectedPlayers.filter((id) => id !== player._id)
                    : [...formik.values.selectedPlayers, player._id]
                )
              }
            />
            <label htmlFor={`player-${player._id}`}>{player.name}</label>
          </div>
        ))}
        {formik.touched.selectedPlayers && formik.errors.selectedPlayers && (
          <div className="error">{formik.errors.selectedPlayers}</div>
        )}
      </div>

      <button type="submit" disabled={formik.isSubmitting || !formik.isValid}>Add Team</button>
    </form>
  );
};

export default AddTeamForm;
