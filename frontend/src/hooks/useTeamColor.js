import { useMemo } from 'react';

const useTeamColor = (teamName, color = '#CCCCCC') => {
  const getColor = useMemo(() => {
    const teamColorSchema = {
      'boston-celtics': '#007a33',
      'toronto-raptors': '#b41a1a',
      'new-york-knicks': '#0953a0',
      'atlanta-hawks': '#E03A3E',
      'brooklyn-nets': '#000000',
      'charlotte-hornets': '#00788C',
      'chicago-bulls': '#CE1141',
      'cleveland-cavaliers': '#6F263D',
      'dallas-mavericks': '#00538C',
      'denver-nuggets': '#0E2240',
      'detroit-pistons': '#C8102E',
      'golden-state-warriors': '#1D428A',
      'houston-rockets': '#CE1141',
      'indiana-pacers': '#002D62',
      'los-angeles-clippers': '#1D428A',
      'los-angeles-lakers': '#552583',
      'memphis-grizzlies': '#5D76A9',
      'miami-heat': '#98002E',
      'milwaukee-bucks': '#00471B',
      'minnesota-timberwolves': '#0C2340',
      'new-orleans-pelicans': '#0C2340',
      'oklahoma-city-thunder': '#007AC1',
      'orlando-magic': '#0077C0',
      'philadelphia-76ers': '#006BB6',
      'phoenix-suns': '#1D1160',
      'portland-trail-blazers': '#E03A3E',
      'sacramento-kings': '#5A2D81',
      'san-antonio-spurs': '#C4CED4',
      'utah-jazz': '#002B5C',
      'washington-wizards': '#002B5C',
      teamless: '#CCCCCC'
    };

    return teamColorSchema[teamName] || color;
  }, [teamName, color]);

  return getColor;
};

export default useTeamColor;
