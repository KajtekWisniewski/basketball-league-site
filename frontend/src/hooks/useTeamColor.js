import { useMemo } from 'react';

const useTeamColor = (teamName) => {
  const getColor = useMemo(() => {
    const teamColorSchema = {
      'boston-celtics': '#007a33',
      'toronto-raptors': '#b41a1a',
    };

    return teamColorSchema[teamName] || 'white';
  }, [teamName]);

  return getColor;
};

export default useTeamColor;