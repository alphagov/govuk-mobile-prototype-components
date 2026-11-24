# GOV.UK app prototype components: catalogue

Web components that look and behave like the GOV.UK app’s own, for prototyping app journeys in HTML. Generated from the definitions by `npm run catalogue`: don’t edit it by hand. The same as data: catalogue.json. Docs: https://alphagov.github.io/govuk-mobile-prototype-components/

## How to choose

1. **A template or pattern that fits.** Start from it, and change its words. A pattern is one whole screen; a template is a journey of several. Each says when to use it, and what to use instead when not.
2. **Otherwise, components.** Put a screen together from them, following each one’s rules, and its “Avoid” to tell apart ones that look alike.
3. **Build something custom only when nothing fits.** Match the library’s look: style it with the `--app-*` tokens in foundation/tokens.css, for colour, type and spacing on the 8pt grid. Tell the user it isn’t one of the app’s components.

A component marked **not in the app yet** is proposed, from future designs. Use it if it fits, and tell the user it isn’t in the app today.

## How a page is put together

- Write the components inside one `<govuk-app>`, with one `<govuk-app-screen>` in it for each screen. Put it in a `<govuk-prototype-frame>` (frame/frame.js) to show it on an iPhone.
- Load each component’s script, given on its entry: `<script type="module" src="components/button/button.js"></script>`.
- Components send no events of their own: their buttons, links and fields do, with the `name` and `value` given them. A page listens for clicks by name, and goes where the app would. Add `works` to a button the page acts on.
- Use Material Symbols names for icons, such as `check` or `directions_car`.

## Patterns

### Confirmation (pattern: confirmation)

Asks the user to confirm an action that is hard or impossible to undo, such as signing out or deleting something, before the app does it. It slides up as a modal, with the question, what will happen, and a choice of going ahead or not.

Use when:
- The user has asked to do something destructive or hard to undo, such as signing out, deleting data or removing an account.
- The user needs to know what will happen before they go ahead.
- There are exactly two choices: do it, or go back.

Avoid:
- The action is easy to undo, or loses nothing, such as turning a setting on or off. Instead: Do it straight away, with no confirmation
- The action has already happened, and the screen says so. Instead: Outcome (pattern: outcome)
- The screen explains something, and the user isn't choosing whether to go ahead. Instead: Information page (pattern: information-page)
- The user has more than two choices. Instead: Settings list, with a row for each choice (pattern: settings-list)

Components: `govuk-app-screen`, `govuk-app-nav-bar`, `govuk-app-heading`, `govuk-app-text`, `govuk-app-button-stack`, `govuk-app-button`

Notes:
- Ask the question in the heading, and say in the text what will happen and whether it can be undone.
- Say what the action does on its button, such as Sign out or Delete saved details, not Yes or Confirm.
- Its buttons go nowhere of their own. The page listens for clicks on them, by name, confirm or cancel, and goes where the app would, as examples/settings/sign-out.html does. Add works to each button the page acts on.
- On iOS it slides up as a sheet over the screen it was opened from. Put it in a govuk-app-sheet, with that screen behind it, to show that.

```html
<govuk-app-screen background="modal">
  <govuk-app-nav-bar>
    <govuk-app-nav-bar-item icon="close" name="cancel">Close</govuk-app-nav-bar-item>
  </govuk-app-nav-bar>
  <govuk-app-heading level="1" size="title-1">Are you sure you want to delete your saved details?</govuk-app-heading>
  <govuk-app-text>You’ll need to enter them again the next time you use this service. You cannot undo this.</govuk-app-text>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button variant="destructive" name="confirm">Delete saved details</govuk-app-button>
    <govuk-app-button variant="grouped-secondary" name="cancel">Cancel</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/patterns/confirmation/

### Information page (pattern: information-page)

Explains one thing in a few paragraphs, such as how Face ID works in the app or what data it keeps, under a large title, with a back button and at most one action at the bottom.

Use when:
- The user has opened a row in a list to find out about one thing before they act on it.
- The content is a few short paragraphs, and perhaps a bulleted list.
- There is one action that follows from reading it, such as changing a setting or asking for data, or none.

Avoid:
- The screen asks the user to confirm something destructive. Instead: Confirmation (pattern: confirmation)
- The screen tells the user that something has finished. Instead: Outcome (pattern: outcome)
- The user is choosing between several settings or screens. Instead: Settings list (pattern: settings-list)
- The content is long, or changes often, such as guidance from GOV.UK. Instead: Link to the page on GOV.UK, from a link row in a grouped list

Components: `govuk-app-screen`, `govuk-app-nav-bar`, `govuk-app-text`, `govuk-app-bulleted-list`, `govuk-app-button-stack`, `govuk-app-button`

Notes:
- In a prototype of several pages, use back-href on the navigation bar, set to the page it was opened from, in place of back.
- Leave out the bulleted list, or the button stack, if the page doesn't need them.
- The button goes nowhere of its own. The page listens for a click on it, by name.

```html
<govuk-app-screen>
  <govuk-app-nav-bar title="Your saved details" large-title back></govuk-app-nav-bar>
  <govuk-app-text>The app keeps a few details about you, so you do not have to enter them each time, like:</govuk-app-text>
  <govuk-app-bulleted-list spacing="compact">
    <govuk-app-bulleted-list-item>your name</govuk-app-bulleted-list-item>
    <govuk-app-bulleted-list-item>your postcode</govuk-app-bulleted-list-item>
  </govuk-app-bulleted-list>
  <govuk-app-text>They stay on this phone. We do not share them with other government services.</govuk-app-text>
  <govuk-app-text>You can delete them at any time.</govuk-app-text>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button name="manage">Manage your saved details</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/patterns/information-page/

### Outcome (pattern: outcome)

Tells the user that something has finished, such as signing in or out, with a short centred heading and line of text, and one action to go on.

Use when:
- Something the user did has finished, and they need to know before they go on, such as after signing out or signing in.
- There is one obvious next step.
- The screen ends a journey, or a step in one, and the user can't go back into it.

Avoid:
- The user hasn't done it yet, and is choosing whether to. Instead: Confirmation (pattern: confirmation)
- The screen needs more than a line or two to explain things. Instead: Information page (pattern: information-page)
- The user has more than one thing they could do next. Instead: Settings list, or a screen with a primary and a grouped secondary button in the button stack (pattern: settings-list)

Components: `govuk-app-screen`, `govuk-app-heading`, `govuk-app-text`, `govuk-app-button-stack`, `govuk-app-button`

Notes:
- Say what happened in the heading, in the past tense, and what it means for the user in the text.
- It has no navigation bar: the user goes on with its button, not back.
- Its button goes nowhere of its own. The page listens for a click on it, by name, as examples/settings/signed-out.html does.

```html
<govuk-app-screen background="modal">
  <govuk-app-heading level="1" align="center">Your saved details have been deleted</govuk-app-heading>
  <govuk-app-text align="center">You can add them again at any time in Settings</govuk-app-text>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button name="continue">Continue</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/patterns/outcome/

### Settings list (pattern: settings-list)

A screen of settings and links, in grouped lists, for the user to scan and choose from. Each row opens a screen, opens a web page, shows a value or turns something on or off.

Use when:
- The user needs to see and change several settings or preferences in one place.
- A section of the app needs a menu of the screens and pages under it, such as account, privacy and help.
- Rows fall into a few groups, each with an optional title above and line of explanation below.
- It is the root screen of a tab, such as Settings.

Avoid:
- The screen asks the user to confirm one action, such as signing out or deleting something. Instead: Confirmation (pattern: confirmation)
- The screen explains one thing in paragraphs, with at most one action. Instead: Information page (pattern: information-page)
- The screen tells the user that something has finished. Instead: Outcome (pattern: outcome)
- The user is filling in details, such as a name or registration number. Instead: A screen with the text field and a primary button in the button stack

Components: `govuk-app-screen`, `govuk-app-nav-bar`, `govuk-app-grouped-list`, `govuk-app-tab-bar`

Notes:
- Keep the tab bar only on a tab's root screen. A list pushed from another screen has a back button in its navigation bar instead, and no tab bar.
- Put a destructive row, such as Sign out, in a group of its own, last.
- Give each row that opens a screen an href to that page, in place of its name, in a prototype of several pages.

```html
<govuk-app-screen>
  <govuk-app-nav-bar title="Settings" large-title></govuk-app-nav-bar>

  <govuk-app-grouped-list footer="A line under a group, to explain the rows in it.">
    <govuk-app-grouped-list-row type="information" description="name@example.com">Your account</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row type="link" href="https://www.gov.uk">Manage your account</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>

  <govuk-app-grouped-list>
    <govuk-app-grouped-list-row type="detail" detail="Off" name="notifications">Notifications</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row name="face-id">Face ID</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row type="toggle" name="statistics" checked>Share app usage statistics</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>

  <govuk-app-grouped-list title="Privacy and legal">
    <govuk-app-grouped-list-row type="link" href="https://www.gov.uk">Privacy notice</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row type="link" href="https://www.gov.uk">Terms and conditions</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row name="your-data">Your app data</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>

  <govuk-app-grouped-list>
    <govuk-app-grouped-list-row type="detail" destructive name="sign-out">Sign out</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>

  <govuk-app-tab-bar>
    <govuk-app-tab-bar-item icon="home" name="home">Home</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="chat_bubble" name="chat">Chat</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="settings" name="settings" selected>Settings</govuk-app-tab-bar-item>
  </govuk-app-tab-bar>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/patterns/settings-list/

## Templates

None yet.

## Components

### Address `<govuk-app-address>`

GOV.UK app component. Script: components/address/address.js

Shows a person's name and postal address, such as who a vehicle is registered to, or who holds a driving licence.

Attributes:
- `name` (string): The person's name, in bold above the address, such as Mrs Jane Bloggs. Leave it off for an address alone.

Content: The address's lines, each on a line of its own, or separated by <br>. Blank lines and indents are left out, so they can be written however reads best in the HTML.

Rules:
- Write the name and address as the service holds them: the app shows DVLA's records as they are, which may be in capitals.
- Put each part of the address on a line of its own, ending with the postcode.
- Give it a heading that says whose address it is and why, such as Registered to.
- Don't show an address the user hasn't proved is theirs, such as in a vehicle check for any vehicle.

Avoid:
- For one fact about a place, such as a postcode on its own. Instead: `govuk-app-grouped-list-row type="information"`
- To ask the user for their postcode. Instead: `govuk-app-text-field type="postcode"`
- For a place the user can go to, such as their local council. Instead: `govuk-app-link-card`

