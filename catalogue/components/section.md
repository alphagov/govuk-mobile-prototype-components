# Section `<govuk-app-section>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/section/section.js"></script>`

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
- For a list of rows that needs only a title. Instead: `govuk-app-grouped-list title="Privacy and legal"` (see ../components/grouped-list.md)
- For a section the user can act on as a whole, such as a widget with Edit. Instead: `govuk-app-section-heading` (see ../components/section-heading.md)
- For the screen's own title. Instead: `govuk-app-heading level="1"` (see ../components/heading.md)
- To put a few components side by side. Instead: `govuk-app-stack direction="horizontal"` (see ../components/stack.md)

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
