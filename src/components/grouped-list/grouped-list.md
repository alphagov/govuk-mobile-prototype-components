## Icons

The app’s rows use SF Symbols, which may only be used on Apple’s platforms, so the list draws [Material Symbols](https://fonts.google.com/icons) instead: `chevron_right` for a navigation row and `arrow_outward` for a link. A selectable row draws whichever symbol it names as its `icon`, such as `check` or `more_horiz`.

## Topics

A topic row draws its `icon` on the left, white on a blue circle, as the Topics widget on Home does. The app’s own topic icons are Material Symbols, filled, so these are the same ones, from Material Symbols Outlined:

| Topic | `icon` |
| --- | --- |
| Benefits | `currency_pound` |
| Business | `business_center` |
| Care | `favorite` |
| Driving | `directions_car` |
| Employment | `assignment` |
| Health | `local_hospital` |
| Money | `pie_chart` |
| Parenting | `escalator_warning` |
| Retirement | `chair` |
| Studying | `import_contacts` |
| Travel | `travel` |

Without an `icon`, it draws `star`, as the app does for a topic it has no icon for.

## Images

An information or link row can draw a picture on its left, at its own size, with `image` giving its URL, as Settings draws One Login's account icon beside the user's email. This component's folder has that icon, as `images/one-login.svg`:

```html
<govuk-app-grouped-list-row type="information" description="test@example.com" image="components/grouped-list/images/one-login.svg">Your GOV.UK One Login</govuk-app-grouped-list-row>
```

Screen readers don't hear the image: say what it shows in the row's title.

The app also draws an image on a topic's step-by-step guides, with its own version for dark mode. That one isn't here yet: an image can't follow `colour-scheme` from one picture to another.

## Proposed additions

These come from the future driving designs, not the app, which we have only as a screenshot for now. They may change, or never ship.

- A **content row** holds anything, such as a vehicle’s name and model, or summary columns with `flush`. The divider between rows is drawn as for any other row.
- The **accent background**, a stronger blue, for a card that’s a single action, as the designs draw Add vehicle. In the app today it’s white.
- **Full-width dividers**, with `dividers="full"`: right across the card, in a paler blue, as the designs’ vehicle cards have. GovKit’s are 16pt in from each side.

## Action rows

An action row is the app’s Add vehicle card (`VehiclesView`): its title, with an outlined plus on the right. The plus is drawn here rather than from the icon font, whose icons are all filled. Give it an `icon` to draw a Material Symbol instead.

## Known differences from the app

- GovKit can draw a section’s title in a coloured band at the top of the card, with an icon. This can’t yet.
- A count row can’t yet show the spinner the app shows while it loads.
- A toggle row’s switch is the [toggle](../toggle/), with its differences from the app.
- The chevron is a little lighter than SF’s.
- On iOS the topic icons are images with their circle drawn in. These draw the circle and the symbol separately, as Android does.
