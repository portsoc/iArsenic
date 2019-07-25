document.querySelector('#runGeoLocTests').addEventListener('click', runGeoLocTests);
document.querySelector('#runDistanceTests').addEventListener('click', runDistanceTests);

function runGeoLocTests() {
    function c(latitude, longitude) { return { coords: { latitude, longitude } } };

    function expectTrue(msg, value) {
        if (!value) {
            console.error(`fail: ${msg} not true`);
        } else {
            console.log(`pass: ${msg} is true`);
        }
    }

    function expectNull(msg, value) {
        if (value != null) {
            console.error(`fail: ${msg} expected null, got`, value);
        } else {
            console.log(`pass: ${msg} is null`);
        }
    }

    function expectNonNull(msg, value) {
        if (value == null) {
            console.error(`fail: ${msg} expected a value, got null`);
        } else {
            console.log(`pass: ${msg} is non-null`);
        }
    }

    // horiz/vert line behaviour should be consistent
    expectTrue('line between 5 and 6', testHLineConsistency(2, 4, 2));
    expectTrue('line between 1 and 3', testVLineConsistency(1, 0, 2));
    expectTrue('line between 4 and 5', testVLineConsistency(2, 0, 2));
    expectTrue('line between 6 and 7', testVLineConsistency(4, 0, 2));

    // line going from inside to outside
    expectTrue('line from inside to outside', !testHLineConsistency(2.5, 4.5, 1.1));

    expectNull('outside', findRegion(0, 0));
    expectNull('left of corner 2', findRegion(-.0001, 1));
    expectNull('up of corner 2', findRegion(0, 1.0001));
    expectNull('outside of line between 1 and 2', findRegion(.49, .5));
    expectNull('between shapes', findRegion(1.5, 1));

    expectNonNull('off corner 2, inside', findRegion(0.0001, 1));
    expectNonNull('inside of line between 1 and 2', findRegion(.51, .5));
}

// gives a value between a and b, if i=0 then it's a, if i=1 then it's b
function between(a, b, i) {
    return a + (b - a) * i;
}

function testHLineConsistency(lon1, lon2, lat) {
    const N = 100;
    const expectedResult = findRegion(between(lon1, lon2, 1 / N), lat);
    for (let i = 2; i < N; i += 1) {
        if (expectedResult !== findRegion(between(lon1, lon2, i / N), lat))
            return false;
    }
    return true;
}

function testVLineConsistency(lon, lat1, lat2) {
    const N = 100;
    const expectedResult = findRegion(lon, between(lat1, lat2, 1 / N));
    for (let i = 2; i < N; i += 1) {
        if (expectedResult !== findRegion(lon, between(lat1, lat2, i / N)))
            return false;
    }
    return true;
}

function runDistanceTests() {
    /* 
        geoDistance
        geoCentroid
        MAX_DISTANCE = 100km
    */
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