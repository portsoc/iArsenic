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
        .attr('data-div', (d) => d.properties.div)
        .attr('data-dis', (d) => d.properties.dis);
}

async function loadMapData(mapUrl) {
    const map = await d3.json(mapUrl);

    const topo = topojson.feature(map, map['objects']['map']);

    const proj = d3.geoMercator()
        .translate([w / 2, h / 2]);
    const path = d3.geoPath()
        .projection(proj);

    centerMap(proj, topo);

    drawMapFeatures(path, topo);
}

function main() {
    const mapsDir = 'maps/dist/';

    const divMapUrl = mapsDir + 'div/div_c005_s010--vw--pr.json';
    const disMapUrl = mapsDir + 'dis/dis_c005_s010--vw--pr.json';
    const upaMapUrl = mapsDir + 'upa/upa_c005_s010--vw--pr.json';
    const uniMapUrl = mapsDir + 'uni/uni_c005_s010--vw--pr.json';

    loadMapData(divMapUrl);
}

main();