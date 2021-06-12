import { useAnimationLoop } from './animationLoop'
import {
  createHTMLElement,
  createSVGElement,
  setAttribute,
  appendChildren,
} from './elements'

import type { ElementNode, Action, BakedData } from './types'

const COMPATIBLE_MAJOR_VERSION = 1

interface Props {
  bakedData: BakedData
  width?: number | string
  height?: number | string
}

function checkVersion(version: string): boolean {
  const major = parseInt(version.split('.')[0])
  return COMPATIBLE_MAJOR_VERSION === major
}

export class Player {
  private $el: Element | undefined
  private bakedData: BakedData
  private width: number | string
  private height: number | string

  private $svg: SVGElement | undefined
  private animationLoop: ReturnType<typeof useAnimationLoop> | undefined
  private currentFrame: number
  private reversed: boolean
  private oneshot: boolean
  private currentActionName: string

  private actionsByName: { [name: string]: Action }

  constructor(el: string | Element, props: Props) {
    if (isString(el)) {
      const $el = document.getElementById(el)
      if (!$el) throw new Error('Not found element: ' + el)
      this.$el = $el
    } else {
      this.$el = el
    }

    this.bakedData = props.bakedData
    this.actionsByName = this.bakedData.actions.reduce<{
      [name: string]: Action
    }>((p, action) => {
      p[action.name] = action
      return p
    }, {})
    this.currentActionName = this.bakedData.actions[0]?.name ?? ''

    if (!checkVersion(this.bakedData.version)) {
      throw new Error(
        `Version mismatch. Player Major: ${COMPATIBLE_MAJOR_VERSION}, Data: ${this.bakedData.version}`
      )
    }

    this.width = props.width ?? 0
    this.height = props.height ?? 0

    this.currentFrame = 0
    this.reversed = false
    this.oneshot = false
    this.mount()
  }

  getActionList(): { name: string; endFrame: number }[] {
    return this.bakedData.actions.map((a) => ({
      name: a.name,
      endFrame: a.attributesMapPerFrame.length - 1,
    }))
  }

  getCurrentActionName(): string {
    return this.currentActionName
  }

  setCurrentActionName(name: string) {
    if (name in this.actionsByName) {
      this.currentActionName = name
      this.currentFrame = Math.min(this.currentFrame, this.endFrame)
      this.render()
    } else {
      throw new Error('Not found the action.')
    }
  }

  private get currentAction(): Action | undefined {
    return this.actionsByName[this.currentActionName]
  }

  private get endFrame(): number {
    return (this.currentAction?.attributesMapPerFrame.length ?? 1) - 1
  }

  private mount() {
    if (!this.$el) return

    const $svg = renderNode({
      ...this.bakedData.svgTree,
      attributes: {
        ...this.bakedData.svgTree.attributes,
        width: this.width
          ? this.width.toString()
          : this.bakedData.svgTree.attributes.width,
        height: this.height
          ? this.height.toString()
          : this.bakedData.svgTree.attributes.height,
      },
    })
    this.$el.append($svg)
    this.$svg = $svg as SVGElement
    this.render()
  }

  private render() {
    if (!this.$el || !this.$svg || !this.currentAction) return

    this.$svg.innerHTML = ''

    const posedSvgNode = applyTransform(
      this.currentAction.attributesMapPerFrame[this.currentFrame],
      this.bakedData.svgTree
    )

    const $svg = renderNode(posedSvgNode)
    Object.keys(posedSvgNode.attributes).forEach((name) => {
      // drop original size attributes and use this class's size
      if (['width', 'height'].includes(name)) return
      setAttribute(this.$svg!, name, posedSvgNode.attributes[name])
    })
    appendChildren(this.$svg, Array.from($svg.children))
  }

  private tick(tickFrame: number) {
    if (this.reversed) {
      this.tickReverse(tickFrame)
    } else {
      this.tickForward(tickFrame)
    }
    this.render()
  }

  private tickReverse(tickFrame: number) {
    const val = this.currentFrame - tickFrame
    if (0 < val) {
      this.currentFrame = val
    } else {
      if (this.oneshot) {
        this.currentFrame = 0
        this.pause()
      } else {
        this.currentFrame = this.endFrame
      }
    }
  }

  private tickForward(tickFrame: number) {
    const val = this.currentFrame + tickFrame
    if (val < this.endFrame) {
      this.currentFrame = val
    } else {
      if (this.oneshot) {
        this.currentFrame = this.endFrame
        this.pause()
      } else {
        this.currentFrame = 0
      }
    }
  }

  reverse(oneshot = false) {
    if (this.animationLoop) {
      this.pause()
    }
    this.reversed = true
    this.oneshot = oneshot
    this.animationLoop = useAnimationLoop((tickFrame) => this.tick(tickFrame))
    this.animationLoop.begin()
  }

  play(oneshot = false) {
    if (this.animationLoop) {
      this.pause()
    }
    this.reversed = false
    this.oneshot = oneshot
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

function renderNode(node: ElementNode, html = false): SVGElement | HTMLElement {
  return (html ? createHTMLElement : createSVGElement)(
    node.tag,
    {
      ...node.attributes,
      style:
        (node.attributes.style ? node.attributes.style + ';' : '') +
          getExtraStyle(node) || undefined,
    },
    node.children.map((n) => {
      if (isString(n)) return n
      return renderNode(n, html || node.tag === 'foreignObject')
    })
  )
}

function getExtraStyle(node: ElementNode): string {
  const ret: string[] = []

  if (node.attributes.fill) {
    ret.push(`fill:${node.attributes.fill}`)
  }
  if (node.attributes.stroke) {
    ret.push(`stroke:${node.attributes.stroke}`)
  }

  return (
    (node.attributes.style ? node.attributes.style + ';' : '') + ret.join(';')
  )
}

function applyTransform(
  attributesMap: { [elementId: string]: { [name: string]: string } },
  node: ElementNode
): ElementNode {
  return {
    ...node,
    attributes: {
      ...node.attributes,
      ...(attributesMap[node.id] ?? {}),
    },
    children: node.children.map((c) => {
      if (isString(c)) return c
      return applyTransform(attributesMap, c)
    }),
  }
}

function isString(val: unknown): val is string {
  return typeof val === 'string'
}
