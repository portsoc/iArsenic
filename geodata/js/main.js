/* global d3, topojson */

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
  // showPollutionData();
});

function displayError(e) {
  console.warn(`Error: [${e.code}] ${e.message}`);
}

function getUserCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(focusOnRegion, displayError, posOptions);
  }
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

  let foundDivision = '';

  const foundRegion = findRegion(userPos.coords.longitude, userPos.coords.latitude);
  if (foundRegion) foundDivision = foundRegion.properties.div;

  if (foundDivision) {
    console.log(`Your co-ordinates were found in ${foundDivision}.`);
  } else {
    console.warn('Sorry, we could not determine your location.');
  }
}

function findRegion(lon, lat) {
  for (const region of topo.features) {
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

/* function showPollutionData() {
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
} */

async function main() {
  const testDir = 'maps/test/';

  // const divMapUrl = mapsDir + 'div/div-c005-s010-vw-pr.json';
  // const disMapUrl = mapsDir + 'dis/dis-c005-s010-vw-pr.json';
  // const upaMapUrl = mapsDir + 'upa/upa-c005-s010-vw-pr.json';
  // const uniMapUrl = mapsDir + 'uni/uni-c005-s010-vw-pr.json';
  // const simpleTestUrl = testDir + 'simple-test.json';
  const distanceTestUrl = testDir + 'distance-test.json';

  await loadMapData(distanceTestUrl);
}

main();
