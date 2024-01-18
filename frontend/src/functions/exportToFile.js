const axios = require('axios');

export default async function exportDataToFile(endpoint) {
  try {
    if (endpoint === '') {
      throw new Error('choose a proper endpoint');
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}`
    );
    const data = await response.data;

    const jsonData = JSON.stringify(data);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${endpoint}_export.json`;
    link.click();
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}
