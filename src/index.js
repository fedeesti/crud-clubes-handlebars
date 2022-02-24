const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const multer = require('multer');
const teams = require('../data/equipos.db.json');
const { createTeam, updateTeam } = require('./services/index');

const URL = 'http://localhost:';
const PORT = process.env.PORT || 8080;

const app = express();
const hbs = exphbs.create();
require('dotenv').config();
const upload = multer({ dest: './uploads/imagenes' });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname));
app.use(express.static('uploads'));

app.get('/', function (req, res) {
  const response = fs.readFileSync('./data/equipos.db.json');
  const teams = JSON.parse(response);

  res.render('home', {
    layout: 'main',
    data: {
      teams,
    },
  });
});

app.get('/create-team', function (req, res) {
  res.render('create-team', {
    layout: 'main',
  });
});

app.post('/create-team', upload.single('crestUrl'), function (req, res) {
  const newTeam = createTeam(req.body, req.file.filename);
  teams.push(newTeam);
  const newListTeams = JSON.stringify(teams, null, 2);
  fs.writeFile('./data/equipos.db.json', newListTeams, function (err) {
    if (err) throw new Error("Can't create team");
    console.log('Team added');
  });

  res.redirect('/');
});

app.get('/team/:id/watch', function (req, res) {
  const id = Number(req.params.id);
  const team = teams.find((team) => team.id === id);
  const API_KEY = process.env.API_KEY;
  const editAddress = team.address.replaceAll(' ', '+');

  res.render('view-team', {
    layout: 'main',
    data: {
      team,
      editAddress,
      API_KEY,
    },
  });
});

app.get('/team/:id/edit', function (req, res) {
  const id = Number(req.params.id);
  const team = teams.find((team) => team.id === id);

  res.render('edit-team', {
    layout: 'main',
    data: {
      team,
    },
  });
});

app.post('/team/:id/edit', upload.single('crestUrl'), function (req, res) {
  const id = Number(req.params.id);
  const team = teams.find((team) => team.id === id);
  const index = teams.findIndex((team) => team.id === id);

  if (index === -1) {
    throw new Error('Team not found');
  }

  const teamLogo = req.file === undefined ? team.crestUrl : `/imagenes/${req.file.filename}`;
  const update = updateTeam(req.body, teamLogo, teams[index].id);

  teams[index] = update;
  console.log(teams[index]);
  const newListTeams = JSON.stringify(teams, null, 2);
  fs.writeFile('./data/equipos.db.json', newListTeams, function (err) {
    if (err) throw new Error("Can't create team");
    console.log('Team update');
  });

  res.redirect('/');
});

app.get('/team/:id/delete', function (req, res) {
  const id = Number(req.params.id);
  const team = teams.find((team) => team.id === id);

  res.render('partials/modal-delete', {
    layout: 'main',
    data: {
      team,
    },
  });
});

app.post('/team/:id/delete', function (req, res) {
  const id = Number(req.params.id);
  const index = teams.findIndex((team) => team.id === id);

  if (index === -1) {
    throw new Error('Team not found');
  }

  teams.splice(index, 1);
  const newListTeams = JSON.stringify(teams, null, 2);
  fs.writeFile('./data/equipos.db.json', newListTeams, function (err) {
    if (err) throw new Error("Can't delete team");
    console.log('Team delete');
  });

  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`granDT project in ${URL}${PORT}`);
});
