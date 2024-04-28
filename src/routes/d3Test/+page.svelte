<script>
  import * as d3 from 'd3';

  const width = 1200;
  const height = 1000;

  let europeData;
  let locations;  
  let points = [];
  let projection;
  let datapoints = [
    {latitude: 51.2211097,longitude: 4.3997081},
  ]

 

  // Load GeoJSON data asynchronously
  async function loadData() {
    europeData = await d3.json('europe_copy.geojson');
    renderMap();
    locations = await d3.csv('locations.csv');
    renderData();
  }

  function renderMap() {
    const svg = d3.select('svg')
                 .attr('width', width)
                 .attr('height', height);

    projection = d3.geoMercator()
                        .fitSize([width, height], europeData);

    const path = d3.geoPath().projection(projection);

    svg.selectAll('path')
       .data(europeData.features)
       .enter()
       .append('path')
       .attr('d', path)
       .attr('fill', 'white')
       .attr('stroke', 'black')
       .attr('stroke-width', 0.5)
       .on('click', function(event, d) {
          d3.select(this).classed('selected', !d3.select(this).classed('selected'));})
  }

  function renderData(){
    points = locations.map(p => projection([p.longitude, p.latitude]));
  }

  loadData();

</script>

<style>
  svg {
    align-content: center;
    width: 100%;
    height: auto;
    background-color: lightblue;
    padding: 20px;
    /* border: 2px solid black; */
  }
  :global(svg path:hover) {
    fill: lightgrey;
  }
  :global(.selected) {
    fill: lightgrey;
  }
  :global(body) {
    background: lightblue;
  }

  circle{
    fill: black;
  }
  circle:hover{
    fill: red;
    r: 20;
  }
  line {
    stroke: black;
    stroke-width: 1;
    opacity: 0.1;
  }
  line:hover {
    stroke: red;
    stroke-width: 2;
    opacity: 1;
  }
</style>



<svg>
  {#each points as dp}
    <circle cx={dp[0]}
    cy={dp[1]} r = 3.5 />
    {#each points as dp2}
    {#if dp[0] != dp2[0] && dp[1] != dp2[1] }
      <line x1='{dp[0]}' y1='{dp[1]}'
        x2='{dp2[0]}' y2='{dp2[1]}' >
      </line>
    {/if}
    {/each}
  {/each}
</svg>
