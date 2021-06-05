<script lang="ts">
  import Player from './Player.svelte'
  import bakedData from '../demo/action.json'

  let currentActionName = bakedData.actions[0]?.name ?? ''
</script>

<main>
  <h1>Blendic SVG Player</h1>
  <div class="controls">
    <select bind:value={currentActionName}>
      {#each bakedData.actions as action}
        <option value={action.name}>{action.name}</option>
      {/each}
    </select>
  </div>
  <div id="player-wrapper">
    <Player width="100%" height="100%" {bakedData} {currentActionName} />
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  .controls {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }
  #player-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: solid 1px #000;
  }
</style>
