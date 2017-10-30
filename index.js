const YQL = require('yql');
// const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');

function getWeather(text, callback) {
  text = text.replace(/[^a-z0-9, ]+/gi, '');

  const query = new YQL(`select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${text}")`);

  query.exec(function(err, data) {
    if (err) throw err;

    const {astronomy, item, location} = data.query.results.channel;
    const {condition, forecast} = item;

    const payload = {
      code: condition.code,
      icon: forecast[0].text.toLowerCase().replace(/[^a-z]+/ig, ''),
      city: location.city,
      region: location.region,
      conditions: forecast[0].text,
      high: forecast[0].high,
      low: forecast[0].low,
      sunrise: astronomy.sunrise,
      sunset: astronomy.sunset
    };

    callback(payload);
  });
}

const app = express();

app.get('/api/weather', (req, res) => {
  const city = req.query.city;
  if (city) getWeather(city, json => res.send(json));
  else res.send({error: 'the city query param is missing'});
});

app.use('/wu-icons/', express.static('public/wu-icons/'));
app.use('/css/', express.static('public/css/'));
app.use('/', express.static('public/'));

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.info('App listening at http://%s:%s', host, port);
});
