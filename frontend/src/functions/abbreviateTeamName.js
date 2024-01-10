export default function abbreviateTeamName(teamName) {
    const words = teamName.split('-');
    let abbreviation = '';
    if (words.length > 2) {
      abbreviation = words.map(word => word.slice(0, 1)).join('');
    } else if (words.length === 2) {
      abbreviation = words[0].slice(0, 3);
    }
  
    return abbreviation.toUpperCase();
  }