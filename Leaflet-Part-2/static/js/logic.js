/*
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////// [Leaflet / D3 JavaScript] Leaflet Map Displaying Earthquake Data ///////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
*/
const dataURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

const boundaryURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Using D3, fetch the Earthquake (geoJSON) Dataset from the specified URL 
// Once successful, THEN pass through the loaded JSON dataset as an argument to the following callback function where...
d3.json(dataURL).then(quakeData => {
    d3.json(boundaryURL).then(tpData => {
    // Call the function to generate the Leaflet Map using the Earthquake & Boundary datasets
    init_quakeMap(quakeData.features, tpData);
    });
});

// Function expression to return a specific colour based on depth value (feature.geometry.coordinates[2])
// Called when:
    //  Applying colour to the marker points on the leaflet map;
    // Applying colour to the squares displayed in the legend 
const get_MarkerColour = (depth) => {
    return depth > 90 ? '#320064' :     // If depth value is greater than 90, return the 1st darkest colour (Hex)
           depth > 70 ? '#5B2F76' :     // Elseif depth value is greater than 70, return the 2nd darkest colour (Hex)
           depth > 50 ? '#845E88' :     // Elseif depth value is greater than 50, return the 3rd darkest colour (Hex)
           depth > 30 ? '#AD8D9B' :     // Elseif depth value is greater than 30, return the 4th darkest colour (Hex)
           depth > 10 ? '#D6BCAD' :     // Elseif depth value is greater than 10, return the 5th darkest colour (Hex)
                        '#FFEBBF';      // Otherwise, return the brightest colour (Hex)
};

// Function expression to return the value of the marker radius based on magnitude (feature.properties.mag)
// Called when applying the magnitude
const get_MarkerRadius = (magnitude) => {
    return isNaN(magnitude) ? 0 :       // If magnitude is null, return 0
                magnitude * 5;          // Otherwise, return the magnitude multiplied by 5
}


// Function expression to apply a Legend to the Leaflet Map displaying a gradient scale for 'Depth'
// Requires the Leaflet Map Object as an argument
const get_Legend = (quakeMap) => {
    // Setup the legend object and position it bottom-right of the Leaflet Map
    let legend = L.control({ position: "bottomright" });

    // Within the legend, apply a function where...
    legend.onAdd = function() {
        // A new div element is created (stores the legend contents)
        let div = L.DomUtil.create("div", "legend");

        // A new div element is created (stores the legend header)
        // This is done to specifically apply the 'legend-title' class to the element; for beautification purposes specific to the header only
        let legendTitle = L.DomUtil.create("div", "legend-title");

        // Create an object of objects where each nested object represents the threshold of each feature in the gradient scale
        let depthThresholds = [
            {min: -10, max: 10},        // -10 to 10
            {min: 10, max: 30},         // 10 to 30
            {min: 30, max: 50},         // 30 to 50
            {min: 50, max: 70},         // 50 to 70
            {min: 70, max: 90},         // 70 to 90
            {min: 90, max: Infinity}    // 90 to Infinity (used to emphasise anything beyond 90 lies in this threshold)
        ];

        // Define the header element in HTML format
        legendTitle.innerHTML = "<h3>Depth (km)</h3>";

        // Append the main legend object with the legend header
        div.appendChild(legendTitle);
     

        // For each threshold object in the larger object...
        depthThresholds.forEach(threshold => {
            // Create a variable containing the label for the current threshold
            const textThreshold = (threshold.min === 90) ? 'Over 90' : `${threshold.min} — ${threshold.max}`;
            
            // Establish the div element to display the coloured square and label for the current threshold
            div.innerHTML +=
                '<div class="legend-label">' +
                '<i style=\"background: ' + get_MarkerColour((threshold.min + threshold.max) / 2) + ';\">&nbsp;</i> ' + `${textThreshold}` + '<br>'
                + '</div>'
        });

        // Return the final legend div object at the end.
        return div;
    };
    
    // Finally, apply the final legend object to the Leaflet Map Object
    legend.addTo(quakeMap);
}


// Function expression to instantiate the Leaflet Map (requires JSON Dataset)
// Called only as the JSON data is fetched
const init_quakeMap = (quakeData, tpData) => {     
    // Create the base layer to the Leaflet Map Object
    // Uses the Street instance of the 'OpenStreetMap' database
    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    // Create the additional layer to the Leaflet Map Object
    // Uses the Topography instance of the 'OpenStreetMap' database
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Store the layers in a new object
    const baseMaps = {
        'Street View' : street,
        'Topography View': topo
    };

    let tpOverLay = L.geoJSON(tpData);

    // Using the geoJSON Dataset, apply a geoJSON layer to the Leaflet Map object where...
    let quakeMarkers = L.geoJSON(quakeData, {
        pointToLayer: function (feature, latlng) {                                  // A function is applied to the geoJSON layer where values from the feature & latlng keys are passed 
            return L.circleMarker(latlng, {                                         // For each set of latlng coordinates, apply a circular marker where...
                radius: get_MarkerRadius(feature.properties.mag),                   // radius of marker is the magnitude value from the feature but manipulated using the get_MarkerRadius() function
                fillColor: get_MarkerColour(feature.geometry.coordinates[2]),       // colour of marker is determined using the depth value from the feature through the get_MarkerColour() function
                color: "#000",                                                      // Border of marker is set to black
                weight: 1,                                                          // Thickness of marker border set to 1
                opacity: 0.5,                                                       // Opacity of marker border set to 0.5
                fillOpacity: 1                                                      // Opacity of the marker fill is set to 1
            });
        },
        onEachFeature: function (feature, layer) {                                                  // Another function is applied to each Feature in the geoJSON layer (feature and circle marker layer passed over)
            layer.bindPopup(`                                                                       
            <strong>Location: </strong> ${feature.properties.place}<br>
            <strong>Date: </strong> ${new Date(feature.properties.time).toLocaleString()}<br>
            <strong>Magnitude: </strong> ${feature.properties.mag}<br>
            <strong>Depth: </strong> ${feature.geometry.coordinates[2]}km<br>  
        `);                                                                                         // Bind a pop-up to each marker displaying its own location/date/magnitude/depth
        }
    });

    // Store the Marker & tectonic plate overlays in a new object
    let overlayMaps = {
        'Earthquakes': quakeMarkers,
        'Tectonic Plates': tpOverLay
    };

    // Create Leaflet Map where...
    let quakeMap = L.map("map", {                               // The Leaflet map is stored in the HTML element with id 'map'
        center: [-6.590945, 123.033573],                        // Display the map around South East Asia
        zoom: 4,                                                // Starting Zoom is 4
        minZoom: 1.5,                                           // Limit Minimum Zoom to 1.5; prevent the user from zooming out further
        maxBounds: L.latLngBounds([-120, -210], [120, 210]),    // Set maximum latitude/longitude bounds of the leaflet map to within the world map only
        layers: [street, quakeMarkers, tpOverLay]               // At startup, set to use the 'street view' layer as well as enable the markers and boundary overlays
    });

    // Call the function to instantiate and apply the legend
    get_Legend(quakeMap);

    // Instantiate layer control to the Leaflet Map Object 
    L.control.layers(baseMaps, overlayMaps).addTo(quakeMap);

};
  