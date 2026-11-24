// What the examples have that a prototype doesn't: a way back to the docs
// site from a phone. Each example's phone is <govuk-prototype-frame>
// (frame/frame.js), with a link back to the examples above it.

// Shaking the phone opens a menu, as shaking a TestFlight build does, with
// the way back to the examples: on a phone the example fills the screen, so
// there's nothing else to tap. The examples' index is the folder this script
// is in, so the link works wherever the site is served from.
document.body.insertAdjacentHTML('beforeend', `
  <dialog class="example-menu" aria-label="Example menu">
    <div class="example-menu__group">
      <a class="example-menu__item" href="${new URL('./', import.meta.url)}">Back to examples</a>
    </div>
    <form class="example-menu__group" method="dialog">
      <button class="example-menu__item example-menu__item--cancel">Cancel</button>
    </form>
  </dialog>`)
const menu = document.querySelector('.example-menu')

// Tapping outside the sheet closes it, as on iOS.
menu.addEventListener('click', event => {
  if (event.target === menu) menu.close()
})

// A shake is a few firm jolts in quick succession, so a single bump, or
// putting the phone down, doesn't open the menu. Each change of direction
// is a jolt. `acceleration` leaves out gravity, so turning the phone over
// doesn't count either. 10 m/s², about 1g: at 15, it took a hard flick.
const joltThreshold = 10
const joltsInAShake = 3
const shakeWindow = 1500
let jolts = []

function onMotion(event) {
  const a = event.acceleration
  if (a?.x == null || Math.hypot(a.x, a.y, a.z) < joltThreshold) return

  // One jolt lasts several readings; count it once.
  const now = event.timeStamp
  if (jolts.length && now - jolts.at(-1) < 100) return
  jolts = [...jolts.filter(time => now - time < shakeWindow), now]

  if (jolts.length >= joltsInAShake && !menu.open) {
    jolts = []
    menu.showModal()
  }
}

// Browsers only send motion to secure pages, so not over http on the local
// network. Listen from the start: if the user has already allowed motion on
// another page, there's no need to wait for a tap on this one.
if ('DeviceMotionEvent' in window) {
  addEventListener('devicemotion', onMotion)

  // iOS asks the user first, and only in answer to a tap; once they've
  // allowed it, asking again is silent. A touch that ends a scroll isn't a
  // tap, and iOS turns the request down, so keep asking until it answers.
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    const ask = () => {
      DeviceMotionEvent.requestPermission()
        .then(() => removeEventListener('touchend', ask))
        .catch(() => {})
    }
    addEventListener('touchend', ask)
  }
}
