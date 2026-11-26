/**
 * Remembers what's typed and chosen, so one screen can use an answer given on
 * another. Load it on every screen:
 *
 *   <script type="module" src="/prototype.js"></script>
 *
 * Answers are kept until the browser tab is closed, or they're cleared.
 *
 *   Saving       Any field with a name: a text field, a toggle, a choice. Its
 *                answer is saved as it changes, under its name. A toggle's
 *                answer is "on" or "off".
 *   Showing      <span data-answer="postcode">your postcode</span> shows the
 *                answer to postcode, or what's written there if there isn't one.
 *                Add data-answer-into="detail" to put it in an attribute
 *                instead, such as a grouped list row's detail.
 *   Filling in   A field whose name has an answer shows it again, so going
 *                back to a screen keeps what was typed.
 *   If           data-show-if="notifications=on" shows something only if that
 *                is the answer, data-show-if="notifications!=on" only if it
 *                isn't, and data-show-if="postcode" only if there's any answer.
 *                Put it on a component, such as <govuk-app-text>.
 *   Clearing     A link or button with data-clear-answers clears every answer
 *                when it's pressed. Or, in the browser's console,
 *                prototype.clearAnswers().
 */

const key = 'govuk-app-prototype-answers'

/** Every answer, by its field's name. */
export function answers() {
  try {
    return JSON.parse(sessionStorage.getItem(key)) ?? {}
  } catch {
    return {}
  }
}

/** Saves one answer, and shows it wherever the page uses it. */
export function setAnswer(name, value) {
  const all = answers()
  all[name] = value
  try {
    sessionStorage.setItem(key, JSON.stringify(all))
  } catch {
    // Private browsing can refuse to store anything: answers just aren't kept.
  }
  update()
}

/** Forgets every answer. */
export function clearAnswers() {
  try {
    sessionStorage.removeItem(key)
  } catch {}
  update()
}

const fields = 'input[name], select[name], textarea[name]'

// A checkbox with no value of its own, such as a toggle, is "on" or "off", so
// a screen can show something only if it was turned off.
function answerOf(field) {
  if (field.type === 'checkbox') {
    if (field.value === 'on') return field.checked ? 'on' : 'off'
    return field.checked ? field.value : ''
  }
  if (field.type === 'radio') return field.checked ? field.value : null
  return field.value
}

function save(field) {
  if (['button', 'submit', 'reset', 'hidden', 'password', 'file'].includes(field.type)) return
  const answer = answerOf(field)
  if (answer !== null) setAnswer(field.name, answer)
}

// Components draw their fields after the page loads, and again when they
// change, so each new field is filled in as it appears.
const filled = new WeakSet()

function fillIn(field, all) {
  if (filled.has(field) || !(field.name in all)) return
  filled.add(field)
  const answer = all[field.name]
  if (field.type === 'checkbox') field.checked = answer === 'on' || (answer !== 'off' && answer === field.value)
  else if (field.type === 'radio') field.checked = answer === field.value
  else if (!['button', 'submit', 'reset', 'hidden', 'password', 'file'].includes(field.type)) field.value = answer
}

function shows(condition, all) {
  const [, name, not, value] = condition.match(/^\s*([^!=]+?)\s*(?:(!?)=\s*(.*?))?\s*$/) ?? []
  if (!name) return true
  const answer = all[name]
  if (value === undefined) return answer !== undefined && answer !== '' && answer !== 'off'
  return not ? answer !== value : answer === value
}

function update() {
  const all = answers()
  for (const field of document.querySelectorAll(fields)) fillIn(field, all)

  for (const element of document.querySelectorAll('[data-answer]')) {
    const name = element.dataset.answer
    const into = element.dataset.answerInto
    if (into) {
      // What was written first, to go back to if the answers are cleared.
      if (!('answerDefault' in element.dataset)) element.dataset.answerDefault = element.getAttribute(into) ?? ''
      const answer = all[name] ?? element.dataset.answerDefault
      if (element.getAttribute(into) !== answer) element.setAttribute(into, answer)
    } else {
      if (!('answerDefault' in element.dataset)) element.dataset.answerDefault = element.textContent
      const answer = all[name] || element.dataset.answerDefault
      if (element.textContent !== answer) element.textContent = answer
    }
  }

  // Hidden with display, not the hidden attribute, which a component's own
  // display: contents would win over.
  for (const element of document.querySelectorAll('[data-show-if]')) {
    const show = shows(element.dataset.showIf, all)
    element.style.display = show ? '' : 'none'
  }
}

document.addEventListener('input', event => {
  if (event.target.matches?.(fields)) save(event.target)
})
document.addEventListener('change', event => {
  if (event.target.matches?.(fields)) save(event.target)
})
document.addEventListener('submit', event => {
  for (const field of event.target.querySelectorAll(fields)) save(field)
})
document.addEventListener('click', event => {
  if (event.target.closest?.('[data-clear-answers]')) clearAnswers()
})

new MutationObserver(() => update()).observe(document.documentElement, { childList: true, subtree: true })
update()

// For trying things in the browser's console.
window.prototype = { answers, setAnswer, clearAnswers }
