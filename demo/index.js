import genSVG from '../'

function setupCanvas() {
  const markup = document.getElementById('markup')
  const svg = document.getElementById('preview')
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
        const svgEl = genSVG(
          imgEl.width,
          imgEl.height,
          ctx.getImageData(0, 0, imgEl.width, imgEl.height),
          true
        )
        svg.setAttribute('viewBox', svgEl.getAttribute('viewBox'))
        svg.innerHTML = svgEl.innerHTML
        markup.value = svgEl.outerHTML
      }
      imgEl.src = e.target.result
    }
    reader.readAsDataURL(event.target.files[0])
  }
}

window.addEventListener('load', setupCanvas)


