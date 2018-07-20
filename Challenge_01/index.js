const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const nunjucks = require('nunjucks');
const moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { name, birthDate } = req.body;
  const age = moment().diff(moment(birthDate, 'YYYY-MM-DD'), 'years');
  res.redirect(age >= 18 ? `./major?name=${name}` : `./minor?name=${name}`);
});

app.get('/major', (req, res) =>  {
  const { name } = req.query;
  res.render('major', { name });
});

app.get('/minor', (req, res) =>  {
  const { name } = req.query;
  res.render('minor', { name });
});

app.listen(3000);
