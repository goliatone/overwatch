'use strict';
mapboxgl.accessToken = 'pk.eyJ1IjoicmV1c3RsZSIsImEiOiJjanNzYmZjdWowZjBjNGFwNHpxYmM1NjkxIn0.11yRBUvH5yc0RM1zFJadqw';

let INVENTORY_JSON_PATH = 'api/inventory.json'
let METRO_JSON_PATH = 'static/metro.json'

// Init Map
var map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 12,
    minZoom: 7,
    maxZoom: 20,
    center: {
        lng: 139.75917031249946,
        lat: 35.6723664164637
    },
    maxBounds: [
        [139.4821420801062, 35.37806665620483], // Southwest
        [140.02948630731896, 35.86424358430297] // Northeast
    ]
})

// Disable map rotation using right click + drag
map.dragRotate.disable()

// Disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation()


// Show favorites or not
function showFavorites(showFavorites) {
    if (showFavorites === false) {
        map.setFilter('stations-layer');
        localforage.setItem('showFavorites', false)
    } else {
        localforage.getItem('favoriteStations').then(function(favoriteStations) {
            map.setFilter('stations-layer', ['in', 'id'].concat(favoriteStations));
            localforage.setItem('showFavorites', true)
        })
    }
}


// Init map
map.once('style.load', function(e) {

    map.addSource('stations', {
        type: 'geojson',
        data: INVENTORY_JSON_PATH,
        buffer: 0,
        maxzoom: 12
    })

    // Find the index of the first symbol layer in the map style
    var layers = map.getStyle().layers;
    var firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': 'stations-layer',
        'type': 'circle',
        'source': 'stations',
        'paint': {
            'circle-color': {
                property: 'bike_count',
                type: 'interval',
                stops: [
                    [0, '#e24f4f'],
                    [1, '#e4ad46'],
                    [3, '#49ab47']
                    //[6, '#58d7e8']
                ]
            },
            'circle-radius': {
                property: 'bike_count',
                type: 'interval',
                stops: [
                    [0, 5],
                    [1, 5.5],
                    [3, 6]
                ]
            },
            'circle-stroke-width': 4, //2
            'circle-stroke-opacity': 0.05
        },
    }, firstSymbolId)

    map.addControl(new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true
    }))

    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }))

    map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['stations-layer']
        });
        if (!features.length) {
            return;
        }
        var feature = features[0];

        let plural = ((feature.properties.bike_count === 1) ? '' : 's')
        let coords = feature.geometry.coordinates.slice()
        coords = coords.reverse().join(',')
        let thisId = feature.properties.id

        var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(`
                <strong class="station-name">${feature.properties.name_en}</strong>
                <br/><br/>
                <div class="bike-count">
                    ${feature.properties.bike_count} bike${plural} available
                </div>
                <small><em>Updated every 15 minutes</em></small>
                <br/>
                <div class="fav-btn-container">
                    &nbsp;
                </div>
                <a href='https://www.google.com/maps/search/${coords}?hl=en' target='_blank'>Open in Google Maps</a>
            `)
            .addTo(map);

        function drawFavBtn() {
            localforage.getItem('favoriteStations').then(function(favorites) {
                if (!favorites || favorites.indexOf(thisId) === -1) {
                    document.querySelector('.fav-btn-container').innerHTML = `
                        <a href='#' data-action='addFavorite' data-station-id='${thisId}'>Add to Favorites</a>
                    `
                } else {
                    document.querySelector('.fav-btn-container').innerHTML = `
                        <a href='#' data-action='removeFavorite' data-station-id='${thisId}'>Remove from Favorites</a>
                    `
                }
                document.querySelector('.fav-btn-container').addEventListener('click', function(event) {
                    event.preventDefault()

                    let dataAction = event.target.getAttribute('data-action')
                    let dataStationId = parseInt(event.target.getAttribute('data-station-id'))

                    if (dataAction == 'addFavorite') {
                        favorites.push(dataStationId)
                        localforage.setItem('favoriteStations', favorites).then(function() {
                            drawFavBtn()
                        })
                    } else if (dataAction == 'removeFavorite') {
                        let filteredFavorites = favorites.filter(function(el) {
                            return el !== dataStationId;
                        })

                        localforage.setItem('favoriteStations', filteredFavorites).then(function() {
                            drawFavBtn()
                            localforage.getItem('showFavorites').then(function(showFavorites) {
                                if (showFavorites) {
                                    window.showFavorites(true)
                                }
                            })
                        })
                    }
                }, {
                    once: true
                })
            })

        }

        drawFavBtn()
    });

    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
    map.on('mousemove', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['stations-layer']
        });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

    // Set default showFavorites value
    localforage.getItem('showFavorites').then(function(showFavorites) {
        if (!showFavorites) {
            window.showFavorites(false)
        } else {
            window.showFavorites(true)
        }
    })

    // Set default favoriteStations
    localforage.getItem('favoriteStations').then(function(favoriteStations) {
        if (!favoriteStations) {
            localforage.setItem('favoriteStations', [])
        }
    })

    // Set map center / zoom (after init)
    localforage.getItem('mapZoom').then(function(val) {
        if (val) {
            map.setZoom(val)
        }
    })
    localforage.getItem('mapCenter').then(function(val) {
        if (val) {
            map.setCenter(val)
        }
    })


    // Add metro lines
    map.addSource('metro', {
        type: 'geojson',
        data: METRO_JSON_PATH,
        buffer: 0,
        maxzoom: 12
    })

    map.addLayer({
        'id': 'metro-layer',
        'type': 'line',
        'source': 'metro',
        'paint': {
            'line-color': '#9acd32',
            'line-width': 6,
            'line-opacity': 0.6
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
    }, 'stations-layer')

});


// Custom Favorites Control
class MapboxGLButtonControl {
    constructor({ className = "", title = "", eventHandler = evtHndlr }) {
        this._className = className;
        this._title = title;
        this._eventHandler = eventHandler;
    }

    onAdd(map) {
        this._btn = document.createElement("button");
        this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
        this._btn.type = "button";
        this._btn.title = this._title;
        this._btn.onclick = this._eventHandler;

        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
        this._container.appendChild(this._btn);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

// Add Favorites Button
const ctrlPoint = new MapboxGLButtonControl({
    className: "mapbox-gl-draw_point",
    title: "Show Favorites",
    eventHandler: function(foo) {
        localforage.getItem('showFavorites').then(function(showFavorites) {
            if (!showFavorites) {
                window.showFavorites(true)
            } else {
                window.showFavorites(false)
            }
        })
    }
});

map.addControl(ctrlPoint, "top-left");

// Save map center and zoom on change
map.on('dragend', function() {
    localforage.setItem('mapCenter', map.getCenter())
})

map.on('zoomend', function() {
    localforage.setItem('mapZoom', map.getZoom())
})

// Set map center / zoom (after init)
localforage.getItem('mapZoom').then(function(val) {
    let savedMapZoom = val
})
localforage.getItem('mapCenter').then(function(val) {
    let savedMapCenter = val
})