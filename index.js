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
    const {code, date, temp} = condition;

    const dateNow = Date.now();
    const {sunrise, sunset} = astronomy;
    let today = forecast[0].date;
    let dateSunrise = new Date(`${today} ${sunrise}`);
    let dateSunset = new Date(`${today} ${sunset}`);

    if (dateNow > dateSunrise && dateNow > dateSunset) {
      today = forecast[1].date;
      dateSunrise = new Date(`${today} ${sunrise}`);
      dateSunset = new Date(`${today} ${sunset}`);
    }

    let icon = forecast[0].text.toLowerCase().replace(/[^a-z]+/ig, '');
    if (icon === 'scatteredthunderstorms') icon = 'chancetstorms';

    const payload = {
      code,
      icon,
      city: location.city,
      region: location.region,
      conditions: forecast[0].text,
      temperature: temp,
      high: forecast[0].high,
      low: forecast[0].low,
      sunrise: dateSunrise.toUTCString(),
      sunset: dateSunset.toUTCString(),
      updatedAt: new Date(date).toUTCString()
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
