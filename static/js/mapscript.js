var map; // Global map variable
var currentLayer; // Global variable to store the current layer
var baseLayer; // Global variable to store the base map
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
    document.getElementById("mySidenav").style.width = "450px";
    }
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
        }
    

function Masterplan1(checkbox) {

    if (checkbox.checked) {

        // Checkbox ON
        currentLayer = L.tileLayer.wms(
            "http://localhost:8080/geoserver/webapplictiondata/ows",
            {
                layers: "Urban_Land_Use_And_Cover",
                styles: "",
                format: "image/png",
                transparent: true,
                version: "1.1.1",
                srs: "EPSG:3857",
                fillColor: "transparent",
                fillOpacity: 0,
                attribution: '© GeoServer',
            }
    ).addTo(map);
    map.setView([17.72, 79.16], 15);
       
    } else {
        //Checkbox OFF
        if (currentLayer) {
            map.removeLayer(currentLayer);
            }
        }
}    



function showmap(checkbox) {
    if (checkbox.checked) {
         mapLayers = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 21,
            attribution: '© OpenStreetMap contributors'
            }).addTo(map);
                
    } else {
        if (mapLayers) {
            map.removeLayer(mapLayers);
            }
        }
}

function showImage(checkbox) {

    if (checkbox.checked) {
        imagelayers = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
            maxNativeZoom: 15,
            maxZoom: 21,
            attribution: 'Tiles © Esri'
        }).addTo(map);
                
    } else {
        if (imagelayers) {
            map.removeLayer(imagelayers);
            }
        }
}
