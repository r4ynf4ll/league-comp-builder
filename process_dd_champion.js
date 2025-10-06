// Script to process champion.json from Data Dragon and generate synergy scores
// Usage: node process_dd_champion.js

const fs = require('fs');
const path = './node_modules/champion.json';

const raw = JSON.parse(fs.readFileSync(path));
const champions = Object.values(raw.data);

function scoreChampion(champ) {
  // Use tags, blurb, and title for scoring
  let engage = 1, poke = 1, cc = 1, teamfight = 1;
  const tags = champ.tags.join(' ').toLowerCase();
  const blurb = (champ.blurb || '').toLowerCase();
  const title = (champ.title || '').toLowerCase();
  const allText = tags + ' ' + blurb + ' ' + title;

  // ENGAGE cumulative keyword matching
  const engageKeywords = [
    'engage','initiate','charge','dash','jump','leap','dive','all-in','aggressive','start fights','initiation','gapclose','knockback','pull','hook','taunt','flash'
  ];
  const engageTagKeywords = ['fighter','tank','assassin','diver','initiator'];
  engageKeywords.forEach(kw => {
    if (allText.includes(kw)) engage++;
  });
  engageTagKeywords.forEach(kw => {
    if (tags.includes(kw)) engage++;
  });
  engage = Math.min(engage, 5);

  // POKE cumulative keyword matching
  const pokeKeywords = [
    'poke','harass','skillshot','projectile','long range','sniper','chip damage','ranged','artillery','missile','bomb','arrow','spear','bullet','laser','orb','rocket','grenade'
  ];
  const pokeTagKeywords = ['mage','marksman','artillery'];
  pokeKeywords.forEach(kw => {
    if (allText.includes(kw)) poke++;
  });
  pokeTagKeywords.forEach(kw => {
    if (tags.includes(kw)) poke++;
  });
  poke = Math.min(poke, 5);

  // CC cumulative keyword matching
  const ccKeywords = [
    'stun','root','knockup','slow','disrupt','crowd control','silence','suppress','taunt','fear','immobilize','lockdown','disable','airborne','snare','sleep','polymorph','freeze','blind'
  ];
  const ccTagKeywords = ['tank','support','controller'];
  ccKeywords.forEach(kw => {
    if (allText.includes(kw)) cc++;
  });
  ccTagKeywords.forEach(kw => {
    if (tags.includes(kw)) cc++;
  });
  cc = Math.min(cc, 5);

  // TEAMFIGHT cumulative keyword matching
  const teamfightKeywords = [
    'teamfight','aoe','synergy','ultimate','group','wombo','combo','zone','zoning','multi-target','mass','large-scale','area','radius','circle','cone','line','field','zone control','team','big fights','large fights'
  ];
  const teamfightTagKeywords = ['teamfight','area','aoe','ultimate','group','synergy','wombo','combo','zone','zoning','multi-target','mass','large-scale'];
  teamfightKeywords.forEach(kw => {
    if (allText.includes(kw)) teamfight++;
  });
  teamfightTagKeywords.forEach(kw => {
    if (tags.includes(kw)) teamfight++;
  });
  teamfight = Math.min(teamfight, 5);

  return { engage, poke, cc, teamfight };
}

const taggedChampions = champions.map(champ => ({
  name: champ.name,
  title: champ.title,
  tags: champ.tags,
  scores: scoreChampion(champ)
}));

fs.writeFileSync('champion_tags.json', JSON.stringify(taggedChampions, null, 2));
console.log('Champion tags saved to champion_tags.json');
