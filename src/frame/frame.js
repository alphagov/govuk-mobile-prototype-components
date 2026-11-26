/**
 * <govuk-prototype-frame>: an iPhone around a prototype's <govuk-app>.
 *
 * Prototype furniture, not part of the app, so it is govuk-prototype- and not
 * govuk-app-. It draws the phone, iOS's status bar over the top of the screen
 * and its home indicator over the bottom, as iOS draws them over the app, and
 * shrinks the phone to fit the window. On a phone, it fills the screen
 * instead, and the phone's own status bar is the one over it.
 *
 *   <govuk-prototype-frame>
 *     <govuk-app>…</govuk-app>
 *   </govuk-prototype-frame>
 *
 * Attributes:
 *   bare                 no phone: the app fills the window, as it does on a
 *                        window as narrow as a phone's
 *   status-bar="light"   a white status bar, for a screen dark at its top
 *
 * Anything else in it, such as a link back to the prototype's index, goes
 * above the phone, and is hidden when the app fills the window.
 */

// Its stylesheet is added the way a component's is, so a page never has two.
import { stylesheet } from '../foundation/component.js'

const styles = new URL('./frame.css', import.meta.url)

// iOS's status bar: the time, the Dynamic Island, and the signal, wifi and
// battery. The icons are those of the app prototyping system's viewer
// (app-prototyping-system, exploration-2/viewer/index.html). 9:41, as Apple
// shows every iPhone.
const statusBar = `
  <div class="govuk-prototype-frame__status-bar" aria-hidden="true">
    <span class="govuk-prototype-frame__time">9:41</span>
    <span class="govuk-prototype-frame__island"></span>
    <span class="govuk-prototype-frame__icons">
      <svg class="govuk-prototype-frame__signal" viewBox="0 0 18 12"><rect x="0" y="7.3" width="3.2" height="4.2" rx="0.9"/><rect x="4.8" y="5.2" width="3.2" height="6.3" rx="0.9"/><rect x="9.6" y="2.9" width="3.2" height="8.6" rx="0.9"/><rect x="14.4" y="0.5" width="3.2" height="11" rx="0.9"/></svg>
      <svg class="govuk-prototype-frame__wifi" viewBox="0 0 16 12"><path stroke-linejoin="round" stroke-width="0.6" d="M8 11.2 L5.67 8.87 A3.3 3.3 0 0 1 10.33 8.87Z M2.98 6.18 A7.1 7.1 0 0 1 13.02 6.18 L11.25 7.95 A4.6 4.6 0 0 0 4.75 7.95Z M0.29 3.49 A10.9 10.9 0 0 1 15.71 3.49 L13.94 5.26 A8.4 8.4 0 0 0 2.06 5.26Z"/></svg>
      <svg class="govuk-prototype-frame__battery" viewBox="0 0 28 13"><rect class="govuk-prototype-frame__battery-case" x="0.5" y="0.5" width="24" height="12" rx="3.8"/><rect x="2.5" y="2.5" width="20" height="8" rx="2.2"/><path class="govuk-prototype-frame__battery-cap" d="M26 4.5c.9.3 1.5 1.1 1.5 2s-.6 1.7-1.5 2Z"/></svg>
    </span>
  </div>`

// The phone's screen, 402pt by 874pt like an iPhone 17 Pro, and the room its
// 10pt bezel takes around it (frame.css).
const screen = { width: 402, height: 874 }
const bezel = 10

// Narrower than this, the window is a phone's, so the app fills it.
const phoneSized = matchMedia('(max-width: 460px)')

class PrototypeFrame extends HTMLElement {
  static observedAttributes = ['bare', 'status-bar']
  #frame = null
  #stage = null
  #phone = null
  #resize = new ResizeObserver(() => this.#fit())
  #update = () => this.#draw()

  connectedCallback() {
    if (!this.#frame) this.#build()
    this.#resize.observe(this.#stage)
    phoneSized.addEventListener('change', this.#update)
    this.#draw()
  }

  disconnectedCallback() {
    this.#resize.disconnect()
    phoneSized.removeEventListener('change', this.#update)
  }

  attributeChangedCallback() {
    if (this.#frame) this.#draw()
  }

  // Moves what was written inside it into the phone, and what isn't the app
  // above it. Done once: the app's components are drawn again as they move,
  // which is quick, but would lose anything typed into them later.
  #build() {
    const app = this.querySelector(':scope > govuk-app')
    const above = [...this.childNodes].filter(node => node !== app)

    this.#frame = document.createElement('div')
    this.#frame.className = 'govuk-prototype-frame'
    this.#frame.innerHTML = `
      <div class="govuk-prototype-frame__above"></div>
      <div class="govuk-prototype-frame__stage">
        <div class="govuk-prototype-frame__phone">
          ${statusBar}
          <div class="govuk-prototype-frame__home-indicator" aria-hidden="true"></div>
        </div>
      </div>`
    this.#stage = this.#frame.querySelector('.govuk-prototype-frame__stage')
    this.#phone = this.#frame.querySelector('.govuk-prototype-frame__phone')

    const aboveArea = this.#frame.querySelector('.govuk-prototype-frame__above')
    aboveArea.append(...above)
    // Only take up room, and the gap under it, if there's something in it.
    aboveArea.hidden = !above.some(node => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim())

    if (app) {
      app.classList.add('govuk-prototype-frame__app')
      this.#phone.querySelector('.govuk-prototype-frame__status-bar').after(app)
    }
    this.replaceChildren(this.#frame)
  }

  #draw() {
    this.#frame.classList.toggle('govuk-prototype-frame--bare', this.hasAttribute('bare') || phoneSized.matches)
    this.#frame.classList.toggle('govuk-prototype-frame--light-status-bar', this.getAttribute('status-bar') === 'light')
    this.#fit()
  }

  // Shrinks the phone, as a whole, so all of its screen is in view without
  // scrolling. CSS can't yet divide one length by another everywhere, so
  // this works out the scale, from the room the stage has for the phone and
  // its bezel. Never below 0.4, where the screen would be too small to use.
  #fit() {
    const scale = Math.min(
      1,
      (this.#stage.clientHeight - 2 * bezel) / screen.height,
      (this.#stage.clientWidth - 2 * bezel) / screen.width,
    )
    this.#phone.style.setProperty('--govuk-prototype-frame-scale', String(Math.max(scale, 0.4)))
  }
}

// Defined once its styles have loaded, so the phone is never drawn unstyled.
if (!customElements.get('govuk-prototype-frame')) {
  await stylesheet(styles)
  customElements.get('govuk-prototype-frame') || customElements.define('govuk-prototype-frame', PrototypeFrame)
}
