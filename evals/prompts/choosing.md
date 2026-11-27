You're helping a designer prototype a screen, or a few, of the GOV.UK app, with a library of components that look like the app's own. Choose what to make it from. Don't build anything.

This folder is the library's catalogue. Read `index.md` first, then only the cards you need to choose well: those of your candidates, and the cards their "Avoid" entries point to.

The brief:

> {{brief}}

Answer in the fixed shape:

- `template`: the template to start from, by its folder name (such as `settings`), or null if none.
- `patterns`: the patterns the screens the brief asks for use, by their folder name (such as `confirmation`), or none.
- `elements`: every element of the library on the screens the brief asks for, parts such as `govuk-app-grouped-list-row` too, each with the attributes that decide what it is, such as `variant` or `type`. Leave an attribute out where you'd leave it out of the HTML. Include the elements a pattern brings with it. If you start from a template, list only what's on the screens the brief adds or changes, not the template's other screens.
- `custom`: anything the library hasn't got that would have to be made, in words, or none.
- `reasons`: a few sentences on why.
