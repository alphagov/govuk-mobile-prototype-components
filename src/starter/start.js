// Lists the prototype's screens, from prototype.json, on the start page.

const escape = text => String(text ?? '').replace(/[&<>"]/g, character => `&#${character.charCodeAt(0)};`)
const response = await fetch('/prototype.json', { cache: 'no-store' })
const prototype = await response.json()

document.title = prototype.name || 'Prototype'
document.getElementById('name').textContent = prototype.name || 'Prototype'
if (prototype.description) {
  const description = document.getElementById('description')
  description.textContent = prototype.description
  description.hidden = false
}

// Screens in the order they're listed, under their group's name, if any.
const groups = new Map()
for (const screen of prototype.screens ?? []) {
  const group = screen.group ?? ''
  if (!groups.has(group)) groups.set(group, [])
  groups.get(group).push(screen)
}
if (groups.size) {
  document.getElementById('screens').innerHTML = [...groups].map(([group, screens]) => `
    ${group ? `<h2 class="start__group">${escape(group)}</h2>` : ''}
    <ul class="start__screens">
      ${screens.map(screen => `
        <li class="start__screen">
          <a href="${escape(screen.path)}">${escape(screen.title)}</a>
          ${screen.description ? `<p>${escape(screen.description)}</p>` : ''}
        </li>`).join('')}
    </ul>`).join('')
}
