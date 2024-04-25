<script>

    let widthSVG = 1000
    let heightSVG = 600
    let neuronsPerLayer = [5,15,1]

    const heightLayer  = (numberNeurons) => {return numberNeurons * 50 - 10}

    let radiusCircle = 20
    let startHeightHidden = []
    for (let i = 0; i < neuronsPerLayer.length; i++){
      startHeightHidden.push(heightSVG/2 - heightLayer(neuronsPerLayer[i])/2)
    }

</script>
  
  <style>
    svg {
      background-color: #f0f0f0;
    }
    line {
      stroke: black;
      stroke-width: 2;
      opacity: 0.6;
    }
  </style>

  <svg width = {widthSVG} height = {heightSVG}>
  {#each neuronsPerLayer as numNeurons, i}
    <g transform="translate(100, 0)">
      {#each {length:numNeurons} as _, j}
      {#each {length:neuronsPerLayer[i-1]} as _, k}
          <line x1={i*200} y1={startHeightHidden[i] + j*50} x2={(i-1)*200} y2={startHeightHidden[i-1] + k*50} stroke="black" stroke-width="2" />
        {/each}
        <circle cx={i*200} cy={startHeightHidden[i] + j*50} r={radiusCircle} fill="white" stroke="black" stroke-width="2" />
      {/each}
    </g>
  {/each}
  </svg>