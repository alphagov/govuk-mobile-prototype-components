# Tab bar `<govuk-app-tab-bar>`

Native component. In the app.

Load: `<script type="module" src="src/components/tab-bar/tab-bar.js"></script>`

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
- On a screen that asks the user to act, such as confirm or continue. Instead: `govuk-app-button-stack` (see ../components/button-stack.md)
- On a screen pushed on top of another, or a modal. Instead: Leave it out, and give the screen a back button or a close action in its navigation bar
- To switch between views of the same thing. Instead: `govuk-app-segmented-control` (see ../components/segmented-control.md)

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
