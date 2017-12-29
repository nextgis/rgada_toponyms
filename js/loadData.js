var layerLoadingPromises = [];

function loadData(){
    initLayerLoadingPromises();

    return new Promise(function(resolve, reject) {
        Promise.all(layerLoadingPromises).then(function(){
            resolve();
        });
    });
}

function initLayerLoadingPromises(){
    layers.forEach(function(layer, index){

        layerLoadingPromises.push(
            new Promise(function(resolve, reject) {

                $.ajax({
                    url: layer.url,
                    dataType: 'JSON'
                })
                    .done(function(data) {
                        var wkt_geom = data.geom,
                            crs3857 = new L.Proj.CRS('EPSG:3857');

                        layer.features =  data.features;

                        layer.geojson = L.geoJson(data, {
                            style: function(feature) {
                                return layer.style;
                            },
                            coordsToLatLng: function(coords) {       
                                var point = L.point(coords[0], coords[1]);
                                return crs3857.projection.unproject(point);
                            },
                            onEachFeature: function (feature, layer) {
                                layer.on({click: onClick});
                            },                            
                            pointToLayer: function(feature, latlng) {
                                return L.marker(latlng, {icon: defIcon});
                            }
                        })

                        if (layer.name !== "points"){
                            layer.geojson.addTo(mainMap);
                        } else{
                            var markers = L.markerClusterGroup({maxClusterRadius: 50});
                            markers.addLayer(layer.geojson);
                            markers.addTo(mainMap);
                        }

                        objectLayersGroup.addLayer(layer.geojson);
                        resolve();
                    })
                    .fail(function() {
                        reject(new Error("loading layers error"));
                    })

            })
        );

    });
}
