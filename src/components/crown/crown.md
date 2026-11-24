## As the user scrolls to it

Put the crown last on the home screen, after the last widget. It grows and fades in over the last 70pt of the screen’s scroll, the crown and the space below it, and is at its full size at the end of the screen. Scroll these to see it.

<div class="docs-example">
<div class="docs-example__frames">
{%- for scheme in ["light", "dark"] %}
<govuk-app class="docs-example__screen docs-example__screen--short" colour-scheme="{{ scheme }}">
  <govuk-app-screen>
    <govuk-app-grouped-list title="Pages you’ve visited" action="See all">
      <govuk-app-grouped-list-row type="link" href="https://www.gov.uk/register-to-vote" description="Last visited on 6 October">Register to vote</govuk-app-grouped-list-row>
      <govuk-app-grouped-list-row type="link" href="https://www.gov.uk/check-mot-history" description="Last visited on 14 August">Check the MOT history of a vehicle</govuk-app-grouped-list-row>
      <govuk-app-grouped-list-row type="link" href="https://www.gov.uk/vehicle-tax" description="Last visited on 2 August">Tax your vehicle</govuk-app-grouped-list-row>
      <govuk-app-grouped-list-row type="link" href="https://www.gov.uk/renew-adult-passport" description="Last visited on 21 July">Renew or replace your adult passport</govuk-app-grouped-list-row>
    </govuk-app-grouped-list>
    <govuk-app-text align="center">Tell us what you think about the app</govuk-app-text>
    <govuk-app-button variant="grouped-secondary">Give feedback</govuk-app-button>
    <govuk-app-crown></govuk-app-crown>
  </govuk-app-screen>
</govuk-app>
{%- endfor %}
</div>
</div>

## Known differences from the app

- The app eases the crown towards each new size as the user scrolls. The crown keeps up with the scroll exactly.
- Firefox can’t yet tie an animation to scrolling, so it draws the crown at its full size.
- A screenshot of the app shows the crown darker, and in its own proportions. The app’s source at 1e520fc1 draws it in the grey of its own image, #858686, in light and dark, stretched to a 40pt square, and this follows the source.
