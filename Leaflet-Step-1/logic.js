// store API inside queryURL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// perform a get request to the query url
d3.json(queryUrl, function(data) {
 console.log(data); 
 createFeatures(data.features);
});

var earthquakeMarkers = [];
// function createFeatures to extract data
function createFeatures(earthquakeData) {
  // define a function to run for each feature



  function onEachFeature(feature) {
    //layer.bindPopup("<h3>" + feature.properties.place + 
    //  "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");
    var color = "";
    if (feature.properties.mag <1) {
      color = "#FED976";
    }
    else if (feature.properties.mag <2) {
      color = "#FEB24C";
    }
    else if (feature.properties.mag <3) {
      color = "#FD8D3C";
    }
    else if (feature.properties.mag <4) {
      color = "#FC4E2A";
    }
    else if (feature.properties.mag <5) {
      color = "#E31A1C";
    }
    else if (feature.properties.mag >=5) {
      color = "#BD0026";
    }
    // console.log(feature.geometry.coordinates)
    earthquakeMarkers.push(
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      stroke: false,
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      radius: (feature.properties.mag)*8000
    }).bindPopup("<h3>" + feature.properties.place + 
    "</h3><hr><p>" + new Date(feature.properties.time) + "<p>"));
  }

  // create a json layer contain the features array on the earthquakeData
  // run the onEachFeature function once for each piece of data
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  // send earthquake layer to the createMap function 
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // define map layers
  var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY  
  });

  var baseMaps = {
    "Grayscale": grayscaleMap,
  }
  // create markers
  var earthquakes = L.layerGroup(earthquakeMarkers);
  var overlayMaps = {
    "Earthquakes": earthquakes
  };


  var myMap = L.map("map", {
    center: [
      39.8283, -98.5795
    ],
    zoom: 5,
    layers: [grayscaleMap, earthquakes]
  });


  var legend = L.control({position: 'bottomright'});
  // add a legend
    legend.onAdd = function() {
      var magnitudes = [0, 1, 2, 3, 4, 5];
      var labels = [];
      var div = L.DomUtil.create('div', 'info legend');
      //
      for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML += 
          '<i style="background:' + getColor(magnitudes[i]) +'"></i>' +
          magnitudes[i] + (magnitudes[i+1] ? '&ndash;' + magnitudes[i+1] + '<br>': '+');
      }
      return div;
    
    };
    
    var d = ["#FED976","#FEB24C" ,"#FD8D3C", "#FC4E2A", "#E31A1C","#BD0026"];

    function getColor(d) {
      return d < 1 ? "#FED976" :
             d < 2  ? "#FEB24C" :
             d < 3  ? "#FD8D3C":
             d < 4  ? "#FC4E2A" :
             d < 5   ? "#E31A1C":
                      "#BD0026"  ;
    }
  
    legend.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}