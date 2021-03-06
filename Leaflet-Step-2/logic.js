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
      color = "green";
    }
    else if (feature.properties.mag <2) {
      color = "yellow";
    }
    else if (feature.properties.mag <3) {
      color = "orange";
    }
    else if (feature.properties.mag <4) {
      color = "purple";
    }
    else if (feature.properties.mag <5) {
      color = "red";
    }
    else if (feature.properties.mag >=5) {
      color = "black";
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
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY  
  });
  var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY  
  });
  var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY  
  });

  var baseMaps = {
    "Satellite": satelliteMap,
    "Grayscale": grayscaleMap,
    "Outdoors": outdoorsMap
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

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}