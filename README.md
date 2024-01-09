# leaflet-challenge
Module 15 Challenge (D3.js / Leaflet.js) - Wassim Deen

<p align="center">
<img src="./Images/LeafletMap_Demo.gif" width="100%">
</p>


# My GitHub Page
View the Deployed Leaflet Map Here: https://wdeen.github.io/leaflet-challenge/Leaflet-Part-2/

# Scenario Description
The United States Geological Survey, or USGS for short, is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment, and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

The USGS is interested in building a new set of tools that will allow them to visualise their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. In this challenge, I have been tasked with developing a way to visualise USGS data that will allow them to better educate the public and other government organisations (and aiming to secure more funding) on issues facing our planet.

# Summary of Challenge
- Create the Earthquake Visualisation (`\leaflet-challenge\Leaflet-Part-1`)
    - The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Choose a dataset to visualise. 
        - Earthquake Dataset: `http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php`
    - Using D3 & Leaflet, import and visualise the data by:
        - Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
        - The data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by colour. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in colour.
        - Include popups that provide additional information about the earthquake when its associated marker is clicked.
        - Create a legend that will provide context for the map data.

- Part 2: Gather and Plot More Data  (`\leaflet-challenge\Leaflet-Part-2`)
    - Plot a second dataset on the map to illustrate the relationship between tectonic plates and seismic activity. This dataset needs to be pulled and visualised alongside the original data.
        - Dataset on Tectonic Plates: `https://github.com/fraxen/tectonicplates`
    - Plot the tectonic plates dataset on the map in addition to the earthquakes.
    - Add other base maps to choose from.
    - Put each dataset into separate overlays that can be turned on and off independently.
    - Add layer controls to the map.

# Notes
1. D3.js and Leaflet.js libraries referenced via CDN within the HTML webpage
2. Earthquake Dataset (Last 7 Days) - `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`
3. Tectonic Plates Dataset - `https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json`

# Final Repository Structure
```
├── README.md
├── Images
├── Leaflet-Part-1
└── Leaflet-Part-2
    ├── index.html
    └── static
        ├── css
            └── style.css
        ├── js
            └── logic.js

```
