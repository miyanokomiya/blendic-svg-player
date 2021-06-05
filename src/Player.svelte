<script lang="ts">
  import type { AnimationLoop } from './animationLoop'

  interface ElementNode {
    id: string
    tag: string
    attributes: { [name: string]: string }
    children: (ElementNode | string)[]
  }

  interface Action {
    name: string
    attributesMapPerFrame: {
      [elementId: string]: { [name: string]: string }
    }[]
  }

  interface BakedData {
    version: string
    appVersion: string
    actions: Action[]
    svgTree: ElementNode
  }

  export let bakedData: BakedData
  export let width: number | string = '200px'
  export let height: number | string = '200px'
  export let currentActionName = ''

  let animationLoop: AnimationLoop | undefined
  let currentFrame = 0
  let reversed = false
  let oneshot = false

  $: actionsByName =
    bakedData?.actions.reduce<{
      [name: string]: Action
    }>((p, action) => {
      p[action.name] = action
      return p
    }, {}) ?? {}

  $: {
    if (!bakedData) break $
    if (bakedData.actions.length === 0) {
      console.error('Error: Not found actions.')
      break $
    }

    currentActionName = bakedData.actions[0].name
  }

  $: currentAction = actionsByName[currentActionName]

  $: svgTree = bakedData.svgTree
</script>

{#if bakedData}
  <div>
    <p>{width} {height}</p>
    <p>{bakedData}</p>
    <p>{currentActionName}</p>
    <p>{svgTree.tag}</p>
    <!-- <svelte:component tag={svgTree.tag} {...svgTree.attributes} /> -->
  </div>
{/if}
