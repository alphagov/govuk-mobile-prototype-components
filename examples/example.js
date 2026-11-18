// Draws iOS's status bar over the top of each phone, as iOS draws it over
// the app: the time, the Dynamic Island, and the signal, wifi and battery.
// And its home indicator over the bottom.
// The icons are those of the app prototyping system's viewer
// (app-prototyping-system, exploration-2/viewer/index.html).
//
// 9:41, as Apple shows every iPhone.
const statusBar = `
  <div class="example-status-bar" aria-hidden="true">
    <span class="example-status-bar__time">9:41</span>
    <span class="example-status-bar__island"></span>
    <span class="example-status-bar__icons">
      <svg class="example-status-bar__signal" viewBox="0 0 18 12"><rect x="0" y="7.3" width="3.2" height="4.2" rx="0.9"/><rect x="4.8" y="5.2" width="3.2" height="6.3" rx="0.9"/><rect x="9.6" y="2.9" width="3.2" height="8.6" rx="0.9"/><rect x="14.4" y="0.5" width="3.2" height="11" rx="0.9"/></svg>
      <svg class="example-status-bar__wifi" viewBox="0 0 16 12"><path stroke-linejoin="round" stroke-width="0.6" d="M8 11.2 L5.67 8.87 A3.3 3.3 0 0 1 10.33 8.87Z M2.98 6.18 A7.1 7.1 0 0 1 13.02 6.18 L11.25 7.95 A4.6 4.6 0 0 0 4.75 7.95Z M0.29 3.49 A10.9 10.9 0 0 1 15.71 3.49 L13.94 5.26 A8.4 8.4 0 0 0 2.06 5.26Z"/></svg>
      <svg class="example-status-bar__battery" viewBox="0 0 28 13"><rect class="example-status-bar__battery-case" x="0.5" y="0.5" width="24" height="12" rx="3.8"/><rect x="2.5" y="2.5" width="20" height="8" rx="2.2"/><path class="example-status-bar__battery-cap" d="M26 4.5c.9.3 1.5 1.1 1.5 2s-.6 1.7-1.5 2Z"/></svg>
    </span>
  </div>`

// A way back to the docs site, which would otherwise be a dead end. The
// Examples page is the folder this script is in, wherever the site is served.
document.body.insertAdjacentHTML('afterbegin', `
  <a class="example-back" href="${new URL('./', import.meta.url)}">Back to examples</a>`)
const back = document.querySelector('.example-back')

// Shrinks the phone to fit the window, as a whole, so all of the screen is
// in view without scrolling the page. CSS can't yet divide one length by
// another everywhere, so this works out the scale. The room around it is
// the body's 24px padding, and the bezel's 10px, and above it the back link
// and the 16px under it, while the link is shown.
const room = 2 * (24 + 10)
function fit() {
  const above = back.offsetHeight ? back.offsetHeight + 16 : 0
  const scale = Math.min(1, (innerHeight - room - above) / 874, (innerWidth - room) / 402)
  document.documentElement.style.setProperty('--example-scale', String(Math.max(scale, 0.4)))
}
fit()
addEventListener('resize', fit)

for (const phone of document.querySelectorAll('.example-phone')) {
  phone.insertAdjacentHTML('afterbegin', statusBar)
  phone.insertAdjacentHTML('beforeend', '<div class="example-home-indicator" aria-hidden="true"></div>')
}

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
// network. iOS asks the user first, and only in answer to a tap; once they've
// allowed it, asking again on each page is silent.
if ('DeviceMotionEvent' in window) {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    addEventListener('touchend', () => {
      DeviceMotionEvent.requestPermission()
        .then(state => { if (state === 'granted') addEventListener('devicemotion', onMotion) })
        .catch(() => {})
    }, { once: true })
  } else {
    addEventListener('devicemotion', onMotion)
  }
}
