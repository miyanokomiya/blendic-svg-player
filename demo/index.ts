import { Player } from '../src/index'
import bakedData from './action.json'

console.log(bakedData)

let player = new Player('target', {
  bakedData: bakedData as any,
  width: '100%',
  height: '100%',
})

document.getElementById('dispose')?.addEventListener('click', () => {
  player.dispose()
})
document.getElementById('reverse')?.addEventListener('click', () => {
  player.reverse()
})
document.getElementById('play')?.addEventListener('click', () => {
  player.play()
})
document.getElementById('pause')?.addEventListener('click', () => {
  player.pause()
})
document.getElementById('stop')?.addEventListener('click', () => {
  player.stop()
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
  }
  reader.onerror = () => alert('Invalid data')
  reader.readAsText(file)
})
