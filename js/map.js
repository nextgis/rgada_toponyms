/**
 * Created by Tabletko on 01.11.2016.
 */


var mainMap = L.map('map'),
    popup = $(".object-info"),
    popupInner = popup.find(".object-info__content"),
    overlay = null,
    overlay_hash = null,
    raster_layers = [],
    selected_markers = [],
    centroids,
    markers,
    defIcon =  L.icon({
        iconUrl: './img/leaflet/marker-icon.png',
        iconSize: [28, 40],
        iconAnchor: [13, 40]
    }),
    selIcon =  L.icon({
        iconUrl: './img/leaflet/marker-icon-red.png',
        iconSize: [28, 40],
        iconAnchor: [13, 40]
    });

// Change the position of the Zoom Control to a newly created placeholder.
addControlPlaceholders(mainMap);
mainMap.zoomControl.setPosition('verticalcenterleft');

// BaseLayers
L.control.scale({imperial: false, position: 'bottomright'}).addTo(mainMap);
L.control.mousePosition({position: 'bottomright'}).addTo(mainMap);
var ctrl = L.control.iconLayers(baseLayers, {
    maxLayersInRow: 1
}).addTo(mainMap);

// Menu control
var menuControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

    container.innerHTML = "<a class='menu-control toggle-control active' href='#'><svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>" +
                                "<path d='M0 0h24v24H0z' fill='none'/>" +
                                "<path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'/>" +
                           "</svg></a>";

    $(container).find(".menu-control").on("click", function(e){
        e.stopPropagation();
        if ($(this).hasClass("active")){
            $(this).removeClass("active");
            $(".right-panel.active").each(function(){
                hideRightPanel($(this));
            });            
        } else{
            $(this).addClass("active");
            showRightPanel($(".object-list"));
        }
    });

    return container;
  }
});

mainMap.addControl(new menuControl());

// About control
var aboutControl = L.Control.extend({
  options: {
    position: 'upperbottomright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

    container.innerHTML = "<a class='about-control' href='#'>?</a>";

    $(container).find(".about-control").on("click", function(e){
        e.stopPropagation();
        if ($(".about").hasClass("active")){
            hideRightPanel($(".about"));
        } else{
            showRightPanel($(".about"));
        }
    });

    return container;
  }
});

mainMap.addControl(new aboutControl());

// Add objects layers
var objectLayersGroup = L.featureGroup([]);

loadData().then(function(){
    mainMap.fitBounds(objectLayersGroup.getBounds());
    layers.forEach(function(layer){
        layer.geojson.bringToFront();
    });
    vueApp.$refs.plans.init();
})

$("[data-close-right-panel]").on("click", function(e){
    hideRightPanel($("#"+$(this).data("close-right-panel")));
    e.preventDefault();
});

function onClick(e) {
    vueApp.$refs.plans.activateItem(this, {
        withZooming: false, 
        withScrolling: true
    });
}

function highlightFeature(layer){
    if (layer.feature.geometry.type != "Point"){
        layer.setStyle({
            color: "#FFC107",
            weight: 4
        });
    } else {
        layer.setIcon(selIcon);
    }
}

function unhighlightFeature(layer){

    if (layer.feature.geometry.type != "Point"){
        if (layer.sourceLayer && layer.sourceLayer.style)
            layer.setStyle(layer.sourceLayer.style);
    } else {
        layer.setIcon(defIcon);
    }
}

// Create centered Control placeholders
function addControlPlaceholders(map) {
    var corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;
        corners[vSide + hSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenter', 'left');
    createCorner('verticalcenter', 'right');
    createCorner('upperbottom', 'right');
}

// Right panel
function showRightPanel(el){
    if (!el.hasClass("active")){
        $(".right-panel--dyn.active").each(function(){
            hideRightPanel($(this));
        });
        $("body").addClass("body--withRightPanel");
        el.addClass("active");        
        setTimeout(function(){ mainMap.invalidateSize(); }, 400);
    }
}

function hideRightPanel(el){
    if (el.hasClass("active")){
        el.removeClass("active");

         if (!$(".menu-control").hasClass("active")){
            $("body").removeClass("body--withRightPanel");
            setTimeout(function(){ mainMap.invalidateSize();}, 400);
        }
    }
}