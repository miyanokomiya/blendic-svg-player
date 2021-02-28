import { useAnimationLoop } from './animationLoop'

type AffineMatrix = [number, number, number, number, number, number]

export interface ElementNode {
  id: string
  tag: string
  attributs: { [name: string]: string }
  children: (ElementNode | string)[]
}

interface BakedData {
  matrixMapPerFrame: { [id: string]: AffineMatrix }[]
  svgTree: ElementNode
}

type Attributes = { [key: string]: string | number } | null

interface Props {
  bakedData: BakedData
  width?: number | string
  height?: number | string
}

const SVG_URL = 'http://www.w3.org/2000/svg'

export class Player {
  private $el: Element | undefined
  private bakedData: BakedData
  private width: number | string
  private height: number | string

  private $svg: SVGElement | undefined
  private animationLoop: ReturnType<typeof useAnimationLoop> | undefined
  private currentFrame: number
  private reversed: boolean

  constructor(el: string | Element, props: Props) {
    if (typeof el === 'string') {
      const $el = document.getElementById(el)
      if (!$el) throw new Error('Not found element: ' + el)
      this.$el = $el
    } else {
      this.$el = el
    }
    this.bakedData = props.bakedData

    this.width = props.width ?? 0
    this.height = props.height ?? 0

    this.currentFrame = 0
    this.reversed = false
  }

  get endFrame(): number {
    return this.bakedData.matrixMapPerFrame.length
  }

  mount() {
    if (!this.$el) return

    const $svg = renderNode({
      ...this.bakedData.svgTree,
      attributs: {
        ...this.bakedData.svgTree.attributs,
        width: this.width
          ? this.width.toString()
          : this.bakedData.svgTree.attributs.width,
        height: this.height
          ? this.height.toString()
          : this.bakedData.svgTree.attributs.height,
      },
    })
    this.$el.append($svg)
    this.$svg = $svg
  }

  render() {
    if (!this.$el || !this.$svg) return

    this.$svg.innerHTML = ''

    const posedSvgNode = applyMatrix(
      this.bakedData.matrixMapPerFrame[this.currentFrame],
      this.bakedData.svgTree
    )

    const $svg = renderNode(posedSvgNode)
    appendChildren(this.$svg, Array.from($svg.children))
  }

  tick(tickFrame: number) {
    if (this.reversed) {
      const val = this.currentFrame - tickFrame
      this.currentFrame = 0 < val ? val : this.endFrame - 1
    } else {
      const val = this.currentFrame + tickFrame
      this.currentFrame = val < this.endFrame ? val : 0
    }
    this.render()
  }

  reverse() {
    if (this.animationLoop) {
      this.pause()
    }
    this.reversed = true
    this.animationLoop = useAnimationLoop((tickFrame) => this.tick(tickFrame))
    this.animationLoop.begin()
  }

  play() {
    if (this.animationLoop) return
    this.reversed = false
    this.animationLoop = useAnimationLoop((tickFrame) => this.tick(tickFrame))
    this.animationLoop.begin()
  }

  pause() {
    if (this.animationLoop) {
      this.animationLoop.stop()
      this.animationLoop = undefined
    }
  }

  stop() {
    if (this.animationLoop) {
      this.animationLoop.stop()
      this.animationLoop = undefined
    }
    this.currentFrame = 0
    this.render()
  }

  dispose() {
    if (this.$el && this.$svg) {
      this.$el.removeChild(this.$svg)
    }

    this.$el = undefined
    this.$svg = undefined
  }
}

function renderNode(node: ElementNode): SVGElement {
  return createSVGElement(
    node.tag,
    node.attributs,
    node.children.map((n) => {
      if (typeof n === 'string') return n
      return renderNode(n)
    })
  )
}

export function createSVGElement(
  tag: string,
  attributes: Attributes = null,
  children: (Element | string)[] = []
): SVGElement {
  const $el = document.createElementNS(SVG_URL, tag)
  return createElement($el, attributes, children)
}

function setAttribute($el: Element, name: string, value: string) {
  return $el.setAttribute(name, value)
}

function createElement<T extends Element>(
  $el: T,
  attributes: Attributes = null,
  children: (Element | string)[] = []
): T {
  for (const key in attributes) {
    setAttribute($el, key, attributes[key].toString())
  }
  if (Array.isArray(children)) {
    appendChildren($el, children)
  } else {
    $el.textContent = children
  }
  return $el
}

function appendChildren($el: Element, children: (Element | string)[]) {
  const $fragment = document.createDocumentFragment()
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    if (typeof item === 'string') {
      $fragment.appendChild(new Text(item))
    } else {
      $fragment.appendChild(item)
    }
  }
  $el.appendChild($fragment)
}

function applyMatrix(
  matrixMap: { [id: string]: AffineMatrix },
  node: ElementNode
): ElementNode {
  return {
    ...node,
    attributs: {
      ...node.attributs,
      transform: matrixToString(matrixMap[node.id]),
    },
    children: node.children.map((c) => {
      if (typeof c === 'string') return c
      return applyMatrix(matrixMap, c)
    }),
  }
}

function matrixToString(matrix?: AffineMatrix): string {
  if (!matrix) return ''
  return `matrix(${matrix.join(',')})`
}
