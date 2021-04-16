import { Player } from '../src/index'
import bakedData from './action.json'

console.log(bakedData)

let player = new Player('target', {
  bakedData: bakedData as any,
  width: '100%',
  height: '100%',
})
initActionNameSelect()

function initActionNameSelect() {
  if (!player) return

  const select = document.getElementById('action-name')!
  select.innerHTML = ''
  const fragment = document.createDocumentFragment()
  player.getActionList().forEach((a) => {
    const option = document.createElement('option')
    option.setAttribute('value', a.name)
    if (a.name === player.getCurrentActionName()) {
      option.setAttribute('selected', 'selected')
    }
    option.text = a.name
    fragment.appendChild(option)
  })
  select.appendChild(fragment)
}

document.getElementById('dispose')?.addEventListener('click', () => {
  player.dispose()
})
document.getElementById('reverse')?.addEventListener('click', () => {
  player.reverse()
})
document.getElementById('play')?.addEventListener('click', () => {
  player.play()
})
document.getElementById('reverse-once')?.addEventListener('click', () => {
  player.reverse(true)
})
document.getElementById('play-once')?.addEventListener('click', () => {
  player.play(true)
})
document.getElementById('pause')?.addEventListener('click', () => {
  player.pause()
})
document.getElementById('stop')?.addEventListener('click', () => {
  player.stop()
})
document.getElementById('action-name')?.addEventListener('input', (e: any) => {
  player.setCurrentActionName(e.target.value)
})

document.getElementById('file')?.addEventListener('input', (e) => {
  const target = e.target as any
  if (target?.files?.length !== 1) return

  const file = target.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    const jsonStr = reader.result as string
    if (player) {
      player.dispose()
    }
    const bakedData = JSON.parse(jsonStr)
    player = new Player('target', {
      bakedData: bakedData as any,
      width: '100%',
      height: '100%',
    })
    initActionNameSelect()
  }
  reader.onerror = () => alert('Invalid data')
  reader.readAsText(file)
})
