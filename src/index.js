const DEFAULTS = {
  easing: easeInOutQuad,
  duration: 300,
  onScrolled: () => {}
}

function easeInOutQuad (t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

let _interval

export default function (elem, target, options) {
  options = {...DEFAULTS, ...options}

  if (_interval) {
    clearInterval(_interval)
  }

  const startLocation = elem.scrollTop
  const distance = target - startLocation
  let timeLapsed = 0

  function stopAnimateScroll (position, flooredPosition) {
    if (position === target ||
      flooredPosition === target ||
      ((elem.innerHeight + flooredPosition) >= window.innerHeight)) {
      clearInterval(_interval)
      options.onScrolled()
    }
  }

  function loopAnimateScroll () {
    timeLapsed += 16
    let percentage = timeLapsed / options.duration
    percentage = (percentage > 1) ? 1 : percentage
    const position = startLocation + (distance * options.easing(percentage))
    const flooredPosition = Math.floor(position)
    elem.scrollTop = flooredPosition
    stopAnimateScroll(position, flooredPosition)
  }

  function startAnimateScroll () {
    _interval = setInterval(loopAnimateScroll, 16)
  }

  /**
   * Reset position to fix weird iOS bug
   * @link https://github.com/cferdinandi/smooth-scroll/issues/45
   */
  if (elem.pageYOffset === 0) {
    elem.scrollTop = 0
  }

  startAnimateScroll()
}
