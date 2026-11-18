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

for (const phone of document.querySelectorAll('.example-phone')) {
  phone.insertAdjacentHTML('afterbegin', statusBar)
  phone.insertAdjacentHTML('beforeend', '<div class="example-home-indicator" aria-hidden="true"></div>')
}
