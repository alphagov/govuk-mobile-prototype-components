# Home (template)

The app’s Home tab, as a user sees it once they’ve chosen some topics, set their council and visited some pages: the header and search, then the Topics, Your local services and Pages you’ve visited widgets, and a way to give feedback.

Use when:
- Prototyping a new widget on Home, or a change to one.
- Prototyping a journey that starts on Home, such as from a topic or a page the user has visited.
- Showing a new feature in the place a user would find it, in the app as it is.

Screens, in the repository and the package:
- Home: src/templates/home/index.html. The root of the Home tab. Your topics and All topics switch the topics shown; the local council and the pages visited open GOV.UK in the browser.

Components: [`govuk-app-screen`](../components/screen.md), [`govuk-app-home-header`](../components/home-header.md), [`govuk-app-search-field`](../components/search-field.md), [`govuk-app-grouped-list`](../components/grouped-list.md), [`govuk-app-segmented-control`](../components/segmented-control.md), [`govuk-app-section-heading`](../components/section-heading.md), [`govuk-app-link-card`](../components/link-card.md), [`govuk-app-text`](../components/text.md), [`govuk-app-button`](../components/button.md), [`govuk-app-crown`](../components/crown.md), [`govuk-app-tab-bar`](../components/tab-bar.md)

Notes:
- The page has a comment at its top saying what to change and what to leave.
- The topics, Edit, See all and Give feedback go nowhere, as the library has no screens for them. Give a row an href to a page of yours to make it open one.
- Searching isn’t here: the field takes typing, but there are no results.
- Chat and Settings on the tab bar open the Chat and Settings templates, if they’re beside this one.

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/templates/home/about/
