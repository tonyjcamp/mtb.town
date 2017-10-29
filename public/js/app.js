let app;

const handleLoadEvent = function(event) {
  const views = [];

  app = new Vue({
    el: '#application',
    data: {cities: []}
  });

  const cities = ['Flagstaff, AZ', 'Phoenix, AZ', 'Sedona, AZ'];
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
    <header class="intro">
      <h1 class="location">{{item.city}}, {{item.region}}</h1>
    </header>

    <section class="info">
        <div v-bind:class="'wu wu-64 wu-black wu-' + item.icon"></div>
        <p>{{item.conditions}}</p>
        <p>High: {{item.high}}&deg; Low {{item.low}}&deg;</p>
        <p>Sunrise: {{item.sunrise}}</p>
        <p>Sunset: {{item.sunset}}</p>
    </section>
  </div>`
});

window.onload = handleLoadEvent;
