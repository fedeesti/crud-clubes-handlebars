const teams = require('../../data/equipos.db.json');
const competitions = require('../../data/competitions.json');

function createTeam(teamData, logo) {
  const newTeam = {
    id: generateId(),
    area: {
      id: findCountryId(teamData.country),
      name: teamData.country,
    },
    name: teamData.name,
    shortName: teamData.shortName,
    tla: teamData.name.substring(0, 3).toUpperCase(),
    crestUrl: logo === '' ? null : `/imagenes/${logo}`,
    address: teamData.address === '' ? null : teamData.address,
    phone: teamData.phone === '' ? null : teamData.phone,
    website: teamData.website === '' ? null : teamData.website,
    email: teamData.email === '' ? null : teamData.email,
    founded: teamData.founded === '' ? null : parseInt(teamData.founded),
    clubColors: teamData.clubColors.replaceAll(' ', ' / '),
    venue: teamData.venue === '' ? null : teamData.venue,
    lastUpdated: new Date(),
  };

  return newTeam;
}

function updateTeam(teamData, logo, id) {
  const team = {
    id: id,
    area: {
      id: findCountryId(teamData.country),
      name: teamData.country,
    },
    name: teamData.name,
    shortName: teamData.shortName,
    tla: teamData.name.substring(0, 3).toUpperCase(),
    crestUrl: logo,
    address: teamData.address === '' ? null : teamData.address,
    phone: teamData.phone === '' ? null : teamData.phone,
    website: teamData.website === '' ? null : teamData.website,
    email: teamData.email === '' ? null : teamData.email,
    founded: teamData.founded === '' ? null : parseInt(teamData.founded),
    clubColors: teamData.clubColors,
    venue: teamData.venue === '' ? null : teamData.venue,
    lastUpdated: new Date(),
  };

  return team;
}

function generateId() {
  const allId = [];
  const uuid = Math.trunc(Math.floor(Math.random() * Date.now()) / 1000000000);

  teams.forEach((team) => {
    allId.push(team.id);
  });

  if (allId.includes(uuid)) {
    generateId();
  }

  return uuid;
}

function findCountryId(country) {
  for (let i = 0; i <= competitions.length; i++) {
    if (competitions[i].country === country) {
      return competitions[i].id;
    }
  }
}

module.exports = { createTeam, updateTeam };
