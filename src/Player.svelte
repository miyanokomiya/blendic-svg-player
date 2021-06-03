<script lang="ts">
  import type { AnimationLoop } from './animationLoop'
  import { Player } from './index'
  import { onDestroy, onMount } from 'svelte'

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
  export let width: number | string = 0
  export let height: number | string = 0

  // let animationLoop: AnimationLoop | undefined
  // let currentFrame = 0
  // let reversed = false
  // let oneshot = false
  // let currentActionName = ''
  // let actionsByName: { [name: string]: Action } = {}

  let target: HTMLElement
  let player: Player

  onMount(async () => {
    player?.dispose()
    player = new Player(target, {
      bakedData: bakedData as any,
      width,
      height,
    })
  })

  onDestroy(() => {
    player?.dispose()
  })
</script>

<main>
  <p>{width}</p>
  <p>{bakedData}</p>
  <div bind:this={target} />
  <div id="tmp" />
</main>
