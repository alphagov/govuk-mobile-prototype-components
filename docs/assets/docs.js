// "Copy code" buttons on the examples: pressing one copies its example's HTML,
// and says so, on the button and to screen readers, for a few seconds.

const label = 'Copy code'
const copiedLabel = 'Code copied'

document.addEventListener('click', async event => {
  const button = event.target.closest('.docs-example__copy')
  if (!button) return

  const code = button.closest('.docs-example__code')
  const status = code.querySelector('.docs-example__copy-status')
  try {
    await navigator.clipboard.writeText(code.querySelector('pre').textContent)
  } catch {
    status.textContent = 'Could not copy the code'
    return
  }

  button.textContent = copiedLabel
  status.textContent = copiedLabel
  clearTimeout(button.reset)
  button.reset = setTimeout(() => {
    button.textContent = label
    status.textContent = ''
  }, 5000)
})
