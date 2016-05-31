const DEFAULTS = {
  easing: easeInOutQuad,
  duration: 300,
  onScrolled: () => {}
}

function easeInOutQuad (t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

let _interval

function getDocumentHeight () {
  return Math.max(document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight)
}

function scroll (elem, value) {
  if (elem.scrollTop) {
    elem.scrollTop = value
  } else {
    elem.scrollTo(0, value)
  }
}

export default function (elem, target, options) {
  options = {...DEFAULTS, ...options}

  if (_interval) {
    clearInterval(_interval)
  }

  const startLocation = elem.scrollTop || elem.pageYOffset
  const distance = target - startLocation
  let timeLapsed = 0

  function stopAnimateScroll (position, flooredPosition) {
    if (position === target ||
      flooredPosition === target ||
      ((elem.innerHeight + flooredPosition) >= getDocumentHeight())) {
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
    scroll(elem, flooredPosition)
    stopAnimateScroll(position, flooredPosition)
  }

  function startAnimateScroll () {
    _interval = setInterval(loopAnimateScroll, 16)
  }

  /**
   * Reset position to fix weird iOS bug
   * @link https://github.com/cferdinandi/smooth-scroll/issues/45
   */
  if (elem.scrollTop === 0 || elem.pageYOffset === 0) {
    scroll(elem, 0)
  }

  startAnimateScroll()
}
