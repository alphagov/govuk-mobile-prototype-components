# Plan

## Goal

Build a library of components for prototyping the GOV.UK app. A designer should be able to create a prototype app journey by writing plain HTML that uses these components.

## Principles

- **Match the app.** The library should contain the components that are available in the GOV.UK app, and each one should look and behave like its app counterpart. [inventory/COMPONENTS.md](inventory/COMPONENTS.md) lists what exists in the iOS and Android apps today, with screenshots, and is the starting backlog.
- **Web components, minimal vanilla JS.** Each component is a custom element. No frameworks, no build step beyond what is strictly needed.
- **Self-contained components.** Each component carries all the HTML, CSS and JS needed to draw it, so it can be used on its own.
- **Every component has a definition file.** A JSON file sits alongside each component and documents it (see below).

## Component definition file

Each component has a JSON definition that describes:

- **Purpose:** what the component is for.
- **Inputs:** the attributes, properties and slots it accepts.
- **Outputs:** the events it emits.
- **Rules:** guidance on when and how to use it, and when not to.
- **Source material:** links to Figma, the iOS and Android source, and anything else it was built from.
- **Native component or GOV.UK app component:** whether the component mirrors something native to the platform (such as a modal or a tab bar), a native component, or is specific to the GOV.UK app, a GOV.UK app component.

An illustrative example of the shape (the exact schema is still to be agreed):

```json
{
  "name": "govuk-primary-button",
  "purpose": "The main call to action on a screen.",
  "kind": "govuk",
  "inputs": {
    "attributes": { "disabled": "boolean", "loading": "boolean" },
    "slots": { "default": "Button label" }
  },
  "outputs": {
    "events": { "click": "Fired when the button is pressed" }
  },
  "rules": [
    "Use at most one primary button per screen."
  ],
  "sources": {
    "figma": "",
    "ios": "GOVUKButton (.primary) in govuk-mobile-ios-gov-kit",
    "android": "PrimaryButton in govuk-mobile-android-app design module"
  }
}
```

## How we work

- Developers build the components one at a time.
- For each component, the developer checks that it meets the requirements above: it matches the app, it is self-contained, and its definition file is complete.

## End state

It is possible to build a prototype app journey by writing HTML that uses the web components, for example:

```html
<govuk-screen title="Check your vehicle">
  <govuk-text-field label="Registration number"></govuk-text-field>
  <govuk-primary-button>Continue</govuk-primary-button>
</govuk-screen>
```

(Component names here are illustrative.)
