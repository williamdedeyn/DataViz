<script>
  import * as d3 from 'd3';

  const width = 1200;
  const height = 1000;

  let europeData;
  let locations;

  // Load GeoJSON data asynchronously
  async function loadData() {
    europeData = await d3.json('europe.geojson');
    renderMap();
    locations = await d3.csv('locations.csv');
  }

  function renderMap() {
    const svg = d3.select('svg')
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
       .attr('fill', 'lightblue')
       .attr('stroke', 'black');
  }

  loadData();
</script>

<style>
  svg {
    width: 100%;
    height: auto;
  }
</style>

<svg></svg>
