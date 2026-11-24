# Chat example questions `<govuk-app-chat-example-questions>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/chat-example-questions/chat-example-questions.js"></script>`

Suggests questions to ask GOV.UK Chat, at the start of a new chat, under the welcome message. Pressing one asks it.

Content: A <govuk-app-chat-example-question> for each question, holding its text. Give one an href to go to a page, such as the answer, or a name and value to be a button.

Part `<govuk-app-chat-example-question>`: One example question, holding its text: a link to a page, such as the answer, or a button.

Attributes:
- `href` (string): Makes it a link to this page.
- `name` (string): Without an href, makes it a button with this name, so a page listening for clicks can tell which was pressed.
- `value` (string): Set on the button, alongside name, to say which of several it was.

Rules:
- Show them only in a new chat, after the welcome message, as the app does. Leave them out once the user has asked a question.
- Suggest two or three questions, as the app does.
- Write each as a user would ask it, about something GOV.UK Chat can answer.

Avoid:
- For things to do with the chat, such as clearing it. Instead: `govuk-app-menu-button-item` (see ../components/menu-button.md)
- For a question the user has asked. Instead: `govuk-app-chat-question` (see ../components/chat-question.md)
- For suggestions outside GOV.UK Chat, such as other screens to go to. Instead: `govuk-app-grouped-list-row type="navigation"` (see ../components/grouped-list.md)

Example, Three questions:
```html
<govuk-app-chat-example-questions>
  <govuk-app-chat-example-question href="#">How do I renew my passport?</govuk-app-chat-example-question>
  <govuk-app-chat-example-question href="#">What benefits can I get if I’m caring for someone?</govuk-app-chat-example-question>
  <govuk-app-chat-example-question href="#">When is my council tax due?</govuk-app-chat-example-question>
</govuk-app-chat-example-questions>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/chat-example-questions/
