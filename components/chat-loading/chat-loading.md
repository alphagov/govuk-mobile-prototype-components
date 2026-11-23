## While a question is answered

The app shows both stages while a question is sent, with Sending... where the question will be:

```html
<govuk-app-chat-loading stage="sending"></govuk-app-chat-loading>
<govuk-app-chat-loading></govuk-app-chat-loading>
```

Once it's sent, the question takes Sending...'s place, and the answer then takes the animation's.

## Known differences from the app

- The animation is drawn in CSS, not from the app's Lottie file, so the circles' sizes and the path they take are near the app's but not the same. Like the app's, it holds still when the user asks for less motion.
- The app's snapshots catch the screen as it fades in, so the square behind the animation shows paler than the screen around it. Once the screen has faded in, they're the same colour, as here.
