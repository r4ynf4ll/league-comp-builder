// Script to fetch and extract champion data from Riot Data Dragon
// Usage: node fetch_champions.js

const axios = require('axios');
const fs = require('fs');

async function fetchChampions() {
  try {
    // Get latest version
    const versionsRes = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const latest = versionsRes.data[0];
    const DATA_URL = `https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`;
    const res = await axios.get(DATA_URL);
    // Save full champion.json for process_dd_champion.js compatibility
    fs.mkdirSync('node_modules', { recursive: true });
    fs.writeFileSync('node_modules/champion.json', JSON.stringify(res.data, null, 2));
    console.log('champion.json saved to node_modules/champion.json');
  } catch (err) {
    console.error('Error fetching champion data:', err.message);
  }
}

fetchChampions();
