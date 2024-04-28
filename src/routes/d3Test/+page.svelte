<script>
  import * as d3 from 'd3';

  const width = 1200;
  const height = 1000;

  let europeData;
  let locations;
  let svg;

  // Load GeoJSON data asynchronously
  async function loadData() {
    europeData = await d3.json('europe_copy.geojson');
    renderMap();
    locations = await d3.csv('locations.csv');
  }

  function renderMap() {
    svg = d3.select('svg')
                 .attr('width', width)
                 .attr('height', height);

    const projection = d3.geoMercator()
                        .fitSize([width, height], europeData);

    const path = d3.geoPath().projection(projection);

    svg.selectAll('path')
       .data(europeData.features)
       .enter()
       .append('path')
       .attr('d', path)
       .attr('fill', 'white')
       .attr('stroke', 'black')
       .on('click', function(event, d) {
          d3.select(this).attr('fill', 'lightgrey')});
  }
  loadData();
</script>

<style>
  svg {
    width: 100%;
    height: auto;
    background-color: lightblue;
    margin-top: 50px;
    margin-left:20px;
  }
</style>

<svg></svg>
