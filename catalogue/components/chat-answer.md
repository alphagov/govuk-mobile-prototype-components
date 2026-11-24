# Chat answer `<govuk-app-chat-answer>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/chat-answer/chat-answer.js"></script>`

Shows GOV.UK Chat's answer to a question, on a white card the width of the conversation, with the GOV.UK pages it used and a warning to check them. Also GOV.UK Chat's welcome message, at the start of a new chat.

Attributes:
- `note` (string): A note below the message, in small grey text, 24pt below it, as the welcome message says Messages will be saved for 90 days.
- `sources-open` (boolean, default false): Draws the list of GOV.UK pages open. The app starts it closed, and the user opens it.

Content: The answer, written with <govuk-app-text>, <govuk-app-heading level="3" size="body"> and <govuk-app-bulleted-list spacing="compact">, with <govuk-app-link> for links in them. Then a <govuk-app-chat-source href="…"> for each GOV.UK page it used, holding the page's title. With sources, it draws the warning and the list of pages.

Part `<govuk-app-chat-source>`: One GOV.UK page the answer used, holding the page's title, listed under the answer.

Attributes:
- `href` (string, required): The page's address on GOV.UK.

Rules:
- Follow each question with its answer.
- Give an answer the GOV.UK pages it used, as the app's answers have, so the warning to check them is shown. Leave them off only to show an answer the app couldn't find pages for.
- Write the answer as GOV.UK Chat would: short paragraphs, headings in Body, semibold, and lists, with links to GOV.UK pages.
- Start a new chat with the welcome message: Hi, I’m GOV.UK Chat 👋. I use AI to help you find what you need on GOV.UK., with the note Messages will be saved for 90 days. Leave its sources off.

Avoid:
- For the user's own question. Instead: `govuk-app-chat-question` (see ../components/chat-question.md)
- While the answer is being generated. Instead: `govuk-app-chat-loading stage="generating"` (see ../components/chat-loading.md)
- For text on a screen that isn't GOV.UK Chat. Instead: `govuk-app-text` (see ../components/text.md)

Example, With the pages it used:
```html
<govuk-app-chat-answer sources-open>
  <govuk-app-text>You can renew your passport online. It costs £94.50 and usually takes up to 3 weeks.</govuk-app-text>
  <govuk-app-text>You’ll need a <govuk-app-link href="https://www.gov.uk/photos-for-passports">digital photo</govuk-app-link> and a credit or debit card.</govuk-app-text>
  <govuk-app-chat-source href="https://www.gov.uk/renew-adult-passport">Renew or replace your adult passport</govuk-app-chat-source>
  <govuk-app-chat-source href="https://www.gov.uk/passport-fees">Passport fees</govuk-app-chat-source>
</govuk-app-chat-answer>
```

Example, Without sources:
```html
<govuk-app-chat-answer>
  <govuk-app-text>Sorry, I cannot answer that. Try asking about something on GOV.UK.</govuk-app-text>
</govuk-app-chat-answer>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/chat-answer/