Example, A name and address:
```html
<govuk-app-address name="Mrs Jane Bloggs">
  75 St John's Street
  Gateshead
  NE8 2ED
</govuk-app-address>
```

Example, An address alone:
```html
<govuk-app-address>
  Central Bedfordshire Council<br>
  Priory House<br>
  Chicksands<br>
  SG17 5TQ
</govuk-app-address>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/address/

### Banner `<govuk-app-banner>`

GOV.UK app component. Script: components/banner/banner.js

Tells the user something they should know now, on the screen it's about: an alert on Home, such as an emergency, or a warning, such as that driving without tax can invalidate their insurance. It can have a link to find out more, and can be closed.

Attributes:
- `type` (information | local-emergency | national-emergency | notable-death | warning, default information): information: white, or blue in dark mode, with a pale blue border. local-emergency: teal. national-emergency: red. notable-death: black. warning, proposed: yellow, with an icon and smaller type, as the future driving designs' Stay insured.
- `title` (string): Its title, in bold, such as Emergency alerts. The app's banners can be without one.
- `level` (2 | 3 | 4, default 2): The title's place in the screen's outline. Drawn as h2 to h4.
- `dismissible` (boolean, default false): Shows a button to close it, which hides it. The app's national emergencies can't be closed.
- `link` (string): Text for a link below, such as More information.
- `href` (string): Where the link goes.
- `name` (string): Tells the banner apart when it's closed: its close button's value.
- `icon` (string): For a warning, the name of a Material Symbol on its left, such as warning.

Content: What it says, a sentence or two.

Rules:
- Use a banner for something the user should know now, about the screen it's on. Don't use it for something they must act on to carry on: put that in the screen itself.
- Use the emergency types only for the app's emergency alerts, as on Home, and only one at a time.
- Keep what it says to a sentence or two, with a link to find out more.
- Let it be closed unless it's an emergency the user must see, as the app's national emergencies can't be.
- Use warning, which is proposed, for a warning about something on the screen, such as Stay insured on a vehicle with no tax.

Avoid:
- For something the user must do before they can carry on. Instead: Say it in the screen itself, in its heading and text, with a button to do it
- For how something with a deadline stands, such as a vehicle's tax. Instead: `govuk-app-status`
- For one card that needs attention, such as an expired licence. Instead: `govuk-app-card-header`
- To confirm something worked, such as signing out. Instead: A screen of its own, with a centred govuk-app-heading size="large-title"
- For a few points that are read together. Instead: `govuk-app-bulleted-list`

Example, Information:
```html
<govuk-app-banner title="Emergency alerts" dismissible name="emergency-alerts-test" link="More information" href="https://www.gov.uk/alerts">
  Test on Sunday 7 September, 3pm
</govuk-app-banner>
```

Example, National emergency, which can't be closed:
```html
<govuk-app-banner type="national-emergency" title="National emergency" link="More information" href="https://www.gov.uk/alerts">
  This is a level 1 incident
</govuk-app-banner>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/banner/

### Bulleted list `<govuk-app-bulleted-list>`

GOV.UK app component. Script: components/bulleted-list/bulleted-list.js

Lists a few short points, each after a bullet, usually finishing a sentence that comes before it, such as what the app stores about the user or what sharing statistics shares.

Attributes:
- `spacing` (regular | compact, default regular): regular: the text 16pt after the bullet, and the points 8pt apart. compact: 8pt and 4pt, for a short list closely following its sentence, as on Your app data.

Content: Two or more <govuk-app-bulleted-list-item> elements, in order, each holding one point as text, which may include a link.

Part `<govuk-app-bulleted-list-item>`: One point in the list, as text, which may include a link or a few words in bold.

Rules:
- Introduce the list with a sentence ending in a colon, and write each point to finish it: in lower case, with no full stop, as the app does.
- Keep each point short, a line or two.
- Use it for points that are read together, not for steps in order or for things to tap: use a grouped list for those.
- Use one spacing throughout a journey's screens.

Avoid:
- For things the user can tap, such as other screens. Instead: `govuk-app-grouped-list-row type="navigation"`
- For two to four short facts, to take in at a glance. Instead: `govuk-app-summary-columns`
- For a single point. Instead: `govuk-app-text`
- For steps the user takes in order. Instead: `govuk-app-grouped-list`

Example, Regular, as on the screen asking to share statistics:
```html
<govuk-app-text>You can help us improve this app by agreeing to share statistics about:</govuk-app-text>
<govuk-app-bulleted-list>
  <govuk-app-bulleted-list-item>the pages you visit within the app</govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item>how long you spend on each page</govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item>what you tap on while you're on each page</govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item>errors that happen</govuk-app-bulleted-list-item>
</govuk-app-bulleted-list>
```

Example, Compact, as on Your app data:
```html
<govuk-app-text>We store a small amount of data about you to improve your experience in the app, like:</govuk-app-text>
<govuk-app-bulleted-list spacing="compact">
  <govuk-app-bulleted-list-item>your notification settings</govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item>a unique ID for this app (Push ID)</govuk-app-bulleted-list-item>
</govuk-app-bulleted-list>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/bulleted-list/

### Button `<govuk-app-button>`

GOV.UK app component. Script: components/button/button.js

Lets the user take an action, such as continuing a journey, confirming a choice or removing something. It is the app's own button, in five variants: primary, secondary, grouped secondary, compact and destructive, and a sixth, black, for a green screen.

Attributes:
- `variant` (primary | secondary | grouped-secondary | compact | destructive | black, default primary): Which kind of button. black: the main action on a green screen. Anything else draws a primary button.
- `type` (button | submit, default button): submit: pressing it sends the form it's in, with what the user typed or chose, and its own name and value if it has them. button: it does nothing until a page listens for it.
- `disabled` (boolean, default false): Greys the button out, and stops it being pressed or focused.
- `name` (string): Set on the button, so a page listening for clicks can tell one button from another.
- `value` (string): Set on the button, alongside name, to say which of several choices was pressed.

Content: The button's label, as text. Keep it to a few words.

Rules:
- Use a primary button for the main action on a screen, and use at most one.
- Use a grouped secondary button for an alternative to the primary action, directly below it in the same group, as ButtonStackView does.
- Use a secondary button, with its outline, for an alternative action that stands on its own, away from a primary button.
- Use a compact button for a lighter action within the content of a screen, such as on a card, rather than to move the journey on.
- Use a destructive button only for an action that deletes or removes something, such as signing out or removing an account, and usually on a screen that asks the user to confirm it.
- Use a black button in place of a primary button on a green screen, as the app does, and not elsewhere.
- Write the label as a verb that says what will happen: 'Continue', 'Confirm postcode', 'Remove account'. Do not use 'Click here' or 'Submit'.
- Make the button that sends a form's answers a submit button, inside the form, so pressing Return in a field sends them too.
- A button fills the width of what it sits in. Put it in a container to make it narrower.
- Disable a button only while the screen is waiting for something the user has to give first, such as a postcode, and make it clear what that is.

Avoid:
- For an action on the whole screen, such as Close, Done or Edit. Instead: `govuk-app-nav-bar-item`
- For a screen's main action and a way out of it, at the bottom of the screen. Instead: `govuk-app-button-stack`
- For a row that goes to another screen, as on Settings. Instead: `govuk-app-grouped-list-row type="navigation"`
- For a link to a web page. Instead: `govuk-app-grouped-list-row type="link"`
- For an action that adds to a list, such as Add vehicle. Instead: `govuk-app-grouped-list-row type="action"`
- For a few less-used actions on a card, such as Change address. Instead: `govuk-app-menu-button`
- To switch something on or off straight away. Instead: `govuk-app-grouped-list-row type="toggle"`

Example, Primary:
```html
<govuk-app-button name="continue">Continue</govuk-app-button>
```

Example, Primary, disabled until there is something to confirm:
```html
<govuk-app-button disabled>Confirm postcode</govuk-app-button>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/button/

### Button stack `<govuk-app-button-stack>`

GOV.UK app component. Script: components/button-stack/button-stack.js

Holds a screen's main action, and any way out of it, at the bottom of the screen under a divider, where they stay as the content scrolls. Used on screens that ask the user to do something, such as confirm, agree or continue.

Content: One or two <govuk-app-button> elements, top to bottom: the main action, as a primary or destructive button, then any way out of it as a grouped secondary button. Give the stack slot="footer" to pin it to the bottom of a <govuk-app-screen>.

Rules:
- Put it in a <govuk-app-screen> with slot="footer", so it stays at the bottom as the content scrolls.
- Put the main action first, as a primary button, or a destructive one if it deletes or removes something. Put any way out of it second, as a grouped secondary button, such as Cancel or Not now.
- Use no more than two buttons.
- Don't use it on a screen with a tab bar: the app hides the tab bar on screens that ask the user to act.

Avoid:
- For a lighter action within the content, such as on a card. Instead: `govuk-app-button variant="compact"`
- For an action on the whole screen that doesn't move the journey on, such as Edit. Instead: `govuk-app-nav-bar-item`
- On a top-level screen, with a tab bar. Instead: Put the action on a screen of its own, pushed on top, without the tab bar, and put the button stack there
- For more than two choices. Instead: `govuk-app-grouped-list-row type="navigation"`

Example, An action and a way out:
```html
<govuk-app-button-stack>
  <govuk-app-button name="allow">Allow notifications</govuk-app-button>
  <govuk-app-button variant="grouped-secondary" name="not-now">Not now</govuk-app-button>
</govuk-app-button-stack>
```

Example, One button:
```html
<govuk-app-button-stack>
  <govuk-app-button name="continue">Continue</govuk-app-button>
</govuk-app-button-stack>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/button-stack/

### Chat answer `<govuk-app-chat-answer>`

GOV.UK app component. Script: components/chat-answer/chat-answer.js

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
- For the user's own question. Instead: `govuk-app-chat-question`
- While the answer is being generated. Instead: `govuk-app-chat-loading stage="generating"`
- For text on a screen that isn't GOV.UK Chat. Instead: `govuk-app-text`

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

### Chat example questions `<govuk-app-chat-example-questions>`

GOV.UK app component. Script: components/chat-example-questions/chat-example-questions.js

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
- For things to do with the chat, such as clearing it. Instead: `govuk-app-menu-button-item`
- For a question the user has asked. Instead: `govuk-app-chat-question`
- For suggestions outside GOV.UK Chat, such as other screens to go to. Instead: `govuk-app-grouped-list-row type="navigation"`

Example, Three questions:
```html
<govuk-app-chat-example-questions>
  <govuk-app-chat-example-question href="#">How do I renew my passport?</govuk-app-chat-example-question>
  <govuk-app-chat-example-question href="#">What benefits can I get if I’m caring for someone?</govuk-app-chat-example-question>
  <govuk-app-chat-example-question href="#">When is my council tax due?</govuk-app-chat-example-question>
