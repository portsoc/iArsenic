const coordsBtn = d3.select('#coordsBtn');
coordsBtn.on('click', getUserCoordinates);

const posOptions = {
  maximumAge: 0,
  enableHighAccuracy: true,
};

const mapArea = d3.select('#map-area');

const w = mapArea.node().clientWidth;
const h = w / 2;

const mapSVG = mapArea
  .append('svg')
  .attr('width', w)
  .attr('height', h);

mapSVG.append('rect')
  .attr('width', '100%')
  .attr('height', '100%');

const featureGroup = mapSVG.append('g');

const mapZoom = d3.zoom().on('zoom', () => featureGroup.attr('transform', d3.event.transform));
mapSVG.call(mapZoom);

let topo;

const pollutionDataBtn = d3.select('#pollutionDataBtn');
pollutionDataBtn.on('click', () => {
  showPollutionData()
});

document.querySelector('#runGeoLocTests').addEventListener('click', runGeoLocTests);

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

function displayError(e) {
  console.warn(`Error: [${e.code}] ${e.message}`)
}

function getUserCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(focusOnRegion, displayError, posOptions);
  }
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

function focusOnRegion(userPos) {
  // Test with Rajshahi Co-ordinates
  // let userPos = {};
  // userPos.coords = {
  //     latitude: 24.035,
  //     longitude: 89.78,
  // }

  console.log(`Lat: ${userPos.coords.latitude}`);
  console.log(`Long: ${userPos.coords.longitude}`);
  console.log(`Accuracy: ${userPos.coords.accuracy} metres`);

  let foundDivision = "";

  const foundRegion = findRegion(userPos.coords.longitude, userPos.coords.latitude);
  if (foundRegion) foundDivision = foundRegion.properties.div;

  if (foundDivision) {
    console.log(`Your co-ordinates were found in ${foundDivision}.`);
  } else {
    console.warn('Sorry, we could not determine your location.');
  }
}

function findRegion(lon, lat) {
  for (region of topo.features) {
    if (d3.geoContains(region, [lon, lat])) {
      return region;
    }
  }
}

function centerMap(proj, topo) {
  const bounds = d3.geoBounds(topo);
  const centroid = d3.geoCentroid(topo);

  const distance = d3.geoDistance(bounds[0], bounds[1]);
  const scale = h / distance;

  proj.scale(scale).center(centroid);
}

function drawMapFeatures(path, topo) {
  featureGroup.selectAll('path')
    .data(topo.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', 'lightgreen')
    .attr('data-area', (d) => d.properties.area)
    .attr('data-div', (d) => d.properties.div)
    .attr('data-dis', (d) => d.properties.dis);
}

async function loadMapData(mapUrl) {
  const map = await d3.json(mapUrl);

  topo = topojson.feature(map, map['objects']['map']);

  const proj = d3.geoMercator()
    .translate([w / 2, h / 2]);
  const path = d3.geoPath()
    .projection(proj);

  centerMap(proj, topo);
  drawMapFeatures(path, topo);
}

function showPollutionData() {
  const colourScale = d3.scaleLinear()
    .domain([0.5, 150])
    .range(['white', 'darkred']);

  featureGroup.selectAll('path')
    .attr('data-s-md', (d, i, nodes) => aggregateData[nodes[i].dataset.div].s.md)
    .attr('fill', (d, i, nodes) => {
      let div = nodes[i].dataset.div;
      let divSMDValue = aggregateData[div].s.md;

      return colourScale(divSMDValue);
    });
}

async function main() {
  const mapsDir = 'maps/dist/';

  const divMapUrl = mapsDir + 'div/div_c005_s010--vw--pr.json';
  const disMapUrl = mapsDir + 'dis/dis_c005_s010--vw--pr.json';
  const upaMapUrl = mapsDir + 'upa/upa_c005_s010--vw--pr.json';
  const uniMapUrl = mapsDir + 'uni/uni_c005_s010--vw--pr.json';
  const testUrl = 'maps/simple-test.json';

  await loadMapData(divMapUrl);
}

main();
