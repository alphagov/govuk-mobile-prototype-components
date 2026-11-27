# Chat (template)

The app’s Chat tab, GOV.UK Chat, in its own words: a new chat with its welcome message and questions to try, a question being answered, and the answer, with the GOV.UK pages it used. Asking a question moves through all three.

Use when:
- Prototyping a question and answer in GOV.UK Chat, such as how Chat should answer about a service.
- Prototyping a change to how Chat looks or behaves, such as a new kind of answer or something new under the field.
- Prototyping a journey that starts in Chat, or one that Chat hands on to another screen.
- Testing different questions to try, or a change to Chat’s wording.

Screens, in the repository and the package:
- GOV.UK Chat: src/templates/chat/index.html. A new chat: the welcome message and three questions to try. The first question, or typing one and sending it, asks it.
- Generating your answer: src/templates/chat/generating.html. The question, with the loading indicator under it. Moves on to the answer by itself after 3 seconds.
- Answer: src/templates/chat/answer.html. Chat’s answer, with headings, a bulleted list, links and the GOV.UK pages it used. Sending another question asks it; Clear chat, in the field’s menu, starts a new chat.

Components: [`govuk-app-screen`](../components/screen.md), [`govuk-app-heading`](../components/heading.md), [`govuk-app-text`](../components/text.md), [`govuk-app-bulleted-list`](../components/bulleted-list.md), [`govuk-app-link`](../components/link.md), [`govuk-app-chat-answer`](../components/chat-answer.md), [`govuk-app-chat-question`](../components/chat-question.md), [`govuk-app-chat-loading`](../components/chat-loading.md), [`govuk-app-chat-example-questions`](../components/chat-example-questions.md), [`govuk-app-chat-input`](../components/chat-input.md), [`govuk-app-menu-button`](../components/menu-button.md), [`govuk-app-tab-bar`](../components/tab-bar.md)

Notes:
- Copy the whole folder, so the screens keep linking to each other. Each page has a comment at its top saying what to change and what to leave.
- The pages are plain HTML, so they move on with links, the field’s form and a page that refreshes. Whatever is typed, the answer is the one in answer.html.
- To ask another question, change it in all three pages, and write its answer in answer.html. For a longer conversation, copy generating.html and answer.html for each question, and point each at the next.
- Only the first question to try goes somewhere. Privacy notice, About and Give feedback, in the field’s menu, go nowhere.
- The app asks the user to agree to GOV.UK Chat’s terms before their first chat. Those screens aren’t here.
- Home and Settings on the tab bar open the Home and Settings templates, if they’re beside this one.

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/templates/chat/about/
