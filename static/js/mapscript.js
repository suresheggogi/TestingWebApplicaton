var map; // Global map variable
var geojsonLayer; // Global variable to store the uploaded GeoJSON/shapefile layer
var masterplanLayer; // Global variable for the Nalgonda Master Plan WMS overlay
var osmLayer; // Global variable for the OSM base map layer
var imageLayer; // Global variable for the satellite imagery layer
var bounds;

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

                currentLayer = lyr; // Store the layer globally
                
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
   
});


function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    }
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        }
    
// Master Plan view code

function Masterplan1(checkbox) {

    if (checkbox.checked) {

        // Checkbox ON
        if (!masterplanLayer) {
            masterplanLayer = L.tileLayer.wms(
                "http://192.168.100.21:8080/geoserver/webapplictiondata/wms",
                {
                    layers: "webapplictiondata:Urban_Land_Use_And_Cover",
                    styles: "",
                    format: "image/png",
                    transparent: true,
                    version: "1.1.1",
                    srs: "EPSG:3857",
                    attribution: '© GeoServer',
                    zIndex: 1000,
                    maxZoom: 30,
                }
            );
        }
        masterplanLayer.addTo(map);
        masterplanLayer.bringToFront();
        map.fitBounds([
            [17.694466804087778, 79.13554123671189],  // SW (Min Y, Min X)
            [17.74100204698142, 79.18874530624664]   // NE (Max Y, Max X)
            ]);

        // map.setView([17.72, 79.16], 5);
        
       
    } else {
        // Checkbox OFF
        if (masterplanLayer && map.hasLayer(masterplanLayer)) {
            map.removeLayer(masterplanLayer);
        }
    }
}


// Map view code

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

    if (masterplanLayer && map.hasLayer(masterplanLayer)) {
        masterplanLayer.bringToFront();
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

    if (masterplanLayer && map.hasLayer(masterplanLayer)) {
        masterplanLayer.bringToFront();
    }
}
