<svelte:head>
    <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>
<script>
    import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
    import { onMount, onDestroy } from 'svelte';

    import { activeListItem, activeMapItem } from '../stores.js';
    import incidents, {incidentItems} from '../stores/incidents';
    import { accessToken, activeCity } from '../consts.js';

    let map;

    /**
     * For each list item we generate an object with props for 
     * the given feature. Here we store metadata for each item
     * so we can access it later when we interact with list items
     * e.g. on click
     */ 
    function generateFeature({ address, description, coordinates }, index) {
        return {
            type: 'Feature',
            properties: {
                description: `<b>${address}</b><br/>${description}`,
                id: index
            },
            geometry: {
                type: 'Point',
                coordinates
            }
        };
    }

    /**
     * Update current data source. 
     * This will render all new features
     */ 
    function updateDataSource(features=[]) {
        if(!map.loaded()){
            return setTimeout(_ => {
                updateDataSource(features);
            }, 100);
        }
        map.getSource('places.source').setData({
            type: 'FeatureCollection',
            features: features.map(generateFeature)
        });

        /**
         * Animate map on first render
         */ 
        map.flyTo({ 
            center: features[0].coordinates,
            essential: true,
            curve: 1,
            // speed: 0.9,
            bearing: 0,
            duration: 5200,
            // zoom: 9,
            // pitch: 0
        });
    }
    window.updateDataSource = updateDataSource;

    function initializeMap() {
        mapboxgl.accessToken = accessToken;

        /**
         * dark-v10
         * light-v10
         */
        const mapOptions =  {
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
            center: activeCity.center,
            zoom: 15,
            pitch: 60, // pitch in degrees
            bearing: 30, // bearing in degrees
        };
    
        map = new mapboxgl.Map(mapOptions);
        const nav = new mapboxgl.NavigationControl();
        
        map.addControl(nav, 'top-right');

        map.on('load', async _ => {

            /**
             * Add source 
             */ 
            map.addSource('places.source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            map.addLayer({
                id: 'places',
                type: 'symbol',
                source: 'places.source',
                layout: {
                    'icon-image': 'police-11',
                    'icon-size': 2,
                    'icon-allow-overlap': true
                }
            });

            /**
             * Manage Popup on click
             */ 
            map.on('click', 'places', function({ features }) {
                const match = features[0];
                const coordinates = match.geometry.coordinates.slice();
        
                // Show popup
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(match.properties.description)
                    .addTo(map);

                // Set new active list item
                activeListItem.set(match.properties.id);
            });

            /**
             * Feature should show pointer on hover
             */
            map.on('mouseenter', 'places', _=> {
                map.getCanvas().style.cursor = 'pointer';
            });

            /**
             * Remove cursor
             */
            map.on('mouseleave', 'places', _=> {
                map.getCanvas().style.cursor = '';
            });


            await incidents.listItems('sacramento', {page:1, size:200});
        });
    }

    /**
     * Use reactivity to update map center when active 
     * item is updated via list, we update using store.
     */
    const unsubscribeActiveMapItem = activeMapItem.subscribe(newActiveMapItem => {
        if (map) {
            map.flyTo({ 
                center: $incidentItems[newActiveMapItem].coordinates,
                essential: true,
                curve: 1,
                // speed: 0.8,
                bearing: 0,
                duration: 3200,
                // zoom: 9,
                // pitch: 0
            });
        }
    });

    /**
     * Livecycle handler, register map on first
     * render.
     */ 
    onMount(initializeMap);

    /**
     * Remove listener on unmount
     */ 
    onDestroy(unsubscribeActiveMapItem);

    $: {
        if($incidentItems.length) {
            updateDataSource($incidentItems);
        }
    };
</script>

<style>
    #map {
        width: 100%;
        height: 100%;
        background-color: #393838;
        background-color: #393838;
        
    }

    #map:before {
        box-shadow: 20px 0 10px -10px rgba(0, 0, 0, 0.15) inset;
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        width: 20px;
        z-index: 1000;
    }
</style>

<div id="map"></div>
