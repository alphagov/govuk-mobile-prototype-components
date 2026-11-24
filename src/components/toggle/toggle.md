## In a grouped list

A grouped list's toggle row draws one of these, with the row's title as its name. Use the row for a setting in a list, as on Settings, and the toggle on its own anywhere else.

## Naming it

Give it a `label`, its name for screen readers. Or put it in a `<label>` with the text beside it, which names it, and lets that text be pressed to switch it too:

```html
<label>
  Share app usage statistics
  <govuk-app-toggle name="statistics" checked></govuk-app-toggle>
</label>
```

## Known differences from the app

- It's iOS's switch as the app's snapshots draw it, 51pt by 31pt. iOS 26 on a phone draws a wider one, in Liquid Glass.
- Android draws Material's switch, in the app's colours, which this doesn't.
- It can only be pressed, not dragged from one side to the other.
