export default function formatDatabaseData(inputString) {
  return inputString
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

