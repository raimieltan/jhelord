const requestBody = {
    origin: {
        location: {
            latLng: {
                latitude: originLatitude,
                longitude: originLongitude,
            },
        },
    },
    destination: {
        location: {
            latLng: {
                latitude: destinationLatLng.lat,
                longitude: destinationLatLng.lng,
            },
        },
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
    },
    languageCode: "en-US",
    units: "IMPERIAL",
};

'AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs'

const test = { "_bodyBlob": { "_data": { "__collector": [Object], "blobId": "0e4fedba-563e-45e7-99f2-22e0befb28e0", "offset": 0, "size": 2388 } }, "_bodyInit": { "_data": { "__collector": [Object], "blobId": "0e4fedba-563e-45e7-99f2-22e0befb28e0", "offset": 0, "size": 2388 } }, "bodyUsed": false, "headers": { "map": { "access-control-allow-origin": "*", "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000", "cache-control": "no-cache, must-revalidate", "content-length": "2388", "content-type": "application/json; charset=UTF-8", "date": "Mon, 11 Dec 2023 12:06:29 GMT", "expires": "Fri, 01 Jan 1990 00:00:00 GMT", "pragma": "no-cache", "server": "mafe", "server-timing": "gfet4t7; dur=58", "vary": "Accept-Language", "x-frame-options": "SAMEORIGIN", "x-goog-maps-metro-area": "Iloilo", "x-xss-protection": "0" } }, "ok": true, "status": 200, "statusText": "", "type": "default", "url": "https://maps.googleapis.com/maps/api/geocode/json?address=Deca%20homes%20sta.%20Barbara&key=AIzaSyC3s4IIW2h7HEznfzDtg7RjpaGeFKBeGWs" }