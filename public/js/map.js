mapboxgl.accessToken =mapToken;

console.log(mapToken);
const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    // console.log(coordinates);

const marker = new mapboxgl.Marker()
.setLngLat(coordinates)
.addTo(map);