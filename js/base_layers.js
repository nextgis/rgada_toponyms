/**
 * Created by yellow on 01.11.16.
 */
var providers = {};

    providers['OpenStreetMap_DE'] = {
        title: 'osm de',
        icon: 'img/iconLayers/openstreetmap_de.png',
        layer: L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
    };


    providers['OpenStreetMap_BlackAndWhite'] = {
        title: 'osm bw',
        icon: 'img/iconLayers/openstreetmap_blackandwhite.png',
        layer: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
    };

    providers['OpenStreetMap_Mapnik'] = {
        title: 'osm',
        icon: ' img/iconLayers/openstreetmap_mapnik.png',
        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
    };
    var baseLayers = [];
    for (var providerId in providers) {
        baseLayers.push(providers[providerId]);
    }

    baseLayers.push({
        title: 'empty',
        layer: L.tileLayer('')
    });
