# Chat question `<govuk-app-chat-question>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/chat-question/chat-question.js"></script>`

Shows a question the user asked GOV.UK Chat, in a dark blue bubble at the right of the conversation.

Content: The question, as text, as the user typed it.

Rules:
- Use it in a screen of GOV.UK Chat, after the answer before it, or after the welcome message for the first question.
- Follow it with the answer, or with a chat loading while the answer is being generated.
- Write the question as a user would type it: in their words, not GOV.UK's.

Avoid:
- For GOV.UK Chat's answer, or its welcome message. Instead: `govuk-app-chat-answer` (see ../components/chat-answer.md)
- For a question the user hasn't asked yet, suggested to them. Instead: `govuk-app-chat-example-questions` (see ../components/chat-example-questions.md)

Example, A short question:
```html
<govuk-app-chat-question>How do I renew my passport?</govuk-app-chat-question>
```

Example, A longer question:
```html
<govuk-app-chat-question>I’m moving to Spain next year. Do I need to exchange my driving licence, and how long do I have to do it?</govuk-app-chat-question>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/chat-question/
