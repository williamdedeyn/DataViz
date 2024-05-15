<script>
  import * as d3 from 'd3';
  import './styles.css';
  import { tooltip } from './functions.js';
  // import { clickHandler } from './functions.js';

  let europeData;
  let locations;
  let inventoryData;  
  let plant_points = [];
  let shelf_inverntory_points = [];
  let transit_inverntory_points = [];
  let projection;
  let max_shelf;
  let max_transit;
  let y_scale_shelf = [];
  let y_scale_transit = [];
  let selected;
  let selectedData;
  let selectedPlantCountry;
  const xTicks = ['2021-12-31','2022-01-31', '2022-02-28', '2022-03-31', '2022-04-30', '2022-05-31', 
  '2022-06-30', '2022-07-31', '2022-08-31', '2022-09-30', '2022-10-31', '2022-11-30', '2022-12-31', '2023-01-31', 
  '2023-02-28', '2023-03-31', '2023-04-30', '2023-05-31', '2023-06-30', '2023-07-31', '2023-08-31', '2023-09-30',
  '2023-10-31', '2023-11-30', '2023-12-31', '2024-01-31', '2024-02-29', '2024-03-31', '2024-04-30', '2024-05-31',
  '2024-06-30', '2024-07-31', '2024-08-31', '2024-09-30', '2024-10-31', '2024-11-30', '2024-12-31'];
	const padding = { top: 20, right: 10, bottom: 10, left: 40 };
  $: barChartWidth = 600;
  $: console.log(barChartWidth)
	$: height = 200;

  // Load GeoJSON data asynchronously
  async function loadData() {
    europeData = await d3.json('europe_copy.geojson');
    renderMap();
    locations = await d3.csv('locations.csv');
    console.log(locations)
    renderData();
    inventoryData = await d3.csv('plant_inventory.csv');
    console.log(inventoryData)
  }

  function renderMap() {
    let main_svg = document.getElementById('main_svg');
    let width = main_svg.clientWidth-20;
    let height = main_svg.clientHeight;

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
        svg.selectAll('path').attr('fill', 'white');
        if(!selected) {
          d3.select(this).attr('fill', 'lightgrey');
          selected = this;
          selectedData = d;
          document.getElementById("country_name").innerHTML = selectedData.properties.NAME;
        } else{
        if (selected !== this) {
          d3.select(this).attr('fill', 'lightgrey');
          selected = this;
          selectedData = d;
          document.getElementById("country_name").innerHTML =  selectedData.properties.NAME;
        } else {
          selected = null;
          selectedData = null;
          document.getElementById("country_name").innerHTML = '';
        }
      }
        d3.select('#plot_svg_shelf').selectAll('*').attr('visibility', 'hidden');
        d3.select('#plot_svg_transit').selectAll('*').attr('visibility', 'hidden');
        });  
      }

  function renderData(){
    plant_points = locations.filter(p => p.type != "Vendor").map(p => [p.key, p.type].concat(projection([p.longitude, p.latitude])));
    // console.log(plant_points)
  }

  function clickHandler(inventoryData, plantKey) {
    console.log('Clicked on plant', plantKey);
    selectedPlantCountry = locations.filter(p => parseInt(p.key) == plantKey)[0].country;
    document.getElementById("country_name").innerHTML = 'Country: ' + selectedPlantCountry + ' ' + 'Plant Key: ' + plantKey;
  

    shelf_inverntory_points = inventoryData.filter(p => parseInt(p.PlantKey) == plantKey).map(p => 
        [p.SnapshotDate,p.OnShelfInventoryQuantity]);
    transit_inverntory_points = inventoryData.filter(p => parseInt(p.PlantKey) == plantKey).map(p => 
        [p.SnapshotDate,p.InTransitQuantity]);
    max_shelf = Math.max.apply(null, shelf_inverntory_points.map(p => p[1]));
    max_transit = Math.max.apply(null, transit_inverntory_points.map(p => p[1]));
    y_scale_shelf = d3.ticks(0, max_shelf, 8);
    y_scale_transit = d3.ticks(0, max_transit, 8);
    d3.select('#plot_svg_shelf').selectAll('*').attr('visibility', 'visible');
    d3.select('#plot_svg_transit').selectAll('*').attr('visibility', 'visible');
    // console.log(y_scale_shelf)

    // console.log(max_shelf, max_transit)

}
  loadData()

  $: xScale = d3.scaleLinear()
		.domain([0, xTicks.length])
		.range([padding.left, barChartWidth - padding.right]);

  $: yScale_shelf = d3.scaleLinear()
		.domain([0, max_shelf])
		.range([height-padding.bottom , padding.top]);

	$: yScale_transit = d3.scaleLinear()
		.domain([0, max_transit])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = barChartWidth - (padding.left + padding.right);
	$: barWidth = innerWidth / xTicks.length;

  function formatMobile(tick) {
		return "'" + tick.toString().slice(-2);
	}

</script>

<svg id = 'main_svg'>
  {#each plant_points as dp}
    <circle cx={dp[2]}
    cy={dp[3]} r = 3.5 on:click={clickHandler(inventoryData, dp[0])}/>
  {/each}
</svg>

<div class= "info" bind:offsetWidth={barChartWidth}>
    <h2 class = "h2" id = 'country_name'>
    </h2>
    <div class = 'shelf-container'>
    <h3 class = "h3">On-Shelf Inventory Quantity</h3>
    <svg id = 'plot_svg_shelf'>
      <g class="axis y-axis">
        {#each y_scale_shelf as tick}
          <g class="tick tick-{tick}" transform="translate(0, {yScale_shelf(tick)})">
            <line x2="100%" />
            <text y="-4">{tick}</text>
          </g>
        {/each}
      </g>

		<g class="bars">
			{#each shelf_inverntory_points as shelf_row, i}
				<rect
        title='Quantity: {shelf_row[1]} 
        Date: {shelf_row[0]}' use:tooltip
					x={xScale(i) + 2}
					y={yScale_shelf(shelf_row[1])}
					width={barWidth - 4}
					height={yScale_shelf(0) - yScale_shelf(shelf_row[1])}
				/>
			{/each}
		</g>
    </svg>
    </div>
  
    <div class = 'transit-container'>
    <h3 class = "h3">In-Transit Quantity</h3>
    <svg id = 'plot_svg_transit'>
    <g class="axis y-axis">
        {#each y_scale_transit as tick}
          <g class="tick tick-{tick}" transform="translate(0, {yScale_transit(tick)})">
            <line x2="100%" />
            <text y="-4">{tick}</text>
          </g>
        {/each}
    </g>
    <g class="bars">
			{#each transit_inverntory_points as row, i}
				<rect title='Quantity: {Math.round(row[1])} 
        Date: {row[0]}' use:tooltip
					x={xScale(i) + 2}
					y={yScale_transit(row[1])}
					width={barWidth - 4}
					height={yScale_transit(0) - yScale_transit(row[1])}
				/>
			{/each}
		</g>
    </svg>
    </div>

</div>

<style>
  
:global(svg path:hover) {
  fill: lightgrey;
}


</style>