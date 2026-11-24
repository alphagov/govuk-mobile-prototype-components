# Chat loading `<govuk-app-chat-loading>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/chat-loading/chat-loading.js"></script>`

Shows that GOV.UK Chat is busy: Sending... while the user's question is sent, then Generating your answer…, with the app's animation, until the answer comes.

Attributes:
- `stage` (sending | generating, default generating): sending: Sending..., at the right, while the question is sent. generating: Generating your answer…, after the animation, while the answer is being written.

Rules:
- Use sending in place of the question the user has just asked, and generating below it, as the app shows both while a question is sent.
- Once the question is sent, show it with a chat question, and keep generating below it until the answer comes.
- Replace it with the answer. Never leave it in a conversation that has its answer.

Avoid:
- Once the answer has come. Instead: `govuk-app-chat-answer` (see ../components/chat-answer.md)
- For waiting on a screen that isn't GOV.UK Chat. Instead: Go straight to what comes next: the library has no other loading indicator

Example, Generating an answer:
```html
<govuk-app-chat-loading></govuk-app-chat-loading>
```

Example, Sending a question:
```html
<govuk-app-chat-loading stage="sending"></govuk-app-chat-loading>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/chat-loading/
