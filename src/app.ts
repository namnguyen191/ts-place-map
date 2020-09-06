import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;
const latInput = document.getElementById('lat')! as HTMLInputElement;
const lngInput = document.getElementById('lng')! as HTMLInputElement;

const GOOGLE_API_KEY = '';
type GoogleGeocodingResponse = {
    results: {
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
    }[];
    status: 'OK' | 'ZERO_RESULTS';
};
type MapZoomRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9| 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
let map: google.maps.Map;

function initMap(
    coordinates: { lat: number; lng: number },
    zoomLevel: MapZoomRange
): void {
    map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: zoomLevel
    });
    new google.maps.places.Autocomplete(addressInput, {
        types: ['geocode'],
    });
}

async function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;
    // Encoding address to create a URL for compatability with the API
    const encodedAddress = encodeURI(enteredAddress);

    // Send address to google API
    try {
        const res = await axios.get<GoogleGeocodingResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_API_KEY}`
        );
        if (res.data.status != 'OK') {
            throw new Error('Could not find address!');
        }
        const coordinates = res.data.results[0].geometry.location;
        map.setCenter(coordinates);
        map.setZoom(18);
        new google.maps.Marker({position: coordinates, map: map});
    } catch (err) {
        console.log(err);
    }
}

addressInput.addEventListener('change', () => {
    latInput.value = '';
    lngInput.value = '';
});

form.addEventListener('submit', searchAddressHandler);

initMap(
    {
        lat: 43.651070,
        lng: -79.347015
    },
    12
);