</govuk-app-chat-example-questions>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/chat-example-questions/

### Chat input `<govuk-app-chat-input>`

GOV.UK app component. Script: components/chat-input/chat-input.js

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
- To ask the user a question on a form, such as their postcode. Instead: `govuk-app-text-field`
- To search GOV.UK. Instead: `govuk-app-search-field`
- To search for something on a card of its own, such as a vehicle. Instead: `govuk-app-search-box`

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

### Chat loading `<govuk-app-chat-loading>`

GOV.UK app component. Script: components/chat-loading/chat-loading.js

Shows that GOV.UK Chat is busy: Sending... while the user's question is sent, then Generating your answer…, with the app's animation, until the answer comes.

Attributes:
- `stage` (sending | generating, default generating): sending: Sending..., at the right, while the question is sent. generating: Generating your answer…, after the animation, while the answer is being written.

Rules:
- Use sending in place of the question the user has just asked, and generating below it, as the app shows both while a question is sent.
- Once the question is sent, show it with a chat question, and keep generating below it until the answer comes.
- Replace it with the answer. Never leave it in a conversation that has its answer.

Avoid:
- Once the answer has come. Instead: `govuk-app-chat-answer`
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

### Chat question `<govuk-app-chat-question>`

GOV.UK app component. Script: components/chat-question/chat-question.js

Shows a question the user asked GOV.UK Chat, in a dark blue bubble at the right of the conversation.

Content: The question, as text, as the user typed it.

Rules:
- Use it in a screen of GOV.UK Chat, after the answer before it, or after the welcome message for the first question.
- Follow it with the answer, or with a chat loading while the answer is being generated.
- Write the question as a user would type it: in their words, not GOV.UK's.

Avoid:
- For GOV.UK Chat's answer, or its welcome message. Instead: `govuk-app-chat-answer`
- For a question the user hasn't asked yet, suggested to them. Instead: `govuk-app-chat-example-questions`

Example, A short question:
```html
<govuk-app-chat-question>How do I renew my passport?</govuk-app-chat-question>
```

Example, A longer question:
```html
<govuk-app-chat-question>I’m moving to Spain next year. Do I need to exchange my driving licence, and how long do I have to do it?</govuk-app-chat-question>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/chat-question/

### Crown `<govuk-app-crown>`

GOV.UK app component. Script: components/crown/crown.js

Ends the home screen: the crown, which grows and fades in as the user scrolls to the end, so they can tell there is nothing more below it.

Content: None.

Rules:
- Use it only on the home screen, as the app does.
- Put it last in the <govuk-app-screen>, after the last widget and before the tab bar. It grows over the last 70pt of the screen's scroll, so anything after it would leave it part grown.
- It is decorative, so assistive technology skips it. Don't give it a label.

Avoid:
- On any screen but Home. Instead: Leave it out: other screens end with their last section
- For the GOV.UK wordmark at the top of Home. Instead: `govuk-app-home-header`

Example, At the end of the home screen:
```html
<govuk-app-screen>
  <govuk-app-text align="center">Tell us what you think about the app</govuk-app-text>
  <govuk-app-button variant="grouped-secondary">Give feedback</govuk-app-button>
  <govuk-app-crown></govuk-app-crown>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/crown/

### Grouped list `<govuk-app-grouped-list>`

GOV.UK app component. Script: components/grouped-list/grouped-list.js

A section of rows on a rounded card, as on the Settings screen: rows that go to another screen, open a web page, switch something on or off, or show a value. Each section can have a title above it and a footer below.

Attributes:
- `title` (string): The section's title, above the card. Without it, the card stands alone, as on Settings.
- `level` (1 | 2 | 3 | 4 | 5 | 6, default 2): The title's place in the screen's outline. Drawn as h1 to h6, always in Title 3.
- `action` (string): Text for an action beside the title, such as See all.
- `href` (string): Makes the title's action a link to this page.
- `name` (string): The title's action's button's name.
- `value` (string): The title's action's button's value.
- `footer` (string): A note below the card, in Footnote, such as what a setting does.
- `dividers` (full): Proposed, from the future driving designs: full draws the dividers between rows right across the card, in a paler blue, for a card whose rows are parts of one thing, such as a vehicle, rather than a list. Without it, they're GovKit's, 16pt in from each side.
- `background` (subtle | accent): Draws the card in another colour, as GovKit lets the app: subtle, pale blue, for a card on a white screen; accent, a stronger blue, proposed by the future driving designs for Add vehicle. Without it, the card is white, or dark blue in dark mode.

