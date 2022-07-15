import { optimize } from 'svgo/dist/svgo.browser'
import { hslToHex, rgbToHsl, rgbToHex } from './utils'


function genSVG(width = 0, height = 0, imgData = {}, greyscale = true, svgo = true) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  let currentColor = []
  const colors = []
  for (let i = 0; i < imgData.data.length; i++) {
    const channel = i % 4
    currentColor.push(imgData.data[i])

    if (channel === 3) {
      // Remember the previous color
      colors.push(currentColor)
      // Flush the previous color
      currentColor = []
    }
  }
  for (let i = 0; i < colors.length; i++) {
    const x = i % width
    const y = (i - x) / width
    if (colors[i][3] !== 0) {
      const rect = document.createElement('rect')
      rect.setAttribute('x', x)
      rect.setAttribute('y', y)
      rect.setAttribute('width', 1)
      rect.setAttribute('height', 1)

      // Convert to hex
      let colorValue = colors[i].slice(0, 3)
      if (greyscale) {
        // Convert to HSL first to strip the saturation data
        colorValue = rgbToHsl(colorValue[0], colorValue[1], colorValue[2])
        colorValue = hslToHex(colorValue[0], 0, colorValue[2])
      } else {
        colorValue = rgbToHex(colorValue[0], colorValue[1], colorValue[2])
      }
      rect.setAttribute('fill', colorValue)
      if (colors[i][3] !== 255) {
        rect.setAttribute('fill-opacity', Math.round(colors[i][3] / 255 * 100) / 100)
      }
      svg.appendChild(rect)
    }
  }

  if (svgo) {
    const { data, error } = optimize(svg.outerHTML, {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              convertColors: false,
            },
          },
        },
      ],
      js2svg: {
        indent: 2,
        pretty: false,
      },
    })
    if (error) throw new Error(error)
    return data
  }

  return svg.outerHTML
}

export default genSVG


