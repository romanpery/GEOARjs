const loadPlaces = function (coords) {
    // COMMENT FOLLOWING LINE IF YOU WANT TO USE STATIC DATA AND ADD COORDINATES IN THE FOLLOWING 'PLACES' ARRAY
    const method = 'api';

        const PLACES = [
            {
                name: "Vecino",
                location: {
                    lat: 17.271825, // add here latitude if using static data
                    lng: -97.667340, // add here longitude if using static data
                }
            },
            {
                name: "Vecino 2",
                location: {
                    lat: 17.272431, // add here latitude if using static data
                    lng: -97.666671, // add here longitude if using static data
                }
            },
    
            {
                name: "Vecino 3",
                location: {
                    lat: 17.272606, // add here latitude if using static data
                    lng: -97.667162, // add here longitude if using static data
                }
            },
    
        ];

    if (method === 'api') {
        return loadPlaceFromAPIs(coords);
    }

    return PLACES;
};

// getting places from REST APIs
function loadPlaceFromAPIs(position) {
    const params = {
        radius: 250,    // search places not farther than this value (in meters)
        clientId: 'HZIJGI4COHQ4AI45QXKCDFJWFJ1SFHYDFCCWKPIJDWHLVQVZ',
        clientSecret: 'GYRKWWJMO2WK3KIRWBXIN5FQAWXTVFIK2QM4VQWNQ4TRAKWH',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
                    const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('href', 'http://www.example.com/');
                    text.setAttribute('scale', '13 13 13');

                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(text);
                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};