Content: The section's rows, <govuk-app-grouped-list-row> elements, in order. Each takes a type: navigation (the default: a chevron, to another screen), link (in the link colour, with an arrow out, to a web page), information (a value on the right, in grey, that can't be pressed), detail (a value on the right in the link colour, such as Off, to change it; destructive draws its title red), toggle (a switch, drawn by <govuk-app-toggle>; checked if it is on), count (a number on the right, with unread for a red dot) selectable (an icon on the right, if it names one, such as check) or topic (a navigation row with its icon on the left, in a circle, and its title in bold; icon names the symbol, such as currency_pound, or it draws a star). detail gives the value on the right; description, for information and link rows, a line of grey text below the title. Give href to make a row a link, or name and value to tell it apart as a button or switch. Its title is what is written between its tags. A link row with no-arrow has no arrow, as GovKit can draw one for a link that stays in the app. An action row is a single action, as the app's Add vehicle: its title, with an outlined plus on the right in the icon colour, or the icon it names. Anything given slot="control", such as a segmented control, goes at the top of the card, above the rows, as the app's Topics widget has Your topics and All topics. An information or link row given an image, the URL of a picture, draws it on the left at its own size, as the app draws One Login's account icon on Settings (images/one-login.svg, in this component's folder). Proposed, from the future driving designs: content (anything written between its tags, such as a heading and text, 16pt in from the card's edges; with flush, none, for content with its own padding, such as summary columns).

Part `<govuk-app-grouped-list-row>`: One row of the list. Its title is what's written between its tags; its type decides what it draws on the right, and whether it can be pressed.

Attributes:
- `type` (navigation | link | information | detail | toggle | count | selectable | topic | action | content, default navigation): navigation: a chevron, to another screen. link: in the link colour, with an arrow out, to a web page. information: a value on the right, in grey, that can't be pressed. detail: a value on the right in the link colour, such as Off, to change it. toggle: a switch. count: a number on the right. selectable: an icon on the right, if it names one. topic: a navigation row with its icon on the left, in a circle, and its title in bold. action: a single action, with an outlined plus on the right, or the icon it names. content (proposed): anything written between its tags.
- `detail` (string): The value on the right of an information, detail or count row, such as Off or 2.
- `description` (string): A line of grey text below the title of an information or link row.
- `icon` (string): A Material Symbol: on the right of a selectable or action row, such as check, or a topic's on its left, such as currency_pound.
- `image` (string): The address of a picture on the left of an information or link row, at its own size.
- `href` (string): Makes the row a link to this page.
- `name` (string): The name of the row's button or switch, so a page can tell which was pressed or switched.
- `value` (string): Its button's or switch's value, alongside name.
- `checked` (boolean, default false): A toggle row's switch is on.
- `unread` (boolean, default false): A count row has a red dot, for something unread.
- `destructive` (boolean, default false): A detail row's title is red, for something that removes or deletes.
- `no-arrow` (boolean, default false): A link row has no arrow, for a link that stays in the app.
- `flush` (boolean, default false): A content row has no padding, for content with its own, such as summary columns.

Rules:
- Group rows that belong together in one section, and give each section a title unless the screen makes it obvious, as Settings does.
- Use navigation for a row that goes to another screen in the app, and link only for one that opens a web page.
- Use toggle for a setting that takes effect straight away. Use detail for one that is changed on another screen, showing its value, such as Off.
- Use information for a value the user can't change, such as the app's version.
- Keep row titles to one line where you can, and put any explanation in the section's footer, not the row.
- Use destructive only for a detail row that deletes or removes something, such as Sign out.
- Use topic only for a list of the app's topics, as on Home, with the topic's own icon.
- Use a content row for what a row type can't draw, such as a vehicle's name and its tax and MOT, and put anything more about it, such as Details, in a navigation row below. It's proposed, so isn't in the app yet.
- Use the subtle background for cards on a white screen, so they stand apart from it. The accent background is proposed, for a card that's a single action, such as Add vehicle.
- Use an action row on a card of its own, for an action that adds to the list above it, as Add vehicle does.

Avoid:
- For a few points that are read together, and can't be tapped. Instead: `govuk-app-bulleted-list`
- For one destination that should stand out, such as the user's council. Instead: `govuk-app-link-card`
- For the action that moves the journey on. Instead: `govuk-app-button variant="primary"`
- To switch between views of the same thing, such as Vehicles and Licence. Instead: `govuk-app-segmented-control`
- For two to four short facts of the same kind, side by side. Instead: `govuk-app-summary-columns`

Example, Every kind of row:
```html
<govuk-app-grouped-list title="Section 1 header" footer="Footer">
  <govuk-app-grouped-list-row name="row-1">Row title 1</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="link" href="https://www.gov.uk">Row title 2</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="information" detail="Detail" description="Body text">Row title 3</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="toggle" name="row-4" checked>Row title 4</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="detail" detail="Body text" name="row-5">Row title 5</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="count" detail="1" unread name="row-6">Row title 6</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="selectable" icon="check" name="row-7">Row title 7</govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

Example, An action row, as Add vehicle:
```html
<govuk-app-grouped-list>
  <govuk-app-grouped-list-row type="action" name="add-vehicle">Add vehicle</govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/grouped-list/

### Home header `<govuk-app-home-header>`

GOV.UK app component. Script: components/home-header/home-header.js

Tops the home screen: the GOV.UK wordmark on blue, and the search field the user starts a search of GOV.UK from. It takes the place of the navigation bar, which the home screen hides.

Content: Optionally, a <govuk-app-search-field>, drawn below the wordmark, as on the app's home screen. Without one, the header is the wordmark alone, as when the app's search is turned off.

Rules:
- Use it only on the home screen, in place of a navigation bar. Other screens have a navigation bar.
- Put it first in a <govuk-app-screen>. It sticks to the top of the screen, and the content scrolls under it.
- Give it a search field, as the app does, unless the prototype is of the app without search.
- The wordmark is the screen's heading, so don't give the home screen another level 1 heading.

Avoid:
- On any screen but Home. Instead: `govuk-app-nav-bar`
- To search on a screen other than Home. Instead: `govuk-app-search-field`

Example, With search:
```html
<govuk-app-screen>
  <govuk-app-home-header>
    <govuk-app-search-field></govuk-app-search-field>
  </govuk-app-home-header>
  <govuk-app-section-heading action="Edit">Topics</govuk-app-section-heading>
  <p>Driving and transport. Money and tax. Benefits. Care. Health and disability. Parenting and guardianship. Employment.</p>
  <govuk-app-tab-bar>
    <govuk-app-tab-bar-item icon="home" name="home" selected>Home</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="settings" name="settings">Settings</govuk-app-tab-bar-item>
  </govuk-app-tab-bar>
</govuk-app-screen>
```

Example, Without search:
```html
<govuk-app-screen>
  <govuk-app-home-header></govuk-app-home-header>
  <govuk-app-section-heading action="Edit">Topics</govuk-app-section-heading>
  <p>Driving and transport. Money and tax. Benefits. Care. Health and disability. Parenting and guardianship. Employment.</p>
  <govuk-app-tab-bar>
    <govuk-app-tab-bar-item icon="home" name="home" selected>Home</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="settings" name="settings">Settings</govuk-app-tab-bar-item>
  </govuk-app-tab-bar>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/home-header/

### Labelled icon `<govuk-app-labelled-icon>`

GOV.UK app component. Script: components/labelled-icon/labelled-icon.js

Shows a short fact with an icon that says what kind of fact it is, such as a vehicle's year with a calendar, its fuel with a pump, or its colour with a palette.

Attributes:
- `icon` (string, required): The name of a Material Symbol, such as calendar_month, local_gas_station or palette.
- `layout` (stacked | inline, default stacked): stacked: the icon over its label, both centred, as the app shows them side by side. inline: the icon before its label, as the app shows them when they don't fit side by side.
- `label` (string): What screen readers hear in place of the label alone, when the label doesn't say what it's about, such as Year of manufacture: 2021.

Content: The fact, a word or two, such as 2021, Petrol or Yellow.

Rules:
- Keep the label to a word or two: stacked, it stays on one line.
- Pick an icon that says what kind of fact it is, not what it is: a calendar for a year, whatever the year.
- Give it a label for screen readers when the fact alone doesn't say what it's about, as 2021 doesn't.
- Put a few side by side in summary columns, as the app does a vehicle's year, fuel and colour.

Avoid:
- For something with a deadline or a validity, such as a vehicle's tax. Instead: `govuk-app-status`
- For a number that matters on its own, such as penalty points. Instead: `govuk-app-count`
- For a fact that needs more than a word or two. Instead: `govuk-app-grouped-list-row type="information"`
- For a vehicle's registration. Instead: `govuk-app-number-plate size="small"`

Example, Stacked:
```html
<govuk-app-labelled-icon icon="calendar_month" label="Year of manufacture: 2021">2021</govuk-app-labelled-icon>
```

Example, Inline:
```html
<govuk-app-labelled-icon icon="local_gas_station" layout="inline" label="Fuel: Petrol">Petrol</govuk-app-labelled-icon>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/labelled-icon/

### Link `<govuk-app-link>`

GOV.UK app component. Script: components/link/link.js

Makes a few words of a line a link, such as a GOV.UK page named in one of GOV.UK Chat's answers.

Attributes:
- `href` (string, required): Where it goes, such as a GOV.UK page.

Content: The words that are the link. Put it inside a <govuk-app-text> or a <govuk-app-bulleted-list-item>, around the words, and it takes that text's size.

Rules:
- Make the link's words say where it goes, such as the page's title, not click here.
- Use it inside a line of text. For a link on a row of its own, use a grouped list's link row, or a link card for one that should stand out.

Avoid:
- For a link on a row of its own. Instead: `govuk-app-grouped-list-row type="link"`
- For one destination that should stand out, such as the user's council. Instead: `govuk-app-link-card`
- For an action, such as continuing a journey. Instead: `govuk-app-button`

Example, In a sentence:
```html
<govuk-app-text>You can <govuk-app-link href="https://www.gov.uk/apply-renew-passport">apply for or renew your passport online</govuk-app-link>.</govuk-app-text>
```

Example, In a list:
```html
<govuk-app-bulleted-list spacing="compact">
  <govuk-app-bulleted-list-item>you need a <govuk-app-link href="https://www.gov.uk/photos-for-passports">digital photo</govuk-app-link></govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item><govuk-app-link href="https://www.gov.uk/apply-renew-passport">start your online application</govuk-app-link></govuk-app-bulleted-list-item>
</govuk-app-bulleted-list>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/link/

### Link card `<govuk-app-link-card>`

GOV.UK app component. Script: components/link-card/link-card.js

Makes one destination stand out, on a card of its own that's a link, with its name large and bold, such as the user's council on Home. A description above the name can say what it's for.

Attributes:
- `href` (string, required): Where the card goes, such as the council's website.
- `description` (string): Shown above the name, in grey, saying what it's for, such as County councils are usually responsible for services like education, social care and transport.

Content: The name of where it goes, as text, such as Central Bedfordshire Council.

Rules:
- Use it for one destination worth making stand out, such as the user's own council. For a list of links, use a grouped list.
- Put it under a section heading saying what it is, such as Your local services.
- Keep the name to what the user will recognise, such as the council's own name.
- Give each card a description when there are two or more, saying how they differ, as the app does for a county council and a district council.

Avoid:
- For a list of links. Instead: `govuk-app-grouped-list-row type="link"`
- For a link within a line of text. Instead: `govuk-app-link`
- For a screen in the app, among others. Instead: `govuk-app-grouped-list-row type="navigation"`

Example, A council:
```html
<govuk-app-link-card href="https://www.centralbedfordshire.gov.uk">Central Bedfordshire Council</govuk-app-link-card>
```

Example, With a description:
```html
<govuk-app-link-card href="https://www.derbyshire.gov.uk" description="County councils are usually responsible for services like education, social care and transport">Derbyshire County Council</govuk-app-link-card>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/link-card/

### Menu button `<govuk-app-menu-button>`

GOV.UK app component. Script: components/menu-button/menu-button.js

Offers a few more things the user can do with something on a card, such as a vehicle or a driving licence, without crowding the card: a round “…” button that opens a menu of them.

Attributes:
- `label` (string, default More options): The button's name for screen readers, as the app's moreOptionsButtonAccessibilityLabel.
- `name` (string): The button's name, to tell it apart when it's pressed.
- `variant` (card | chat, default card): card: a filled circle with its dots cut out, in link blue, as on a vehicle's or a licence's card. chat: three blue dots on a white circle, as beside GOV.UK Chat's field. The chat input draws its own.

Content: Its menu's items, <govuk-app-menu-button-item> elements, top to bottom. Each is a link, with an href, or a button, with a name and value. Its label is what's written between its tags. Give it destructive to draw it in red, for one that deletes something, such as Clear chat, and icon to draw a Material Symbol at its end, such as delete.

Part `<govuk-app-menu-button-item>`: One item in the menu, holding its label: a link, with an href, or a button, with a name and value.

Attributes:
- `href` (string): Makes it a link to this page.
- `name` (string): Without an href, makes it a button with this name, so a page listening for clicks can tell which was pressed.
- `value` (string): Set on the button, alongside name, to say which of several it was.
- `destructive` (boolean, default false): Draws it in red, for one that deletes something, such as Clear chat.
- `icon` (string): A Material Symbol drawn at its end, such as delete.

Rules:
- Use it for a few things the user can do with what's on its card, that don't need to be on show. Anything they'll want often belongs on the card itself.
- Put it at the top right of its card, as the app does.
- Keep its menu short, a handful of items at most, each saying what it does, such as Change address.
- Label it for screen readers if More options doesn't say enough.

Avoid:
- For an action the user will want often, on a card. Instead: `govuk-app-button variant="compact"`
- For an action on the whole screen, not one card. Instead: `govuk-app-nav-bar-item`
- To switch between views of the same thing. Instead: `govuk-app-segmented-control`

Example, A vehicle's menu:
```html
<govuk-app-menu-button name="vehicle-menu">
  <govuk-app-menu-button-item href="https://www.gov.uk/vehicle-tax">Tax this vehicle</govuk-app-menu-button-item>
  <govuk-app-menu-button-item href="https://www.gov.uk/getting-an-mot">Book an MOT</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="remove-vehicle">Remove vehicle</govuk-app-menu-button-item>
</govuk-app-menu-button>
```

Example, GOV.UK Chat's menu:
```html
<govuk-app-menu-button variant="chat" name="chat-menu">
  <govuk-app-menu-button-item name="clear-chat" destructive icon="delete">Clear chat</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="privacy">Privacy notice</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="about">About</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="feedback">Give feedback</govuk-app-menu-button-item>
</govuk-app-menu-button>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/menu-button/

### Number plate `<govuk-app-number-plate>`

GOV.UK app component. Script: components/number-plate/number-plate.js

Shows a vehicle's registration number as it looks on the vehicle: on a yellow number plate, in the DVLA's own typeface. Small on a vehicle's card, large on its detail screen. A white front plate, blank, stands for any vehicle, such as on a search for one.

Attributes:
- `size` (small | large, default small): small, as on a vehicle's card, growing with the text size; large, as on a vehicle's detail screen.
- `variant` (rear | front, default rear): rear: yellow, as the app shows a vehicle's registration. front: white, with a thicker stroke, as the app draws the blank ABC plate on its vehicle search.

Content: The registration number, as it's written on the plate, such as AB71 CDE.

Rules:
- Use it only for a vehicle's registration number.
- Write the registration as it's shown on the plate, in capitals, with its space, such as AB71 CDE.
- Use small beside a vehicle's name, such as on its card, and large on its own on the vehicle's detail screen.
- Use the rear plate for a vehicle's registration. Use the front plate for a blank one, ABC, that stands for any vehicle, such as on a search for one.

Avoid:
- For any other number or reference, such as a driving licence number. Instead: `govuk-app-grouped-list-row type="information"`
- For the user to type in a registration. Instead: `govuk-app-search-box`
- For a vehicle's other facts, such as its year or fuel. Instead: `govuk-app-labelled-icon`

Example, Small:
```html
<govuk-app-number-plate>AB71 CDE</govuk-app-number-plate>
```

Example, Front, blank, as on a vehicle search:
```html
<govuk-app-number-plate variant="front">ABC</govuk-app-number-plate>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/number-plate/

### Section `<govuk-app-section>`

GOV.UK app component. Script: components/section/section.js

Groups part of a screen under a title, with a line saying what it's for if it needs one, and spaces it from what's above, so a long screen reads as a few clear parts: such as Check vehicle details, Status or Registered to.

Attributes:
- `title` (string, required): Its title, such as Check vehicle details.
- `description` (string): A line under the title saying what it's for, such as Tax and MOT information for any vehicle.
- `level` (2 | 3 | 4, default 2): The title's place in the screen's outline. Drawn as h2 to h4.

Content: What the section holds, such as a grouped list or an address, top to bottom, 16pt apart. Something with slot="accessory", such as a <govuk-app-number-plate>, goes on the right of its title.

Rules:
- Use sections to break a long screen into a few parts, each with a title that says what's in it.
- Give it a description only when the title alone doesn't say what the section is for.
- Put sections one after another in a screen: each is spaced from what's above it, as the app spaces its sections. The first on a screen isn't.
- For a list with a title and nothing else, a grouped list's own title is enough.

Avoid:
- For a list of rows that needs only a title. Instead: `govuk-app-grouped-list title="Privacy and legal"`
- For a section the user can act on as a whole, such as a widget with Edit. Instead: `govuk-app-section-heading`
- For the screen's own title. Instead: `govuk-app-heading level="1"`
- To put a few components side by side. Instead: `govuk-app-stack direction="horizontal"`

Example, With a description:
```html
<govuk-app-section title="Check vehicle details" description="Tax and MOT information for any vehicle">
  <govuk-app-grouped-list>
    <govuk-app-grouped-list-row name="check-vehicle">Search for a vehicle</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>
</govuk-app-section>
```

Example, Something beside its title:
```html
<govuk-app-section title="Overview">
  <govuk-app-number-plate slot="accessory">LH09 PZ2</govuk-app-number-plate>
  <govuk-app-grouped-list background="subtle">
    <govuk-app-grouped-list-row name="tech-specs">Tech specs</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>
</govuk-app-section>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/section/

### Section heading `<govuk-app-section-heading>`

GOV.UK app component. Script: components/section-heading/section-heading.js

Heads a section of a screen, such as a widget on the home screen, with an action for the whole section beside it if it has one, such as Edit or See all.

Attributes:
- `level` (1 | 2 | 3 | 4 | 5 | 6, default 2): Its place in the screen's outline. Drawn as h1 to h6, always in Title 3.
- `action` (string): The action's text, such as Edit or See all. Without it, there is no action.
- `href` (string): Makes the action a link to this page.
- `name` (string): The action's button's name, to tell which was pressed.
- `value` (string): The action's button's value.

Content: The section's title.

Rules:
- Use it over a section the user can act on as a whole, such as a home screen widget. For any other heading, use the heading.
- Give the action a short verb or phrase for what it does to the section: Edit, or See all. Never more than one action.
- Keep the title short, so it and the action fit on one line.

Avoid:
- For a heading with no action. Instead: `govuk-app-heading`
- For a screen's title. Instead: `govuk-app-heading level="1"`
- For a part of a long screen, with a line saying what it's for. Instead: `govuk-app-section`
- For several actions on a section. Instead: `govuk-app-menu-button`

Example, With an action:
```html
<govuk-app-section-heading action="Edit" name="edit-topics">Topics</govuk-app-section-heading>
```

Example, Without one:
```html
<govuk-app-section-heading>Your local services</govuk-app-section-heading>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/section-heading/

### Summary columns `<govuk-app-summary-columns>`

GOV.UK app component. Script: components/summary-columns/summary-columns.js

Lays out a few short facts side by side, in equal columns with a divider between them, so they can be taken in at a glance: a vehicle's year, fuel and colour, a driver's offences and points, or a vehicle's tax and MOT.

Content: Two to four <govuk-app-summary-column> elements, left to right, each holding one component, such as a <govuk-app-labelled-icon>, a <govuk-app-count> or a <govuk-app-status>.

Part `<govuk-app-summary-column>`: One column, holding one component, such as a labelled icon, a count or a status.

Rules:
- Use it for two to four facts of the same kind, worth taking in at a glance. For more, or for longer ones, use a grouped list.
- Put the same kind of component in every column: all labelled icons, all counts, or all statuses.
- Keep what's in each column short, so it fits in a narrow column.
- Put it inside a card, such as a grouped list's content row with flush, with anything more about the facts, such as History, in a row below it.

Avoid:
- For more than four facts, or longer ones. Instead: `govuk-app-grouped-list`
- For facts of different kinds. Instead: `govuk-app-grouped-list-row type="information"`
- To put a few components side by side that aren't facts, such as a number plate and a menu button. Instead: `govuk-app-stack direction="horizontal"`

Example, Labelled icons, as a vehicle's year, fuel and colour:
```html
<govuk-app-summary-columns>
  <govuk-app-summary-column>
    <govuk-app-labelled-icon icon="calendar_month" label="Year of manufacture: 2021">2021</govuk-app-labelled-icon>
  </govuk-app-summary-column>
  <govuk-app-summary-column>
    <govuk-app-labelled-icon icon="local_gas_station" label="Fuel: Petrol">Petrol</govuk-app-labelled-icon>
  </govuk-app-summary-column>
  <govuk-app-summary-column>
    <govuk-app-labelled-icon icon="palette" label="Colour: Yellow">Yellow</govuk-app-labelled-icon>
  </govuk-app-summary-column>
</govuk-app-summary-columns>
```

Example, Counts (proposed), as a driver's offences and points:
```html
<govuk-app-summary-columns>
  <govuk-app-summary-column>
    <govuk-app-count value="2">Offences</govuk-app-count>
  </govuk-app-summary-column>
  <govuk-app-summary-column>
    <govuk-app-count value="12">Points</govuk-app-count>
  </govuk-app-summary-column>
</govuk-app-summary-columns>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/summary-columns/

### Text field `<govuk-app-text-field>`

GOV.UK app component. Script: components/text-field/text-field.js

Asks the user to type a short answer, such as their postcode, under a heading asking the question, with a hint of what to type and, if what they typed won't do, an error saying what to do.

Attributes:
- `label` (string, required): The field's name for screen readers, such as Postcode. It isn't shown: the heading above asks the question.
- `hint` (string): Shown above the field, in grey, saying what to type, such as For example SW1A 2AA.
- `error` (string): Shown above the field, in red, when what the user typed won't do, saying what to do, such as Enter your postcode.
- `type` (text | email | tel | url | password | postcode, default text): What's typed, so the phone shows the keyboard for it. postcode types in capitals, with the browser offering the user's own.
- `name` (string): The name what the user typed is sent as, in a form.
- `value` (string): Text already in the field.
- `placeholder` (string): What the field shows until the user types. The app's postcode field has none: put what to type in the hint, which stays.
- `autocomplete` (string): What the browser may fill in for the user, such as email or postal-code.

Rules:
- Put it under a heading asking the question, such as What is your postcode?, and give it a label for screen readers with the answer's name, such as Postcode.
- Ask for one thing on a screen, with a primary button below to carry on.
- Put an example in the hint, not the placeholder, so it's still there once the user starts typing.
- Say what to do in the error, not what went wrong: Enter your postcode, not Postcode is empty.
- Put it in a form, so pressing Return on the keyboard sends it.

Avoid:
- To search. Instead: `govuk-app-search-field`
- To ask GOV.UK Chat. Instead: `govuk-app-chat-input`
- For something that's on or off. Instead: `govuk-app-toggle`
- For a choice from a short list. Instead: `govuk-app-grouped-list-row type="selectable"`

Example, A postcode:
```html
<govuk-app-heading level="1" size="title-1">What is your postcode?</govuk-app-heading>
<govuk-app-text-field type="postcode" name="postcode" label="Postcode" hint="For example SW1A 2AA"></govuk-app-text-field>
```

Example, With an error:
```html
<govuk-app-heading level="1" size="title-1">What is your postcode?</govuk-app-heading>
<govuk-app-text-field type="postcode" name="postcode" label="Postcode" hint="For example SW1A 2AA" error="Enter your postcode"></govuk-app-text-field>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/text-field/

### Full-screen cover `<govuk-app-full-screen-cover>`

native component. Script: components/full-screen-cover/full-screen-cover.js

Presents a screen over the one the user was on, covering it entirely, for a journey that takes over the app until it's finished or closed, such as adding a driver and vehicles account. Unlike a sheet, nothing of the screen behind shows.

Attributes:
- `present` (boolean, default false): Brings the cover up from the bottom when the page loads, as UIKit presents it. Give it to the first screen of the journey, and not to the screens after it, which are already in the cover.
- `label` (string): The cover's name for screen readers. Leave it off if its screen has a heading or a navigation bar title.

Content: The cover's screen, a <govuk-app-screen>. Optionally, the screen it was presented from, with slot="behind", which is seen only while the cover comes up over it, and can't be used.

Rules:
- Put a full-screen cover directly in a <govuk-app>, in place of a screen. Give the root a size, as for a screen.
- Use a sheet for most modals, as the app does. Use a full-screen cover only where the app does: for a journey that takes over the app, such as adding a driver and vehicles account.
- Give its screen a way out: a close action on the left of its navigation bar, with slot="leading". It can't be pulled down to close.
- Give present only to the first screen of the journey. Later screens of the same journey are already in the cover.
- To draw the app's green screens, give its screen background="green", its text size="title-1", and its button variant="black".

Avoid:
- For a task the user finishes or cancels before going back, such as signing out or choosing a country. Instead: `govuk-app-sheet`
- For the next screen of a journey, pushed on top of the last. Instead: A govuk-app-screen of its own, with a back button in its navigation bar
- For a few things to do with something on a card. Instead: `govuk-app-menu-button`

Example, Adding a driver and vehicles account:
```html
<govuk-app-full-screen-cover>
  <govuk-app-screen background="green">
    <govuk-app-nav-bar>
      <govuk-app-nav-bar-item icon="close" name="close" slot="leading">Close</govuk-app-nav-bar-item>
    </govuk-app-nav-bar>
    <govuk-app-heading level="1" size="large-title">Add your driver and vehicles account</govuk-app-heading>
    <govuk-app-text size="title-1">Keep track of your licence details, tax and MOT dates.</govuk-app-text>
    <govuk-app-text size="title-1">We’ll take you to your web browser to sign in.</govuk-app-text>
    <govuk-app-button-stack slot="footer">
      <govuk-app-button variant="black" name="continue">Continue</govuk-app-button>
    </govuk-app-button-stack>
  </govuk-app-screen>
</govuk-app-full-screen-cover>
```

Example, Coming up over the screen it was presented from:
```html
<govuk-app-full-screen-cover present>
  <govuk-app-screen slot="behind">
    <govuk-app-nav-bar title="Driving" large-title back></govuk-app-nav-bar>
    <govuk-app-text>Add your driver and vehicles account to see your licence details, tax and MOT dates.</govuk-app-text>
  </govuk-app-screen>
  <govuk-app-screen background="modal">
    <govuk-app-nav-bar title="A full-screen cover">
      <govuk-app-nav-bar-item icon="close" name="close" slot="leading">Close</govuk-app-nav-bar-item>
    </govuk-app-nav-bar>
    <govuk-app-text>Nothing of the screen behind shows once it's up.</govuk-app-text>
  </govuk-app-screen>
</govuk-app-full-screen-cover>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/full-screen-cover/

### Heading `<govuk-app-heading>`

native component. Script: components/heading/heading.js

Titles a screen, or a section of one. Its level says where it sits in the screen's outline, for screen readers; its size, which of the app's text styles it is drawn in.

Attributes:
- `level` (1 | 2 | 3 | 4 | 5 | 6, default 2): Its place in the screen's outline: 1 is the screen's title, 2 a section of it, 3 a part of a section. Drawn as h1 to h6.
- `size` (large-title | title-1 | title-2 | title-3 | body): The text style it is drawn in. Without one, level 1 is Large Title, level 2 is Title 3, and anything smaller is Body, emphasised.
- `align` (start | center, default start): center, as the app's onboarding and information screens set their titles.

Content: The heading's text.

Rules:
- Give every screen one level 1 heading, unless its navigation bar has a title, which is the screen's heading instead.
- Don't skip levels: a level 3 heading goes inside a section with a level 2 one.
- Pick the level for the outline and the size for the look. A screen's question, such as What is your postcode?, is level 1 in Title 1; an outcome, such as a confirmation, is level 1 in Large Title.
- Centre a heading only on screens the app centres: onboarding, information and confirmation screens. Centre the text under it too.
- Write headings in sentence case, without a full stop. A question ends with a question mark.

Avoid:
- Over a section the user can act on as a whole, such as a widget with Edit. Instead: `govuk-app-section-heading`
- For a part of a long screen, with its title and the space above it. Instead: `govuk-app-section`
- For a title over a list of rows. Instead: `govuk-app-grouped-list title="Privacy and legal"`
- For a screen's title, when it has a navigation bar. Instead: `govuk-app-nav-bar title="Settings"`
- For a line that should stand out, but doesn't head anything. Instead: `govuk-app-text emphasis`
- For a few words that say what the rest of a line is. Instead: `govuk-app-strong`

Example, Each size:
```html
<govuk-app-heading level="1" size="large-title">Large Title</govuk-app-heading>
<govuk-app-heading level="1" size="title-1">Title 1</govuk-app-heading>
<govuk-app-heading level="2" size="title-2">Title 2</govuk-app-heading>
<govuk-app-heading level="2" size="title-3">Title 3</govuk-app-heading>
<govuk-app-heading level="3" size="body">Body</govuk-app-heading>
```

Example, Centred, on an onboarding screen:
```html
<govuk-app-heading level="1" align="center">Allow notifications?</govuk-app-heading>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/heading/

### Navigation bar `<govuk-app-nav-bar>`

native component. Script: components/nav-bar/nav-bar.js

Says which screen the user is on, takes them back to the screen they came from, and holds the screen's actions, such as close, done or edit. It sits at the top of every screen that isn't a top-level one, and of some that are.

Attributes:
- `title` (string): The screen's title, drawn in the bar as the screen's heading. Leave it off where the content starts with its own heading.
- `large-title` (boolean, default false): Draws the title large, below the bar. It scrolls with the content, and the title appears in the bar once it has gone under it.
- `back` (boolean, default false): Shows a back button, named back, for the page to listen for.
- `back-href` (string): Shows a back button that is a link to this page. Use it in place of back in a prototype of several pages.

Content: Up to three <govuk-app-nav-bar-item> elements, the screen's actions, drawn on the right in order. One with slot="leading" is drawn on the left instead, where the back button would be, as the app draws close on a full-screen cover. Each takes an icon attribute, the name of a Material Symbol (such as close, check or more_horiz), or none, to draw its text instead; an href, to make it a link to another page, or name and value, to tell it apart as a button. What is written between its tags is its text, or, with an icon, its name for screen readers.

Part `<govuk-app-nav-bar-item>`: One of the screen's actions in the bar: its text, or with an icon, its name for screen readers.

Attributes:
- `icon` (string): A Material Symbol to draw, such as close, check or more_horiz, in place of its text.
- `href` (string): Makes it a link to this page.
- `name` (string): Without an href, makes it a button with this name, so a page listening for clicks can tell which was pressed.
- `value` (string): Set on the button, alongside name, to say which of several it was.

Rules:
- Put it first in the screen, before the content. It sticks to the top of the screen and the content scrolls under it.
- Give a screen a title unless its content starts with its own heading, as the app's forms do, such as What is your address?
- Use a large title where the app does, such as Settings and Pages you've visited. Use the inline title on other screens, and on forms and modals.
- Show a back button on every screen pushed on top of another, and never on a top-level screen or the first screen of a modal.
- Close a modal with an action on the right, icon close, named for what it does. Confirm one with icon check.
- Use icons for the actions iOS draws as icons (close, check, more_horiz for a menu). Use a word, such as Edit, for anything else.
- Put close on the left, with slot="leading", only on a full-screen cover, as the app does: a sheet has it on the right.
- Keep titles short enough to fit on one line. A long title is cut off.

Avoid:
- On Home. Instead: `govuk-app-home-header`
- For the action that moves the journey on, such as Continue. Instead: `govuk-app-button-stack`
- To move between the app's sections, Home, Chat and Settings. Instead: `govuk-app-tab-bar`
- For a heading within the content, such as a form's question. Instead: `govuk-app-heading level="1" size="title-1"`

Example, Back and an inline title:
```html
<govuk-app-nav-bar title="Notifications" back></govuk-app-nav-bar>
```

Example, Large title:
```html
<govuk-app-nav-bar title="Settings" large-title></govuk-app-nav-bar>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/nav-bar/

### Screen `<govuk-app-screen>`

native component. Script: components/screen/screen.js

Lays out one screen of the app: the navigation bar at the top, the content, which scrolls, and the tab bar or a button stack at the bottom. Write a screen's components inside it in order, top to bottom.

Attributes:
- `background` (page | modal | green | chat, default page): page: the app's pale blue, for screens in its sections. modal: white, for a screen presented over them, such as a question or a confirmation. green: the app's green, the same in light and dark, with white text and its content set further down, for a screen that takes over the app, in a full-screen cover. chat: GOV.UK Chat's, the same pale blue, with its conversation kept below the status bar and above the chat input, rather than scrolling under them, as the app's chat screen does.

Content: The screen's components, top to bottom. A <govuk-app-nav-bar>, or the home screen's <govuk-app-home-header>, goes at the top and sticks there. A <govuk-app-tab-bar> goes at the bottom of the content and floats over it. An element with slot="footer", usually a <govuk-app-button-stack>, is pinned below the content, with the tab bar below it if there is one, as GOV.UK Chat's field is. Everything else is the content, 16pt in from the sides and 16pt apart, and scrolls.

Rules:
- Put a screen directly in a <govuk-app>, and give the root a size: the screen fills it, and scrolls inside it.
- Use one screen for each screen of a journey. In a prototype of several pages, put each on its own page.
- Give a screen either a tab bar or a button stack, not both: the app hides the tab bar on screens that ask the user to act. GOV.UK Chat's field is the one footer the app shows above its tab bar.
- Use the modal background for screens presented over the app, such as a sign-out confirmation, and the page background for the rest.
- Use the green background only for a screen that takes over the app, in a full-screen cover, as the app does when adding a driver and vehicles account. Give it a black button.
- Use the chat background for GOV.UK Chat's screens, with a chat input in its footer.

Avoid:
- For a task over the screen the user was on, such as signing out. Instead: A govuk-app-sheet, with the screen inside it
- For a journey that takes over the app until it's done. Instead: A govuk-app-full-screen-cover, with the screen inside it
- For a part of a screen. Instead: `govuk-app-section`

Example, A modal screen with buttons:
```html
<govuk-app-screen background="modal">
  <p>If you’re using Face ID or Touch ID to unlock the app, this will be turned off. You can turn it on again the next time you sign in.</p>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button variant="destructive" name="sign-out">Sign out</govuk-app-button>
    <govuk-app-button variant="grouped-secondary" name="cancel">Cancel</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Example, A page pushed on top, with a button:
```html
<govuk-app-screen>
  <govuk-app-nav-bar title="Your app data" back></govuk-app-nav-bar>
  <p>We store a small amount of data about you to improve your experience in the app.</p>
  <p>You can ask for a copy of it.</p>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button name="request">Request your data</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/screen/

### Search field `<govuk-app-search-field>`

native component. Script: components/search-field/search-field.js

Lets the user type what they're looking for and search for it, such as searching GOV.UK from the home screen, or filtering a list of countries.

Attributes:
- `placeholder` (string, default Search): What the field says while it's empty, and its name for screen readers unless it has a label.
- `label` (string): Its name for screen readers, if the placeholder doesn't say what it searches, such as Search for a country.
- `value` (string): What is already typed in the field, such as the search the user made to get to a page of results.
- `name` (string, default q): The name what the user typed is sent under when they search.
- `action` (string): The page to go to when the user searches, such as a page of results. Without it, the same page, with what they typed added to its address.

Content: Nothing.

Rules:
- On the home screen, put it in the <govuk-app-home-header>. Elsewhere, put it at the top of the content, above what it searches.
- Leave the placeholder as Search, as the app does everywhere. Where the field searches something narrower than GOV.UK, such as a list of countries, say so to screen readers with a label.
- Give it an action to go to a page of results in a prototype of several pages.

Avoid:
- To search for something on a card of its own, such as a vehicle's registration. Instead: `govuk-app-search-box`
- To ask a question the user answers to carry on, such as their postcode. Instead: `govuk-app-text-field type="postcode"`
- To ask GOV.UK Chat. Instead: `govuk-app-chat-input`

Example, Empty:
```html
<govuk-app-search-field></govuk-app-search-field>
```

Example, Going to a page of results:
```html
<govuk-app-search-field action="#results"></govuk-app-search-field>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/search-field/

### Segmented control `<govuk-app-segmented-control>`

native component. Script: components/segmented-control/segmented-control.js

Switches between two or three views of the same thing, side by side, such as a driving account's Vehicles and Licence, or Your topics and All topics.

Attributes:
- `label` (string): Its name for screen readers, such as Driving, as the app's picker's label.

Content: Two or three <govuk-app-segmented-control-item> elements, left to right. Mark the one that's showing selected. Give each an href, to make it a link to another page, or name and value, to tell it apart as a button. Its label is what's written between its tags.

Part `<govuk-app-segmented-control-item>`: One segment, holding its label: a link to another page, or a button.

Attributes:
- `href` (string): Makes it a link to this page.
- `name` (string): Without an href, makes it a button with this name, so a page listening for clicks can tell which was pressed.
- `value` (string): Set on the button, alongside name, to say which of several it was.
- `selected` (boolean, default false): The segment that's showing.

Rules:
- Use it to switch between views of the same thing, not to go somewhere new: for that, use a navigation row or the tab bar.
- Use two or three segments, each one short word or two, so they fit side by side.
- Select exactly one segment: the one whose view is showing.
- Put it at the top of what it switches, 16pt in from the screen's edges, as the app does.

Avoid:
- To go to another screen. Instead: `govuk-app-grouped-list-row type="navigation"`
- To move between the app's sections, Home, Chat and Settings. Instead: `govuk-app-tab-bar`
- To switch a setting on or off. Instead: `govuk-app-toggle`
- For more than three views. Instead: A grouped list of navigation rows, one for each, each going to its own screen

Example, Two segments:
```html
<govuk-app-segmented-control label="Driving">
  <govuk-app-segmented-control-item name="vehicles" selected>Vehicles</govuk-app-segmented-control-item>
  <govuk-app-segmented-control-item name="licence">Licence</govuk-app-segmented-control-item>
</govuk-app-segmented-control>
```

Example, Segments that link to other pages:
```html
<govuk-app-segmented-control label="Topics">
  <govuk-app-segmented-control-item href="#your-topics" selected>Your topics</govuk-app-segmented-control-item>
  <govuk-app-segmented-control-item href="#all-topics">All topics</govuk-app-segmented-control-item>
</govuk-app-segmented-control>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/segmented-control/

### Sheet `<govuk-app-sheet>`

native component. Script: components/sheet/sheet.js

Presents a screen over the one the user was on, for a task they finish or cancel before going back, such as signing out, finding their local council or choosing a country. The screen it was presented from is set back behind it.

Attributes:
- `present` (boolean, default false): Brings the sheet up from the bottom when the page loads, as UIKit presents it. Give it to the first screen of a modal journey, and not to the screens after it, which are already in the sheet.
- `label` (string): The sheet's name for screen readers, such as Sign out. Leave it off if its screen has a heading or a navigation bar title.

Content: The sheet's screen, a <govuk-app-screen>, usually with background="modal", starting with a <govuk-app-nav-bar> that has a close action. Optionally, the screen it was presented from, with slot="behind", which is drawn set back behind it and can't be used.

Rules:
- Put a sheet directly in a <govuk-app>, in place of a screen. Give the root a size, as for a screen.
- Use a sheet for a task the user finishes or cancels before going back, as the app does: signing out, finding their local council, choosing a country, linking an account.
- Always give the sheet's screen a navigation bar with a close action, so it can be dismissed, even if it has Cancel in a button stack too. The sheet leaves room above the bar for it.
- Draw the screen it was presented from behind it, with slot="behind", so the user can see where they'll go back to.
- Give present only to the first screen of the modal journey. Later screens of the same journey are already in the sheet.

Avoid:
- For a journey that takes over the app until it's done, such as adding a driver and vehicles account. Instead: `govuk-app-full-screen-cover`
- For the next screen of a journey, pushed on top of the last. Instead: A govuk-app-screen of its own, with a back button in its navigation bar
- For a few things to do with something on a card. Instead: `govuk-app-menu-button`
- For something the user should know, that they needn't act on. Instead: `govuk-app-banner`

Example, With a navigation bar and close action:
```html
<govuk-app-sheet>
  <govuk-app-screen background="modal">
    <govuk-app-nav-bar title="Select a country">
      <govuk-app-nav-bar-item icon="close" name="close">Close</govuk-app-nav-bar-item>
    </govuk-app-nav-bar>
    <govuk-app-text>Get travel alerts for the countries you choose.</govuk-app-text>
  </govuk-app-screen>
</govuk-app-sheet>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/sheet/

### Stack `<govuk-app-stack>`

native component. Script: components/stack/stack.js

Lays out a few components in a row or a column, lined up and spaced as a screen needs, where no other component already does: such as a vehicle's number plate and menu button side by side on the right of its card, as the future driving designs show them.

Attributes:
- `direction` (vertical | horizontal, default vertical): vertical, a column, as a VStack; horizontal, a row, as an HStack.
- `align` (start | center | end, default center): How its items line up across it: in a row, top, middle or bottom; in a column, left, centre or right.
- `distribute` (start | end | between, default start): Where its items go along it: at its start, at its end, or the first at the start and the last at the end, as with a Spacer between them.
- `gap` (none | extra-small | small | medium | large, default small): The space between its items, from the spacing scale: 0, 4, 8, 16 or 24pt.

Content: The components it lays out, in order.

Rules:
- Use it only where no other component already lays things out: a screen, a section, a grouped list's content row and summary columns all space what they hold.
- Keep a row to a few short items, so they fit side by side on a phone.
- Leave gap at small, SwiftUI's own spacing, unless the design asks for another.

Avoid:
- To space a screen's parts apart. Instead: `govuk-app-section`
- For a few short facts side by side, with dividers between them. Instead: `govuk-app-summary-columns`
- For buttons at the bottom of a screen. Instead: `govuk-app-button-stack`
- For rows on a card. Instead: `govuk-app-grouped-list`

Example, A heading and a number plate, at either end:
```html
<govuk-app-stack direction="horizontal" distribute="between">
  <govuk-app-heading level="2" size="title-2">Lamborghini</govuk-app-heading>
  <govuk-app-number-plate>LH09 PZ2</govuk-app-number-plate>
</govuk-app-stack>
```

Example, Two buttons side by side:
```html
<govuk-app-stack direction="horizontal" gap="medium">
  <govuk-app-button variant="secondary" name="no">No</govuk-app-button>
  <govuk-app-button name="yes">Yes</govuk-app-button>
</govuk-app-stack>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/stack/

### Tab bar `<govuk-app-tab-bar>`

native component. Script: components/tab-bar/tab-bar.js

Moves between the app's top-level sections: Home, Chat and Settings. It floats at the bottom of every screen in those sections, and shows which one the user is in.

Content: Two to five <govuk-app-tab-bar-item> elements, one for each tab, in order. Each takes an icon attribute, the name of a Material Symbol (such as home, chat_bubble or settings); an href, to make the tab a link to another page, or name and value, to tell it apart as a button; and selected, on the tab of the section the screen is in. Its label is what is written between its tags.

Part `<govuk-app-tab-bar-item>`: One tab, holding its label.

Attributes:
- `icon` (string, required): A Material Symbol, such as home, chat_bubble or settings.
- `href` (string): Makes it a link to this page.
- `name` (string): Without an href, makes it a button with this name, so a page listening for clicks can tell which was pressed.
- `value` (string): Set on the button, alongside name, to say which of several it was.
- `selected` (boolean, default false): The tab of the section the screen is in.

Rules:
- Use it only on the top-level screens of the app's sections. Hide it on screens a section pushes on top, and on modals, as the app does.
- Put it last in the screen, after the content. It sticks to the bottom of the screen and the content scrolls under it.
- Use the app's own tabs, in its order: Home (icon home), Chat (icon chat_bubble) and Settings (icon settings).
- Select exactly one tab: the one for the section the screen is in.
- Keep each label to one short word. Labels don't wrap, and are cut off if they are too long.
- In a prototype of several pages, give each tab an href to its section's first page, and mark that tab selected on each of its pages.

Avoid:
- On a screen that asks the user to act, such as confirm or continue. Instead: `govuk-app-button-stack`
- On a screen pushed on top of another, or a modal. Instead: Leave it out, and give the screen a back button or a close action in its navigation bar
- To switch between views of the same thing. Instead: `govuk-app-segmented-control`

Example, Home selected:
```html
<govuk-app-tab-bar>
  <govuk-app-tab-bar-item icon="home" name="home" selected>Home</govuk-app-tab-bar-item>
  <govuk-app-tab-bar-item icon="chat_bubble" name="chat">Chat</govuk-app-tab-bar-item>
  <govuk-app-tab-bar-item icon="settings" name="settings">Settings</govuk-app-tab-bar-item>
</govuk-app-tab-bar>
```

Example, Settings selected, without Chat:
```html
<govuk-app-tab-bar>
  <govuk-app-tab-bar-item icon="home" name="home">Home</govuk-app-tab-bar-item>
  <govuk-app-tab-bar-item icon="settings" name="settings" selected>Settings</govuk-app-tab-bar-item>
</govuk-app-tab-bar>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/tab-bar/

### Text `<govuk-app-text>`

native component. Script: components/text/text.js

A paragraph of the app's text: Body, as most of it is, or a smaller style for details such as dates, captions and supporting information.

Attributes:
- `size` (title-1 | body | callout | subheadline | footnote | caption-1 | caption-2, default body): The text style it is drawn in. title-1 is Title 1, regular, larger than Body, as the app sets the text on its green screens.
- `emphasis` (boolean, default false): Draws it semibold, as GovKit's bodySemibold and the like.
- `colour` (primary | secondary, default primary): secondary: grey, text.secondary, for supporting text such as a date or a hint.
- `align` (start | center, default start): center, under a centred heading, as on the app's onboarding and information screens.

Content: The paragraph's text. A few words of it can be bold, in a <govuk-app-strong>.

Rules:
- Use Body for a screen's text. Use a smaller style only for supporting details, as the app does: Subheadline or Footnote for a date or a label, Caption for the smallest notes.
- Use Title 1 only for the few lines of a screen that takes over the app, such as a green one, as the app does.
- Use one text element for each paragraph. A screen spaces them 16pt apart.
- Use emphasis sparingly, for a word or line that has to stand out. For a heading, use the heading.
- Use the secondary colour only for supporting text, never for something the user must read to act.
- Centre text only under a centred heading.

Avoid:
- For a screen's title, or a section's. Instead: `govuk-app-heading`
- For a few words that say what the rest of a line is. Instead: `govuk-app-strong`
- For a few points that are read together. Instead: `govuk-app-bulleted-list`
- For a name and postal address. Instead: `govuk-app-address`
- For something the user should know now, set apart from the screen. Instead: `govuk-app-banner`

Example, A paragraph:
```html
<govuk-app-text>If you’re using Face ID or Touch ID to unlock the app, this will be turned off. You can turn it on again the next time you sign in.</govuk-app-text>
```

Example, Emphasised, and secondary:
```html
<govuk-app-text emphasis>Your MOT expires on 14 March 2027</govuk-app-text>
<govuk-app-text size="subheadline" colour="secondary">Last checked today at 9:41am</govuk-app-text>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/text/

### Toggle `<govuk-app-toggle>`

native component. Script: components/toggle/toggle.js

Switches something on or off straight away, such as sharing app usage statistics.

Attributes:
- `checked` (boolean, default false): Whether it is on.
- `label` (string): Its name for screen readers, such as Share app usage statistics. Leave it off inside a <label> that names it already.
- `name` (string): Its name, to tell it apart in its change event or in a form.
- `value` (string): Its value, sent with a form when it is on.

Rules:
- Use a toggle for something that takes effect as soon as it is switched, not for a choice confirmed with a button.
- For a setting in a list, use a grouped list's toggle row, as the app does on Settings. Use a toggle on its own only where there's no list for it.
- Always give it a name: a label, or a <label> around it and the text beside it.
- Name it for what it turns on, such as Share app usage statistics, not On or Off.

Avoid:
- For a setting in a list, as on Settings. Instead: `govuk-app-grouped-list-row type="toggle"`
- For a choice the user confirms with a button. Instead: `govuk-app-grouped-list-row type="selectable"`
- To switch between views of the same thing. Instead: `govuk-app-segmented-control`

Example, On:
```html
<govuk-app-toggle name="statistics" label="Share app usage statistics" checked></govuk-app-toggle>
```

Example, Off:
```html
<govuk-app-toggle name="statistics" label="Share app usage statistics"></govuk-app-toggle>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/toggle/

### Card header `<govuk-app-card-header>`

GOV.UK app component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file. Script: components/card-header/card-header.js

Shows at a glance how something on a card stands, when it needs attention: the top of the card in a colour for its state, holding its title, such as Disqualified, Revoked or Expired.

Attributes:
- `tone` (caution | warning | danger, default caution): caution: pale yellow, as for an expired licence. warning: yellow, as for a revoked one. danger: red, as for a disqualified driver.
- `tall` (boolean, default false): Makes it at least 120pt tall, its content at the bottom, as the designs show a state that is the card's whole point, such as Disqualified.

Content: What it holds, such as a heading, or a line of text over one, 8pt apart.

Rules:
- Use it only for a state that needs the user's attention, such as an expired, revoked or disqualified licence. A card that's fine has no header.
- Put the state in words in its title: the colour alone doesn't tell everyone.
- Match the tone to how serious the state is: caution for something to put right, warning for something that stops the user, danger for the most serious.
- Put it in a grouped list's first row, flush, so it fills the top of the card, and say what the state means, and what to do, in the rows below.

Avoid:
- For a card that's fine, with nothing to put right. Instead: Leave the header off, and say how it stands in the card's rows
- For how a vehicle's tax or MOT, or a licence, stands, when it needs no attention. Instead: `govuk-app-status`
- For a warning about the whole screen, not one card. Instead: `govuk-app-banner type="warning"`

Example, Danger, tall, as a disqualified driver:
```html
<govuk-app-grouped-list>
  <govuk-app-grouped-list-row type="content" flush>
    <govuk-app-card-header tone="danger" tall>
      <govuk-app-heading level="2" size="title-1">Disqualified</govuk-app-heading>
    </govuk-app-card-header>
  </govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="content">
    <govuk-app-text>You have been disqualified from driving until 24 April 2026.</govuk-app-text>
  </govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

Example, Warning, tall, as a revoked licence:
```html
<govuk-app-grouped-list>
  <govuk-app-grouped-list-row type="content" flush>
    <govuk-app-card-header tone="warning" tall>
      <govuk-app-heading level="2" size="title-1">Revoked</govuk-app-heading>
    </govuk-app-card-header>
  </govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="link" href="https://www.gov.uk/apply-first-provisional-driving-licence">Get a provisional licence</govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/card-header/

### Count `<govuk-app-count>`

GOV.UK app component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file. Script: components/count/count.js

Shows how many of something there are, big enough to take in at a glance, such as a driver's offences and penalty points.

Attributes:
- `value` (string, required): How many, such as 0 or 12.

Content: What it counts, a word or two, such as Offences or Points.

Rules:
- Use it for a number that matters on its own, at a glance, such as penalty points. For a number in a list, use a grouped list's count row.
- Say what it counts in a word or two, and make it agree with the number: 0 Offences, 1 Offence, 12 Points.
- Put two or three side by side in summary columns, with a way to see more, such as History, in a row below them.

Avoid:
- For a number in a list, such as of unread messages. Instead: `govuk-app-grouped-list-row type="count"`
- For how something with a deadline stands, such as days left on a vehicle's tax. Instead: `govuk-app-status`
- For a number in a sentence. Instead: `govuk-app-text`

Example, A count:
```html
<govuk-app-count value="12">Points</govuk-app-count>
```

Example, A driver's offences and points, in summary columns:
```html
<govuk-app-summary-columns>
  <govuk-app-summary-column>
    <govuk-app-count value="2">Offences</govuk-app-count>
  </govuk-app-summary-column>
  <govuk-app-summary-column>
    <govuk-app-count value="12">Points</govuk-app-count>
  </govuk-app-summary-column>
</govuk-app-summary-columns>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/count/

### Search box `<govuk-app-search-box>`

GOV.UK app component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file. Script: components/search-box/search-box.js

Lets the user type what they're looking for where they are and search for it, on a card of its own with a search button, such as a vehicle's registration to check its tax and MOT. A hint of what to type, such as a blank number plate, can sit inside it.

Attributes:
- `placeholder` (string): What the box shows until the user types, such as Start, as the designs have it, or Search for a vehicle.
- `label` (string): The box's name for screen readers, such as Registration number. Without it, they hear its placeholder.
- `name` (string, default q): The name what the user typed is sent as.
- `value` (string): Text already in the box.
- `action` (string): Where the search goes, such as the page of results. Without it, the page it's on.

Content: Optionally, an element with slot="accessory", inside the box after the text, hinting at what to type, such as <govuk-app-number-plate variant="front">ABC</govuk-app-number-plate>. Screen readers don't hear it.

Rules:
- Put it in a section that says what it searches for, such as Check a vehicle, with a description, such as View information for any vehicle.
- Give it a label saying what to type, such as Registration number, when its placeholder doesn't: screen readers don't hear its accessory.
- Give it an accessory only where it shows what to type, as a blank number plate does for a registration.
- For a search bar in the system's style, such as at the top of a screen or a list, use the search field.

Avoid:
- To search GOV.UK, or filter a list, such as of countries. Instead: `govuk-app-search-field`
- To ask a question on a form, with a button below to carry on. Instead: `govuk-app-text-field`
- To ask GOV.UK Chat. Instead: `govuk-app-chat-input`

Example, A vehicle's registration, with a blank number plate:
```html
<govuk-app-section title="Check a vehicle" description="View information for any vehicle">
  <govuk-app-search-box placeholder="Start" label="Registration number" name="registration" action="#vehicle">
    <govuk-app-number-plate slot="accessory" variant="front">ABC</govuk-app-number-plate>
  </govuk-app-search-box>
</govuk-app-section>
```

Example, Without an accessory:
```html
<govuk-app-section title="Find your local council" description="Check which council looks after where you live">
  <govuk-app-search-box placeholder="Postcode" name="postcode" action="#council"></govuk-app-search-box>
</govuk-app-section>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/search-box/

### Status `<govuk-app-status>`

GOV.UK app component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file. Script: components/status/status.js

Shows the state of something with a deadline or a validity, such as a vehicle's tax or MOT, or a driving licence: an icon for its state, then what it is and how it stands, such as Valid, 23 days, or Expired.

Attributes:
- `state` (valid | due | expired | none, default valid): valid: a green dot. due: a purple ring, filled as far as progress, for something coming up. expired: a circled exclamation mark. none: no icon, for something that doesn't apply, such as an MOT that isn't required.
- `progress` (string, default 1): For a due status, how full its ring is, from 0 to 1, such as 0.75. Make it the share of the time left, so it empties as the deadline nears.
- `label` (string, required): What it is, in Body Semibold, such as Tax, MOT due or Tax expiring.
- `detail` (string): Anything to say after the label on the same line, not in bold, such as a date: 12 May 2026.
- `caption` (string): The line below, in Subheadline, grey, such as Valid, 23 days, Expired or Not required.

Rules:
- Say the state in words as well, in the caption or the label: the icon alone doesn't tell everyone, such as people who can't see it or can't tell its colours apart.
- Use due for something with a deadline coming up, and count down to it in the caption, such as 23 days. Give it a progress to match.
- Use none, not valid, for something that doesn't apply, and say so: Not required.
- Keep the label to a word or two, and the caption to one short line, so two fit side by side.

Avoid:
- For a number that matters on its own, such as penalty points. Instead: `govuk-app-count`
- For a fact with no state, such as a vehicle's fuel. Instead: `govuk-app-labelled-icon`
- For a state that needs attention, at the top of its card. Instead: `govuk-app-card-header`

Example, Valid:
```html
<govuk-app-status label="Tax" caption="Valid"></govuk-app-status>
```

Example, Expired:
```html
<govuk-app-status state="expired" label="MOT" caption="Expired"></govuk-app-status>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/status/

### Strong `<govuk-app-strong>`

native component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file. Script: components/strong/strong.js

Makes a few words of a line bold, where they say what the rest of it is, such as Expired before a date, or 1 year 28 days before remaining.

Content: The words to make bold. Put it inside a <govuk-app-text>, around the words, and it takes that text's size and colour.

Rules:
- Bold only the words that say what the rest of the line is, such as Expired before a date.
- For a whole line in bold, give the text emphasis instead. For a heading, use the heading.
- Use it once in a line at most: more, and nothing stands out.

Avoid:
- For a whole line in bold. Instead: `govuk-app-text emphasis`
- For a heading. Instead: `govuk-app-heading`
- For words that go somewhere. Instead: `govuk-app-link`

Example, A status before a date:
```html
<govuk-app-text size="subheadline"><govuk-app-strong>Expired</govuk-app-strong> 28 March 2026</govuk-app-text>
```

Example, A time left:
```html
<govuk-app-text><govuk-app-strong>1 year 28 days</govuk-app-strong> remaining</govuk-app-text>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/strong/
