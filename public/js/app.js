let app;

const handleLoadEvent = function(event) {
  const views = [];

  app = new Vue({
    el: '#application',
    data: {cities: []}
  });

  const cities = ['Flagstaff, AZ', 'Phoenix, AZ', 'Sedona, AZ', 'Tucson, AZ'];
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
  props: ['item'],
  template: `<div class="mtb-city">
    <header>
      <h1 class="mtb-city-name">{{item.city}}</h1>
      <div v-bind:class="'wu wu-64 wu-black wu-' + item.icon"></div>
      <div>{{item.conditions}}</div>
    </header>

    <section class="info">
        <div class="mtb-forecast">
          <span class="mtb-forecast-label">High</span>
          <span class="mtb-forecast-value">{{item.high}}&deg;</span>
          <span class="mtb-forecast-label">Low</span>
          <span class="mtb-forecast-value">{{item.low}}&deg;</span>
        </div>
        <p>
          <span class="mtb-forecast-label">Sunrise</span>
          <span class="mtb-forecast-value">{{item.sunrise}}</span>
        </p>
        <p>
          <span class="mtb-forecast-label">Sunset</span>
          <span class="mtb-forecast-value">{{item.sunset}}</span>
        </p>
    </section>
  </div>`
});

window.onload = handleLoadEvent;
