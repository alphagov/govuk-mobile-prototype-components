# Banner `<govuk-app-banner>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/banner/banner.js"></script>`

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
- For how something with a deadline stands, such as a vehicle's tax. Instead: `govuk-app-status` (see ../components/status.md)
- For one card that needs attention, such as an expired licence. Instead: `govuk-app-card-header` (see ../components/card-header.md)
- To confirm something worked, such as signing out. Instead: A screen of its own, with a centred govuk-app-heading size="large-title" (see ../components/heading.md)
- For a few points that are read together. Instead: `govuk-app-bulleted-list` (see ../components/bulleted-list.md)

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
