var map; // Global map variable
var geojsonLayer; // Global variable to store the uploaded GeoJSON/shapefile layer
var osmLayer; // Global variable for the OSM base map layer
var imageLayer; // Global variable for the satellite imagery layer

document.addEventListener("DOMContentLoaded", function () {

    map = L.map("mapid").setView([17.3993, 78.49059], 19);

    // baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '© OpenStreetMap contributors'
    // }).addTo(map);

    document.getElementById("inputfile").addEventListener("change", function (event) {

        var mystyle = {
            color: "black",
            weight: 1.2,
            fill: true,
            fillColor: "transparent",
            fillOpacity: 0,
        };

        var file = event.target.files[0];

        if(!file)return;

        const reader = new FileReader;

        reader.onload = function(e){

            shp(e.target.result).then(function(geojson) {
                console.log("GeoJSON loaded:", geojson);

            
                const lyr = L.geoJSON(geojson,{ style: mystyle,

                    onEachFeature: function (feature, layer) {
                        
                        // hight light the polygone code starting
                        layer.on({
                            mouseover: function (e) {
                                e.target.setStyle({
                                    weight: 2,
                                    color: "#666",
                                    fillOpacity: 0.3
                                    });
                                },
                            mouseout: function (e) {
                                geojsonLayer.resetStyle(e.target);
                                }
                            });
                        // hight light the polygone code closing


                        try {
                            openbtn();
                        } catch(e) {
                            console.warn("openbtn function not available", e);
                        }

                        let popupContent = "<table border='1' style='border-collapse:collapse;'><b></br>Attributes</b></br>";

                        for ( let key in feature.properties)
                            {
                                popupContent += 
                                "<tr>"+
                                "<td> "+ key + " </td>" + 
                                "<td>" + feature.properties[key]+"</td>" +
                                "</tr>"
                            }

                            popupContent += "</table>";

                        //    layer.bindPopup(popupContent);
                       
                        layer.on("click", function () {
                            try {
                                openbtn();
                            } catch(e) {
                                console.warn("openbtn function not available", e);
                            }
                            document.getElementById("attr-table1").innerHTML = popupContent;
                        });
                        
                        

                    }
                });
                lyr.addTo(map);

                geojsonLayer = lyr;

                try {
                    var bounds = lyr.getBounds();
                    console.log("Layer bounds:", bounds);
                    console.log("Bounds valid:", bounds.isValid());
                    
                    if (bounds && bounds.isValid()) {
                        // Add a small delay to ensure the layer is rendered before zooming
                        setTimeout(function() {
                            try {
                                map.fitBounds(bounds, {padding: [50, 50]});
                                console.log("Successfully zoomed to layer");
                            } catch(zoomError) {
                                console.error("Error during zoom:", zoomError);
                            }
                        }, 100);
                    } else {
                        console.warn("Layer bounds are not valid");
                    }
                } catch(boundsError) {
                    console.error("Error getting layer bounds:", boundsError);
                }
            }).catch(function(error) {
                console.error("Error loading shapefile:", error);
            });

        };
        reader.readAsArrayBuffer(file);
    });

     map.on("click", function(e) {
        console.log("Map clicked");
        if (map.hasLayer(wmsLayers["ExistingLandUse"])) {
            getFeatureInfo(e, wmsLayers["ExistingLandUse"], "SpatialData:Existing_Land_Use_Metpally" );
            }
        });
        
   });


   
function getFeatureInfo(evt, layer, layerName) {

    var point = map.latLngToContainerPoint(evt.latlng, map.getZoom());

    var size = map.getSize();

    var url =
        layer._url +
        L.Util.getParamString({
            request: "GetFeatureInfo",
            service: "WMS",
            srs: "EPSG:4326",
            styles: "",
            transparent: true,
            version: "1.1.1",
            format: "image/png",
            bbox: map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: layerName,
            query_layers: layerName,
            info_format: "application/json",
            x: Math.round(point.x),
            y: Math.round(point.y)
        });

    console.log(url);
    fetch("/getfeatureinfo/?" + url.split("?")[1])
    .then(response => response.json())
    .then(data => {

        if (data.features.length === 0) {

            document.getElementById("attr-table1").innerHTML =
                "<b>No feature selected.</b>";

            return;
        }

        // Get properties of the selected WMS feature
        var properties = data.features[0].properties;

        // Build HTML table
        var popupContent = "<table border='1' style='border-collapse:collapse;width:100%;'>";
        popupContent += "<tr><th>Field</th><th>Value</th></tr>";

        for (let key in properties) {

            popupContent +=
                "<tr>" +
                "<td>" + key + "</td>" +
                "<td>" + properties[key] + "</td>" +
                "</tr>";
        }

        popupContent += "</table>";

        // Display in your existing attribute table
        document.getElementById("attr-table1").innerHTML = popupContent;

    })
    .catch(function (error) {
        console.error(error);
    });
   

}


function openNav() {

    document.getElementById("mySidenav").style.width = "280px";
    }
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        }

var wmsLayers = {};




function Masterplan1(checkbox, layerName) {

    const wmsConfig = {
        "ExistingLandUse": {
            url: "http://107.149.105.165:8080/geoserver/SpatialData/wms",
            layers: "SpatialData:Existing_Land_Use_Metpally",
            bounds: [[18.82385378319702, 78.58564940534033], [18.886220028083216, 78.65497509892302]]
        },

        "RightofWay": {
            url: "http://107.149.105.165:8080/geoserver/SpatialData/wms",
            layers: "SpatialData:Right_of_Way",
            // bounds: [[18.82385378319702, 78.58564940534033], [18.886220028083216, 78.65497509892302]]
        },

        "RoadCenterLine": {
            url: "http://107.149.105.165:8080/geoserver/SpatialData/wms",
            layers: "SpatialData:Road_Center_Line",
            maxZoom: 30
            // bounds: [[18.82385378319702, 78.58564940534033], [18.886220028083216, 78.65497509892302]]
          
        }
        
        
    };

    if (checkbox.checked) {

        if (!wmsLayers[layerName]) {

            wmsLayers[layerName] = L.tileLayer.wms(
                wmsConfig[layerName].url,
                {
                    layers: wmsConfig[layerName].layers,
                    format: "image/png",
                    transparent: true,
                    version: "1.1.1",
                    opacity: 2,
                    zIndex: 1000
                }
            );
        }

        wmsLayers[layerName].addTo(map);
        wmsLayers[layerName].bringToFront();
        if (wmsConfig[layerName].bounds) {
            map.fitBounds(wmsConfig[layerName].bounds, {padding: [10, 10]});
        }
    } 
    else {

        if (wmsLayers[layerName]) {
            map.removeLayer(wmsLayers[layerName]);
        }
    }
}


                // Leaflet Map View
function showmap(checkbox) {
    if (checkbox.checked) {
        if (!osmLayer) {
            osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 30,
                attribution: '© OpenStreetMap contributors',
                zIndex: 1
            });
        }
        osmLayer.addTo(map);
    } else {
        if (osmLayer && map.hasLayer(osmLayer)) {
            map.removeLayer(osmLayer);
        }
    }
}

                // Satellite image view

function showImage(checkbox) {

    if (checkbox.checked) {
        if (!imageLayer) {
            imageLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
                maxNativeZoom: 15,
                maxZoom: 30,
                attribution: 'Tiles © Esri',
                zIndex: 1
            });
        }
        imageLayer.addTo(map);
    } else {
        if (imageLayer && map.hasLayer(imageLayer)) {
            map.removeLayer(imageLayer);
        }
    }
}

