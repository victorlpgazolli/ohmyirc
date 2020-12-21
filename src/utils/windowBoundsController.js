import { config } from '../store/config'

export const getWindowBounds = function () {
  const { width, height, x, y } = config.get('windowBounds')

  return {
    width: width || 1100,
    height: height || 700,
    x,
    y
  }
}

export const setWindowBounds = function (bounds) {
  if (!bounds) {
    return
  }
  const { width, height, x, y } = bounds

  config.set('windowBounds', {
    width: width || 1100,
    height: height || 700,
    x,
    y
  })
}
