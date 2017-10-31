let app;

const handleLoadEvent = function(event) {
  app = new Vue({
    el: '#application',
    data: {cities: []}
  });

  const cities = [
    'Flagstaff, AZ',
    'Kingman, AZ',
    'Payson, AZ',
    'Pinetop, AZ',
    'Phoenix, AZ',
    'Prescott, AZ',
    'Sedona, AZ',
    'Tucson, AZ',
    'Gilbert, AZ'
  ];
  cities.forEach(fetchCityData);
};

const fetchCityData = (city, index) => {
  fetch(`/api/weather?city=${city}`)
    .then(response => {
      return response.json();
    })
    .then(json => {
      json.id = index;
      app.$data.cities.push(json);
    })
    .catch(error => console.error(error));
};

Vue.component('mtb-city', {
  methods: {
    getDaylightStatus: function() {
      const item = this.item;
      const dateSunrise = Date.parse(item.sunrise);
      const dateSunset = Date.parse(item.sunset);
      const now = Date.now();

      let label, value;

      if (now < dateSunrise) {
        label = 'sunrise';
        value = dateSunrise;
      } else {
        label = 'sunset';
        value = dateSunset;
      }

      const timeUntil = (value - now) * 0.001 / (60.0);
      return `${Math.floor(timeUntil / 60)} hours until ${label}`;
    }
  },
  props: ['item'],
  template: `<div class="mtb-city">
    <header>
      <h1 class="mtb-city-name">{{item.city}}</h1>
      <div class="mtb-city-weather">
        <div class="mtb-city-temperature">{{item.temperature}}&deg;</div>
        <div class="mtb-conditions">{{item.conditions}}</div>
        <div v-bind:class="'wu-' + item.icon" class="wu wu-64 wu-black"></div>
      </div>
    </header>
    <section>
      <div class="mtb-forecasts">
        <div class="mtb-forecast">
          <span class="mtb-forecast-value">{{item.high}}&deg;</span>
          <span class="mtb-forecast-label">Hi</span>
        </div>
        <div class="mtb-forecast">
          <span class="mtb-forecast-value">{{item.low}}&deg;</span>
          <span class="mtb-forecast-label">Lo</span>
        </div>
      </div>
    </section>
    <footer class="mtb-astronomy">
        <div class="mtb-astronomy-status">{{getDaylightStatus()}}</div>
    </footer>
  </div>`
});

window.onload = handleLoadEvent;
