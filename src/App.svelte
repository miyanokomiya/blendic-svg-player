<script lang="ts">
  import Player from './Player.svelte'
  import bakedData from '../demo/action.json'
</script>

<main>
  <h1>Blendic SVG Player</h1>
  <div id="player-wrapper">
    <Player width="100%" height="100%" {bakedData} />
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  #player-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: solid 1px #000;
  }
</style>
