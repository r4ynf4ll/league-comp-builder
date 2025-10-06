// Script to auto-tag champions for engage, poke, CC, and teamfight based on Data Dragon blurbs and tags
// Usage: node auto_tag_champions.js

const fs = require('fs');

const champList = JSON.parse(fs.readFileSync('champion_list.json'));

function scoreTag(champ) {
  // Improved scoring: weight tags more, add more keywords, boost for common archetypes
  let engage = 1, poke = 1, cc = 1, teamfight = 1;
  const tags = champ.tags.join(' ').toLowerCase();
  const blurb = champ.blurb.toLowerCase();

  // Engage: Fighter, Tank, Assassin, Diver, Initiator, Engage, Charge, Dash, Jump, Leap, Dive, All-in
  if (/fighter|tank|assassin|diver|initiator|engage|charge|dash|jump|leap|dive|all-in/.test(tags)) engage += 3;
  if (/engage|initiate|charge|dash|jump|leap|dive|all-in|aggressive|start fights|initiation/.test(blurb)) engage += 2;

  // Poke: Mage, Marksman, Artillery, Poke, Range, Harass, Projectile, Skillshot, Long Range, Sniper
  if (/mage|marksman|artillery|poke|range|harass|projectile|skillshot|sniper/.test(tags)) poke += 3;
  if (/poke|harass|skillshot|projectile|long range|sniper|chip damage|ranged/.test(blurb)) poke += 2;

  // CC: Tank, Support, Controller, Stun, Root, Knockup, Slow, Disrupt, Crowd Control, Silence, Suppress, Taunt, Fear, Immobilize
  if (/tank|support|controller|stun|root|knockup|slow|disrupt|crowd control|silence|suppress|taunt|fear|immobilize/.test(tags)) cc += 3;
  if (/stun|root|knockup|slow|disrupt|crowd control|silence|suppress|taunt|fear|immobilize|lockdown|disable/.test(blurb)) cc += 2;

  // Teamfight: Teamfight, Area, AoE, Ultimate, Group, Synergy, Wombo, Combo, Zone, Zoning, Multi-target, Mass, Large-scale
  if (/teamfight|area|aoe|ultimate|group|synergy|wombo|combo|zone|zoning|multi-target|mass|large-scale/.test(tags)) teamfight += 3;
  if (/teamfight|aoe|synergy|ultimate|group|wombo|combo|zone|zoning|multi-target|mass|large-scale|team|group|big fights|large fights/.test(blurb)) teamfight += 2;

  // Bonus for classic engage champs
  if (/malphite|amumu|leona|nautilus|jarvan|zac|sejuani|wukong|camille|rakan|alistar|rell|vi|gragas|oriana|galio|kennen|sion|ornn|rammus|shen|volibear/.test(champ.name.toLowerCase())) engage += 2;
  // Bonus for classic poke champs
  if (/xerath|ziggs|jayce|caitlyn|varus|ezreal|karma|seraphine|velkoz|nidalee|lux|brand|zoe|jhin|kogmaw|miss fortune/.test(champ.name.toLowerCase())) poke += 2;
  // Bonus for classic CC champs
  if (/leona|nautilus|thresh|morgana|braum|alistar|amumu|sejuani|malphite|lissandra|vi|janna|sion|ornn|galio|blitzcrank|pyke|rell|taric|shen|rammus/.test(champ.name.toLowerCase())) cc += 2;
  // Bonus for classic teamfight champs
  if (/amumu|malphite|orianna|kennen|seraphine|galio|wukong|sejuani|zac|jarvan|miss fortune|sion|ornn|rammus|gragas|lissandra|azir|swain|anivia|velkoz|lux|brand|ziggs|xerath/.test(champ.name.toLowerCase())) teamfight += 2;

  // Clamp scores to max 5 per category
  engage = Math.min(engage, 5);
  poke = Math.min(poke, 5);
  cc = Math.min(cc, 5);
  teamfight = Math.min(teamfight, 5);

  return { engage, poke, cc, teamfight };
}

const taggedChampions = champList.map(champ => ({
  name: champ.name,
  title: champ.title,
  tags: champ.tags,
  blurb: champ.blurb,
  scores: scoreTag(champ)
}));

fs.writeFileSync('champion_tags.json', JSON.stringify(taggedChampions, null, 2));
console.log('Champion tags saved to champion_tags.json');
