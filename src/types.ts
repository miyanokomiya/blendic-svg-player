export type Attributes = { [key: string]: string | number } | null

export interface ElementNode {
  id: string
  tag: string
  attributes: { [name: string]: string }
  children: (ElementNode | string)[]
}

export interface Action {
  name: string
  attributesMapPerFrame: { [elementId: string]: { [name: string]: string } }[]
}

export interface BakedData {
  version: string
  appVersion: string
  actions: Action[]
  svgTree: ElementNode
}
