# Chat input `<govuk-app-chat-input>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/chat-input/chat-input.js"></script>`

Where the user asks GOV.UK Chat a question, pinned below the conversation: a field that grows as they type, a send button once there's a question, and a menu of things to do with the chat, such as clearing it.

Attributes:
- `action` (string): Where the form goes when the question is sent, such as the page with its answer. Without one, it goes to the page it's on.
- `method` (get | post, default get): How the form is sent. get puts the question in the address of the page it goes to.
- `name` (string, default question): The field's name, which the question is sent as.
- `value` (string): A question already typed, to show the field as the user is typing.
- `placeholder` (string, default Ask a question...): Shown in the field while it's empty.
- `label` (string): The field's name for screen readers. Without one, it's the placeholder.

Content: The menu's items, <govuk-app-menu-button-item> elements, top to bottom, as the app has them: Clear chat, destructive, with the delete icon, then Privacy notice, About and Give feedback. Without any, there's no menu.

Rules:
- Put it in the screen's footer, with slot="footer", so it's pinned below the conversation, and above the tab bar, if the screen has one.
- Use one on every GOV.UK Chat screen, including a new chat and while an answer is being generated, as the app does.
- Give it the app's menu: Clear chat, once there's a conversation to clear, then Privacy notice, About and Give feedback.
- Give it an action to take the user to the next page of a prototype when they send a question, such as its answer.

Avoid:
- To ask the user a question on a form, such as their postcode. Instead: `govuk-app-text-field` (see ../components/text-field.md)
- To search GOV.UK. Instead: `govuk-app-search-field` (see ../components/search-field.md)
- To search for something on a card of its own, such as a vehicle. Instead: `govuk-app-search-box` (see ../components/search-box.md)

Example, Empty, with its menu:
```html
<govuk-app-chat-input>
  <govuk-app-menu-button-item name="clear-chat" destructive icon="delete">Clear chat</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="privacy">Privacy notice</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="about">About</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="feedback">Give feedback</govuk-app-menu-button-item>
</govuk-app-chat-input>
```

Example, With a question:
```html
<govuk-app-chat-input value="How do I renew my passport?">
  <govuk-app-menu-button-item name="clear-chat" destructive icon="delete">Clear chat</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="privacy">Privacy notice</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="about">About</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="feedback">Give feedback</govuk-app-menu-button-item>
</govuk-app-chat-input>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/chat-input/
