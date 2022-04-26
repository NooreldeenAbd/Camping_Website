const campInfo = camp

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/outdoors-v11',
center: camp.geometry.coordinates,
zoom: 10
});


const marker = new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(`<p>${camp.title}</p>`)
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());