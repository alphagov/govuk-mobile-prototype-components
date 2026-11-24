## On a GOV.UK Chat screen

Put it in the screen's footer, so it stays below the conversation as it scrolls. With a tab bar, the screen puts the tab bar below it, as the app does:

```html
<govuk-app-screen background="chat">
  <govuk-app-heading level="1" size="title-2" align="center">GOV.UK Chat</govuk-app-heading>
  <govuk-app-chat-answer note="Messages will be saved for 90 days.">
    <govuk-app-text>Hi, I’m GOV.UK Chat 👋. I use AI to help you find what you need on GOV.UK.</govuk-app-text>
  </govuk-app-chat-answer>
  <govuk-app-chat-input slot="footer" action="answer.html">
    <govuk-app-menu-button-item name="clear-chat" destructive icon="delete">Clear chat</govuk-app-menu-button-item>
    <govuk-app-menu-button-item name="privacy">Privacy notice</govuk-app-menu-button-item>
    <govuk-app-menu-button-item name="about">About</govuk-app-menu-button-item>
    <govuk-app-menu-button-item name="feedback">Give feedback</govuk-app-menu-button-item>
  </govuk-app-chat-input>
  <govuk-app-tab-bar>…</govuk-app-tab-bar>
</govuk-app-screen>
```

Sending a question sends the form to its `action`, so a prototype can go to a page with the answer, whatever is asked.

## Known differences from the app

- The app shows how many characters are left only while the field is being typed in. Here it shows whenever the question is near the limit, so it can be shown in a prototype's page.
- The app stops a question with personal data in it, such as an email address or a phone number, with an alert. Here any question can be sent.
- Return starts a new line, as in the app. On a computer, press the send button to send.
- The app's send button grows a little when it's pressed. Here it doesn't.
- Clear chat's icon is Material's delete, filled, in place of SF's trash, which is an outline.
