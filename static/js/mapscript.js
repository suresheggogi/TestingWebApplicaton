document.addEventListener("DOMContentLoaded", function () {
    var map = L.map("mapid").setView([17.3993, 78.49059], 15);

    //  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19
    // }).addTo(map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 30,
        // attribution: 'Tiles © Esri'
    }).addTo(map);


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
``
        reader.onload = function(e){

            shp(e.target.result).then(function(geojson) {
                
                const lyr = L.geoJSON(geojson,{ style: mystyle,

                    onEachFeature: function (feature, layer) {
                        openbtn()


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

                        //  layer.bindPopup(popupContent);

                        layer.on("click", function () {
                            openbtn();
                            document.getElementById("attr-table1").innerHTML = popupContent;
                        });
                    }
                  
               });
                lyr.addTo(map);
                map.fitBounds(lyr.getBounds());
            });
            

        };
        reader.readAsArrayBuffer(file);


    });

});
function openbtn(){
   const sidestyle = document.getElementById("sildebar1");
    sidestyle.style.display = "block";
}
// function closebtn(){
    
//     document.getElementById("sildebar1").style.width = "0";
    
// }
