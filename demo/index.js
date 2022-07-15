import genSVG from '../'

function setupCanvas() {
  const markup = document.getElementById('markup')
  const container = document.getElementById('container')
  markup.addEventListener('focus', (e) => {
    e.target.select()
  })

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  document.getElementById('uploader').addEventListener('change', handleImageFile)

  function handleImageFile(event) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const imgEl = new Image()
      imgEl.onload = function () {
        ctx.drawImage(imgEl, 0, 0)
        const svgText = genSVG(
          imgEl.width,
          imgEl.height,
          ctx.getImageData(0, 0, imgEl.width, imgEl.height),
          true
        )
        container.innerHTML = svgText
        markup.value = svgText
      }
      imgEl.src = e.target.result
    }
    reader.readAsDataURL(event.target.files[0])
  }
}

window.addEventListener('load', setupCanvas)


