// Copy buttons: on the examples, pressing one copies its example's HTML, and
// in a copy box, its command or request. Either says so, on the button and to
// screen readers, for a few seconds.

const buttons = [
  { button: '.docs-example__copy', box: '.docs-example__code', text: 'pre', status: '.docs-example__copy-status', label: 'Copy code', copied: 'Code copied' },
  { button: '.docs-copy__button', box: '.docs-copy', text: '.docs-copy__text', status: '.docs-copy__status', label: 'Copy', copied: 'Copied' }
]

document.addEventListener('click', async event => {
  for (const kind of buttons) {
    const button = event.target.closest(kind.button)
    if (!button) continue

    const box = button.closest(kind.box)
    const status = box.querySelector(kind.status)
    try {
      await navigator.clipboard.writeText(box.querySelector(kind.text).textContent)
    } catch {
      status.textContent = 'Could not copy it. Select it and copy it instead'
      return
    }

    button.textContent = kind.copied
    status.textContent = kind.copied
    clearTimeout(button.reset)
    button.reset = setTimeout(() => {
      button.textContent = kind.label
      status.textContent = ''
    }, 5000)
    return
  }
})
