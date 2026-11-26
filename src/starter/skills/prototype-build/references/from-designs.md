# Working from a design, a screenshot or a sketch

A design says what the screen should look like; the library says how the app draws it. Build it from the library's parts, matching the design's content and order, rather than copying its pixels. Where the design differs from what the app does, such as a button in the wrong place, follow the design, and mention the difference once.

## A Figma link

If the Figma tools are there (look for them with ToolSearch, such as `figma get_design_context`), use them:

- From the link, take the file key (after `/design/`) and the node id (`node-id=12-34` is `12:34`).
- `get_screenshot` to see the frame. Look at it before anything else.
- `get_design_context` for its structure, text and names. It comes back as code for another kind of project: read it for the words, the order and the names of the design's components (a Figma component named "Grouped list" or "Primary button" maps straight to the library's), not to copy.
- Several frames in a flow: take each one, and how they link, to make the plan.

If there are no Figma tools, ask for screenshots of the frames instead: "I can't open Figma from here. Could you paste in a screenshot of each screen?"

## A screenshot, photo or sketch

Read the image with the Read tool, then describe it back in a sentence or two before planning, so a misreading is caught early: "It's a screen titled Bin collections, with your address at the top, then a card for each bin: its colour, what goes in it, and the next collection day."

Then, from top to bottom, name what each part is in the library's terms:

- The bar at the top: a nav bar, with a large or inline title, and back, close or other actions.
- White cards of rows: grouped lists, and each row's type from what's on its right: a chevron (`navigation`), an arrow out (`link`), grey text (`information`), a switch (`toggle`), a tick (`selectable`).
- Big bold text: a heading, or the nav bar's large title.
- A blue button at the bottom: a button stack. A pale blue button on a card: a `compact` button.
- A yellow plate, a green dot, a ring: a number plate, a status.
- Coloured banners, a search field, tabs at the bottom: banner, search field, tab bar.

A sketch is rougher: build what it means, not how it's drawn. A box with a line through it is a picture; a wavy line is text.

Anything you can't name after reading the candidates' cards is a candidate for a custom component: see [custom-component.md](custom-component.md), and say in the plan that it isn't one of the app's own.

## Checking against it

When you check your work, put your screenshot beside the design: same title, same parts in the same order, the same words, the same buttons. The app's spacing and type come from the library, so they'll differ from a rough design; that's right. List anything that's different on purpose when you hand it over.
