## Over a screen

The tab bar sticks to the bottom of the screen, and the content scrolls under its glass. Scroll these to see it.

<div class="docs-example">
<div class="docs-example__frames">
{%- for scheme in ["light", "dark"] %}
<govuk-app class="docs-screen" colour-scheme="{{ scheme }}">
  <p>Topics</p>
  <p>Business. Driving and transport. Money and tax. Travel abroad. Benefits. Childcare and parenting. Citizenship and living in the UK. Crime, justice and the law. Disabled people. Education and learning. Employing people. Environment and countryside. Housing and local services. Visas and immigration. Working, jobs and pensions.</p>
  <p>Your local services</p>
  <p>Add a link to your local council’s website to find services near you, such as bin collections, council tax and parking permits.</p>
  <p>Pages you’ve visited</p>
  <p>Check if you need a UK visa. Renew or replace your adult passport. Check your State Pension age. Tax your vehicle. Find out how much Income Tax you pay. Register to vote. Apply for a provisional driving licence.</p>
  <govuk-app-tab-bar>
    <govuk-app-tab-bar-item icon="home" name="home" selected>Home</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="chat_bubble" name="chat">Chat</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="settings" name="settings">Settings</govuk-app-tab-bar-item>
  </govuk-app-tab-bar>
</govuk-app>
{%- endfor %}
</div>
</div>

## Icons

The app's tabs use SF Symbols, which may only be used on Apple’s platforms, so the tab bar draws [Material Symbols](https://fonts.google.com/icons) instead, rounded and filled, from Google Fonts. Give a tab any symbol’s name as its `icon`. The closest to the app’s are `home`, `chat_bubble` and `settings`.

## Known differences from the app

- The glass is a blurred, translucent fill. It doesn’t bend the content behind it, catch the light at its edges, or change from light to dark with what’s under it.
- Pressing a tab doesn’t swell it into a lens, and the selection doesn’t slide from one tab to the next.
- Holding a tab doesn’t show the larger copy of it that iOS shows people who use large text.
