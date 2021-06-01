<svelte:options tag="blendic-svg-player" immutable={true} />

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

  export let name = 'a'

  export let bakedData: BakedData
  export let width: number | string = 0
  export let height: number | string = 0

  let animationLoop: AnimationLoop | undefined
  let currentFrame = 0
  let reversed = false
  let oneshot = false
  let currentActionName = ''
  let actionsByName: { [name: string]: Action } = {}
</script>

<main>
  <h1>Hello Typescript!</h1>
  <p>{name}</p>
</main>
