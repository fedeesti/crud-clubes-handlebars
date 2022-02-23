const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');

const URL = 'http://localhost:';
const PORT = 8080;

const app = express();
const hbs = exphbs.create();
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

app.listen(PORT, () => {
  console.log(`granDT project in ${URL}${PORT}`);
});
