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

## Known differences from the app

- GovKit’s rows can have an image on the left, as Your GOV.UK One Login does on Settings. These can’t yet.
- GovKit can draw a section’s title in a coloured band at the top of the card, with an icon. This can’t yet.
- A count row can’t yet show the spinner the app shows while it loads.
- A link row always shows its arrow; GovKit can hide it.
- A toggle row’s switch is the [toggle](../toggle/), with its differences from the app.
- The chevron is a little lighter than SF’s.
- On iOS the topic icons are images with their circle drawn in. These draw the circle and the symbol separately, as Android does.
