const campInfo = JSON.parse(camp)

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/outdoors-v11',
center: campInfo.geometry.coordinates,
zoom: 10
});


const marker = new mapboxgl.Marker()
    .setLngLat(campInfo.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(`<p>${campInfo.title}</p>`)
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());