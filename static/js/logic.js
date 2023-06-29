//Early attempt
// // Creating the map object
// // Load the GeoJSON data.
// const DATAURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// // Change initial coordinfates
// let myMap = L.map("map", {
//     zoom: 4
//   });
  
// // Adding the tile layer
// var geolayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);
  
// var satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.satellite",
//     accessToken: API_KEY
//   });

  
// /////////////////////////////////////////////

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

const colors = [
  "#0000FF", // Blue
  "#FF0000", // Red
  "#FFFF00", // Yellow
  "#008000", // Green
  "#800080", // Purple
  "#A52A2A", // Brown
];

// Function to determine the color based on depth
function getColor(depth) {
  if (depth > 90) {
    return colors[5]; // Brown
  } else if (depth > 70) {
    return colors[4]; // Purple
  } else if (depth > 50) {
    return colors[3]; // Green
  } else if (depth > 30) {
    return colors[2]; // Yellow
  } else if (depth > 10) {
    return colors[1]; // Red
  } else {
    return colors[0]; // Blue
  }
}

// Reset the map container if it exists
var container = L.DomUtil.get("map");
if (container !== null) {
  container._leaflet_id = null;
}

// Perform a GET request to retrieve the earthquake data
d3.json(url).then(function (data) {
  const features = data.features;

  // Create the map object
  let myMap = L.map("map").setView([15.6993, 42.1244], 3);

  // Add a tile layer (background map image) to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(myMap);

  // Loop through each earthquake feature and create a marker for each one
  features.forEach((feature) => {
    const coordinates = feature.geometry.coordinates;
    const depth = coordinates[2];
    const mag = feature.properties.mag;
    const title = feature.properties.title;

    // Create a circle marker for the earthquake
    let marker = L.circle(coordinates, {
      color: "black",
      weight: 0.4,
      fillColor: getColor(depth),
      fillOpacity: 1,
      radius: mag * 50000,
    }).addTo(myMap);

    // Biinding the Pop up to the Marker
    marker.bindPopup(
      `<h3>${title}</h3> 
      <hr> 
      <div>Coordinates: ${coordinates}</div>
      <div>Magnitude: ${mag}</div>
      <div>Depth: ${depth}</div>
      `
    );
  });

  // Create a legend for the depth colors
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      grades = [-10, 10, 30, 50, 70, 90],
      labels = [];

    // Loop through the depth intervals and generate a label 
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        colors[i] +
        '"></i> ' +
        grades[i] +
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }

    return div;
  };

  // Add the legend to the map
  legend.addTo(myMap);
});

// /////////////////////////////////////////////

