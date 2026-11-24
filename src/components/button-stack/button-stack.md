## Known differences from the app

- In landscape the app puts the buttons side by side. This always stacks them.
- The app’s UIKit screens use their own footer, StickyFooterView, whose buttons are 4pt apart rather than 8pt. This draws the SwiftUI one everywhere.
- With nothing below the screen, such as a home indicator, the app puts its last button at the very bottom. This keeps 16pt under it, so its shadow isn’t cut off.
