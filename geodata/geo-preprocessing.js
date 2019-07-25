const d3 = require('d3');
const topojson = require('topojson');
const map = require('./maps/test/distance-test.json');
const topo = topojson.feature(map, map['objects']['map']);

function runDistanceTests() {
    console.log(`The topo's centroid is ${d3.geoCentroid(topo)}`);

    const middleShape = topo.features[1];
    const middleCentroid = d3.geoCentroid(middleShape);

    const closestShape = {
        distance: null
    }

    for (const feature of topo.features) {
        let shapeId = feature.properties.id;
        let shapeCentroid = d3.geoCentroid(feature);

        let currentDistance = d3.geoDistance(middleCentroid, shapeCentroid);

        console.log(`Shape #${shapeId}'s centroid is ${shapeCentroid}`);
        console.log(`Distance between Middle and Shape ${shapeId} is ${currentDistance}`);

        if (closestShape.distance == null || currentDistance < closestShape.distance && currentDistance !== 0) {
            closestShape.id = shapeId;
            closestShape.distance = currentDistance;
        }
    }

    console.log(`Shape ${closestShape.id} is the closest`);
}

runDistanceTests();