![Main](https://github.com/miyanokomiya/blendic-svg-player/workflows/test/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# blendic-svg-player
This is the component to play the animations exported by Blendic SVG.

The detail of Blendic SVG is here: https://github.com/miyanokomiya/blendic-svg

## demo
https://miyanokomiya.github.io/blendic-svg-player/

## usage

### install
```sh
yarn add blendic-svg-player
```

### mount
```html
<div id="target_id" />
```

```ts
import { Player } from 'blendic-svg-player'

const bakedData = { /* json data exported by Blendic SVG */ }

const player = new Player('target_id', {
  bakedData: bakedData,
  width: '100%',
  height: '100%',
})

player.play()
// player.reverse()
// player.pause()
// player.stop()
// player.dispose()
```

## commnad

``` bash
# install dependencies
$ yarn install

# start dev & demo server
$ yarn demo

# lint
$ yarn lint[:fix]

# test
$ yarn test [--watch]

# build
$ yarn build
```

## publish
Update `version` in `package.json`, commit with a comment `Release x.x.x` and merge into the `main` branch.
