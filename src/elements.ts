import type { Attributes } from './types'

const SVG_URL = 'http://www.w3.org/2000/svg'

export function createSVGElement(
  tag: string,
  attributes: Attributes = null,
  children: (Element | string)[] = []
): SVGElement {
  const $el = document.createElementNS(SVG_URL, tag)
  return createElement($el, attributes, children)
}

export function createHTMLElement(
  tag: string,
  attributes: Attributes = null,
  children: (Element | string)[] = []
): HTMLElement {
  const $el = document.createElement(tag)
  return createElement($el, attributes, children)
}

export function setAttribute($el: Element, name: string, value: string) {
  $el.setAttribute(name, value)
}

export function createElement<T extends Element>(
  $el: T,
  attributes: Attributes = null,
  children: (Element | string)[] = []
): T {
  for (const key in attributes) {
    if (attributes[key] !== undefined) {
      setAttribute($el, key, attributes[key]!.toString())
    }
  }
  if (Array.isArray(children)) {
    appendChildren($el, children)
  } else {
    $el.textContent = children
  }
  return $el
}

export function appendChildren($el: Element, children: (Element | string)[]) {
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
