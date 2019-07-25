const d3 = require('d3');
const topojson = require('topojson');
const map = require('./maps/dist/div/div-c005-s010-vw-pr.json');
const topo = topojson.feature(map, map['objects']['map']);

function runDistanceTests() {
    const prop = 'div';
    const closestRegion = {};

    console.log(`The topo centroid is ${d3.geoCentroid(topo)}`);

    for (const selectedRegion of topo.features) {
        closestRegion.distance = null;

        let selectedRegionName = selectedRegion.properties[prop];
        let selectedRegionCentroid = d3.geoCentroid(selectedRegion);

        for (const feature of topo.features) {
            let region = feature.properties[prop];

            if (region !== selectedRegionName) {
                let regionCentroid = d3.geoCentroid(feature);

                let currentDistance = d3.geoDistance(selectedRegionCentroid, regionCentroid);

                if (closestRegion.distance == null || currentDistance < closestRegion.distance) {
                    closestRegion[prop] = region;
                    closestRegion.distance = currentDistance;
                }
            }
        }
        console.log(`\nThe closest region to ${selectedRegionName} is ${closestRegion[prop]}`);
    }
}

runDistanceTests();