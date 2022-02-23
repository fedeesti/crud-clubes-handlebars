const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const multer = require('multer');
const teams = require('../data/equipos.db.json');
const { createTeam } = require('./services/index');

const URL = 'http://localhost:';
const PORT = 8080;

const app = express();
const hbs = exphbs.create();
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

app.listen(PORT, () => {
  console.log(`granDT project in ${URL}${PORT}`);
});
