<svelte:head>
    <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>
<script>
    import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
    import { onMount, onDestroy } from 'svelte';

    import { activeListItem, activeMapItem } from '../stores.js';
    import incidents, {incidentItems} from '../stores/incidents';
    import { accessToken, activeCity, categoryOptions } from '../consts.js';
    // import LayerSelectorControl from '../mapbox-pugins/layer-selector.js';

    let map;

    /**
     * We use this to filter out by type
     */ 
    const layerIDs = [];

    /**
     * For each list item we generate an object with props for 
     * the given feature. Here we store metadata for each item
     * so we can access it later when we interact with list items
     * e.g. on click
     */ 
    function generateFeature({ address, description, coordinates, codeLabel }, index) {
        let {color, icon} = categoryOptions[codeLabel] || categoryOptions.other;

        return {
            type: 'Feature',
            properties: {
                description: `
                    <h3>${description}</h3>
                    <p>${address}</p>
                `,
                id: index,
                icon,
                color,
                codeLabel
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
     * TODO: Why does this function get triggered multiple times
     * befoe we have map and for so long?!
     */ 
    function updateDataSource(features=[]) {
        if(!map.loaded()) {
            // console.info('update source with map not loaded...');
            return setTimeout(_ => {
                updateDataSource(features);
            }, 400);
        }

        map.getSource('places.source').setData({
            type: 'FeatureCollection',
            features: features.map(addFeature)
        });

        /**
         * Animate map on first render
         */ 
        map.flyTo({ 
            center: features[0].coordinates,
            // essential: true,
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
            zoom: 15,
            minZoom: 7,
            maxZoom: 20,
            pitch: 0, // pitch in degrees
            bearing: 30, // bearing in degrees
            center: activeCity.center,
            attributionControl: false,
            /*maxBounds: [
                [139.4821420801062, 35.37806665620483], // Southwest
                [140.02948630731896, 35.86424358430297] // Northeast
            ]*/
        };

        const onLoadQuery = { page: 1, size: 200 };
    
        map = new mapboxgl.Map(mapOptions);
        const nav = new mapboxgl.NavigationControl();
        
        window.mapRef = map;
        
        map.addControl(nav, 'top-right');

        /*
        const layerSelector = new LayerSelectorControl({
            layers: ['poi-theft', 'poi-burglary', 'poi-forgery', 'poi-other']
        });
        map.addControl(layerSelector, 'bottom-right');
        */

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

            addHeatMap();

            /**
             * Query backend for our first page of items
             */ 
            await incidents.listItems('sacramento', onLoadQuery);
        });
    }

    function addHeatMap() {
        //https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer/
        map.addLayer({
            id: 'incidents-heat',
            type: 'heatmap',
            source: 'places.source',
            maxzoom: 15,
            paint: {
                // increase weight as diameter breast height increases
                'heatmap-weight': {
                    property: 'dbh',
                    type: 'exponential',
                    stops: [
                        [1, 0],
                        [62, 1]
                    ]
                },
                // increase intensity as zoom level increases
                'heatmap-intensity': {
                    stops: [
                        [11, 1],
                        [15, 3]         
                    ]
                },
                // assign color values be applied to points depending on their density
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(236,222,239,0)',
                    0.2, 'rgb(208,209,230)',
                    0.4, 'rgb(166,189,219)',
                    0.6, 'rgb(103,169,207)',
                    0.8, 'rgb(28,144,153)'
                ],
                // increase radius as zoom increases
                'heatmap-radius': {
                    stops: [
                        [11, 15],
                        [15, 20]
                    ]
                },
                // decrease opacity to transition into the circle layer
                'heatmap-opacity': {
                    default: 1,
                    stops: [
                        [14, 1],
                        [15, 0]
                    ] 
                },
            }
        });
    }

    function addFeature(incident, index) {
        /**
         * Make our feature
         */ 
        const feature = generateFeature(incident, index);
        const color = feature.properties.color;
        const symbol = feature.properties.icon;
        const label = feature.properties.codeLabel;

        const layerID = `poi-${label}`;
        
        if(!map.getLayer(layerID))  addLayer(layerID, symbol, label, color);

        return feature;
    }

    function addLayer(layerID, symbol, label, color='#000000') {

        map.addLayer({
            id: layerID,
            type: 'symbol',
            source: 'places.source',
            layout: {
                'icon-image': `${symbol}-15`,
                'icon-size': 2,
                //This only works with SDF(?) icons
                //@see https://github.com/mapbox/mapbox-gl-js/issues/1817#issuecomment-497446984
                // 'icon-color': color,
                'icon-allow-overlap': true,
                'text-field': label,
                'text-font': [
                    'Open Sans Bold',
                    'Arial Unicode MS Bold'
                ],
                'text-size': 11,
                'text-transform': 'uppercase',
                'text-letter-spacing': 0.05,
                'text-offset': [0, 1.5]
            },
                'paint': {
                'text-color': '#202',
                'text-halo-color': '#fff',
                'text-halo-width': 2
            },
            filter: ['==', 'icon', symbol]
        });
            
        layerIDs.push(layerID);

        /**
         * Manage Popup on click
         */ 
        map.on('click', layerID, function({ features }) {
            const match = features[0];
            const coordinates = match.geometry.coordinates.slice();

            setActiveMapItem(match.properties.id);
            setActiveListItem(match.properties.id);
        });

        /**
         * Feature should show pointer on hover
         */
        map.on('mouseenter', layerID, _=> {
            map.getCanvas().style.cursor = 'pointer';
        });

        /**
         * Remove cursor
         */
        map.on('mouseleave', layerID, _=> {
            map.getCanvas().style.cursor = '';
        });
    }

    /**
     * Use reactivity to update map center when active 
     * item is updated via list, we update using store.
     */
    const unsubscribeActiveMapItem = activeMapItem.subscribe(newActiveMapItem => {
        if (map) {
            const item = $incidentItems[newActiveMapItem];

            showPopup(item);

            flyTo(item.coordinates);
        }
    });

    function showPopup(item) {
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();

        let description = `
            <h3>${item.description}</h3>
            <p>${item.address}</p>
        `;

        new mapboxgl.Popup()
            .setLngLat(item.coordinates)
            .setHTML(description)
            .addTo(map);
    }

    function flyTo(coordinates) {
        map.flyTo({ 
            center: coordinates,
            // essential: true,
            curve: 1,
            // speed: 0.8,
            pitch: 60,
            bearing: 0,
            duration: 3200,
            // zoom: 9,
        });
    }

    function setActiveListItem(id) {
        activeListItem.set(id);
    }

    function setActiveMapItem(id) {
        activeMapItem.set(id);
    }

    function toggleLayerVisibility(layerID, visible=false) {
        const prop = visible ? 'visible' : 'none';
        layerIDs.forEach(function(layerID) {
            map.setLayoutProperty(layerID, 'visibility', prop);
        });
    }

    window.layerIDs = layerIDs;
    window.incidents = incidents;
    window.toggleLayerVisibility = toggleLayerVisibility;

    /**
     * Livecycle handler, register map on first
     * render.
     */ 
    onMount(initializeMap);

    /**
     * Remove listener on unmount
     */ 
    onDestroy(unsubscribeActiveMapItem);

    $: if($incidentItems.length > 0) updateDataSource($incidentItems);

</script>

<style>
    #map {
        width: 100%;
        height: 100%;
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
