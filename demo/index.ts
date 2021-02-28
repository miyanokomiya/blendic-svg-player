import { Player } from '../src/index'
import bakedData from './action.json'

console.log(bakedData)

const player = new Player('target', {
  bakedData: bakedData as any,
  width: '100%',
  height: '100%',
})

player.mount()

document.getElementById('dispose')?.addEventListener('click', async () => {
  player.dispose()
})
document.getElementById('reverse')?.addEventListener('click', async () => {
  player.reverse()
})
document.getElementById('play')?.addEventListener('click', async () => {
  player.play()
})
document.getElementById('pause')?.addEventListener('click', async () => {
  player.pause()
})
document.getElementById('stop')?.addEventListener('click', async () => {
  player.stop()
})
