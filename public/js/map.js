mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: coordinates,
  zoom: 9,
});

console.log(coordinates);

new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
