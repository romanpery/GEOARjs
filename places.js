
window.onload = () => {
    let method = 'dynamic';

    // if you want to statically add places, de-comment following line:
    method = 'static';
    if (method === 'static') {
        let places = staticLoadPlaces();
        return renderPlaces(places);
    }

    if (method !== 'static') {
        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};




function staticLoadPlaces() {
    return [
        {
            name: "CVS",
            location: {
                lat: , // change here latitude if using static data
                lng: , // change here longitude if using static data
            }
        },
        
        {
            name: 'Blink Fitness',
            location: {
                lat: ,
                lng: ,
            }
        },

        {
            name: 'Bus',
            location: {
                lat: ,
                lng: ,
            }
        },

        

    ];
}



// getting places from REST APIs
function dynamicLoadPlaces(position) {
    let params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: 'SUE1PJNIZJU31SLLXSSQJGVWAIIH4QIPYH5N4HBZFLAMKB5U',
        clientSecret: 'FNCCYIW2Z21P12QB02U4A5X5D0F5YV0O2OURDVXQTSH0XPUV',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    let corsProxy = 'https://tlaxiaco.herokuapp.com/';

    // Foursquare API
    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
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

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        // add place name
       // let text = document.createElement('a-link');
       // text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
       // text.setAttribute('title', place.name);
        text.setAttribute('href', 'http://www.example.com/');
        // text.setAttribute('scale', '10 10 10');


        // add place icon
        const icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        icon.setAttribute('name', place.name);
        icon.setAttribute('src', './map-marker.png');


        icon.setAttribute('scale', '30, 30, 30');

        icon.addEventListener('loaded', () => {window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
         });



        text.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(text);
        scene.appendChild(icon);
    });
}
