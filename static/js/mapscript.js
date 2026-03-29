var map; // Global map variable
var currentLayer; // Global variable to store the current layer

document.addEventListener("DOMContentLoaded", function () {
    map = L.map("mapid").setView([17.3993, 78.49059], 19);

    document.getElementById("inputfile").addEventListener("change", function (event) {

        var mystyle = {
            color: "black",
            weight: 1.2,
            fillOpacity: 0,
            fill : "false",
        }
        var file = event.target.files[0];

        if(!file)return;

        const reader = new FileReader;

        reader.onload = function(e){

            shp(e.target.result).then(function(geojson) {
                console.log("GeoJSON loaded:", geojson);
                
                const lyr = L.geoJSON(geojson,{ style: mystyle,

                    onEachFeature: function (feature, layer) {
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

                        //   layer.bindPopup(popupContent);

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

function showmap() {
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxNativeZoom: 19,
            maxZoom: 25 ,
            }
            ).addTo(map);
            }

function showImage() {
    L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            maxNativeZoom: 19,
            maxZoom: 22
            }
            ).addTo(map);
}

