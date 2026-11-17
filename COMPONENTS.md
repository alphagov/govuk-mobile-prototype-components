# GOV.UK app components

An inventory of the UI components that exist in the GOV.UK app today, on both platforms, including work that so far only exists on feature branches.

Surveyed on 17 November 2026 from:

| Repo | Commit (`main`) | Remote branches checked |
| --- | --- | --- |
| [govuk-mobile-ios-app](https://github.com/govuk-once/govuk-mobile-ios-app) | `1e520fc1` | 30 |
| [govuk-mobile-ios-gov-kit](https://github.com/govuk-once/govuk-mobile-ios-gov-kit) (iOS shared UI package) | `ad8590b` | 8 |
| [govuk-mobile-android-app](https://github.com/govuk-once/govuk-mobile-android-app) | `16621861` | 83 |

Names are the type or function names used in code, so you can search for them. Screenshots are the light-mode reference images from each app's own snapshot tests; `screenshots/index.json` records each image's source file. Some Android design-system images come from the `GOVUKAPP-4072-screenshot-test` branch, because `main` has no screenshot tests for that module yet. Route/navigation wrappers and preview-only functions are left out.

---

## 1. Design system (shared building blocks)

Android keeps these in the `design` module (`design/src/main/.../design/ui/component`). iOS splits them between the GovKit package (`GovKit`, `GovKitUI`) and the app's `SwiftUIViews`, `UIKitViews` and `Views/Common` folders.

### Buttons

| Component | iOS | Android |
| --- | --- | --- |
| Primary button | `GOVUKButton` / `SwiftUIButton` (`.primary`), `PrimaryButtonView`<br><img src="screenshots/ios-govukbuttonsnapshottests-test-primary-renderscorrectly-3x.webp" width="110" alt=""> | `PrimaryButton`<br><img src="screenshots/android-buttonscreenshottests-primarybuttonscreenshots-primarybutton-19e057b9-0.webp" width="110" alt=""> |
| Secondary button | `GOVUKButton` (`.secondary`, `.groupedSecondary`)<br><img src="screenshots/ios-govukbuttonsnapshottests-test-secondary-renderscorrectly-3x.webp" width="110" alt=""> | `SecondaryButton`<br><img src="screenshots/android-buttonscreenshottests-secondarybuttonscreenshots-secondarybutton-643fa126-0.webp" width="110" alt=""> |
| Compact button | `GOVUKButton` (`.compact`)<br><img src="screenshots/ios-govukbuttonsnapshottests-test-compact-renderscorrectly-3x.webp" width="110" alt=""> | `CompactButton`, `CompactPrimaryButtonWithIcon`<br><img src="screenshots/android-buttonscreenshottests-compactbuttonscreenshots-compactbutton-9d4598f4-0.webp" width="110" alt=""> <img src="screenshots/android-buttonscreenshottests-compactprimarywithiconbuttonscreenshots-compactprimarywithic.webp" width="110" alt=""> |
| Destructive button | `GOVUKButton` (`.destructive`)<br><img src="screenshots/ios-govukbuttonsnapshottests-test-destructive-renderscorrectly-3x.webp" width="110" alt=""> | `DestructiveButton`<br><img src="screenshots/android-buttonscreenshottests-destructivebuttonscreenshots-destructivebutton-9ea09141-0.webp" width="110" alt=""> |
| Cancel / dismiss | `CancelButton` | `HeaderDismissButton` |
| Header icon button | `CenterAlignedBarButtonItem` | `HeaderIconButton` |
| Overflow (⋯) button | — | `OverflowButton`<br><img src="screenshots/android-buttonscreenshottests-overflowbuttonscreenshots-overflowbutton-893a0f80-0.webp" width="110" alt=""> |
| Dialog button | — | `DialogButton` |
| Account connection button | — | `AccountConnectionButton`<br><img src="screenshots/android-buttonscreenshottests-accountconnectionbuttonscreenshots-accountconnectionbutton-a.webp" width="110" alt=""> |
| Connected button | — | `ConnectedButton`<br><img src="screenshots/android-buttonscreenshottests-connectedactivebuttonscreenshots-connectedactivebutton-182f5.webp" width="110" alt=""> |
| Button stack / group | `ButtonStackView`<br><img src="screenshots/ios-govukuicomponentssnapshottests-test-buttons-renderscorrectly-3x.webp" width="110" alt=""> | `DoubleButtonGroup`, `ConnectedButtonGroup`<br><img src="screenshots/android-buttongroupscreenshottests-verticalbuttongroupscreenshots-verticalbuttongroup-2bb2ccc2-.webp" width="110" alt=""> <img src="screenshots/android-buttongroupscreenshottests-horizontalconnectedbuttongroupscreenshots-horizontalconnecte.webp" width="110" alt=""> |
| Fixed bottom buttons | — | `FixedPrimaryButton`, `FixedSecondaryButton`, `FixedDoubleButtonGroup`<br><img src="screenshots/android-buttongroupscreenshottests-fixedprimarybuttonscreenshots-fixedprimarybutton-f1f4e8af-0.webp" width="110" alt=""> |

### Cards

| Component | iOS | Android |
| --- | --- | --- |
| Outlined card | — | `GovUkOutlinedCard` |
| Non-tappable card | `NonTappableCardView`<br><img src="screenshots/ios-nontappablecardviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `NonTappableCard`<br><img src="screenshots/android-cardscreenshottests-nontappablecardscreenshots-nontappablecard-b59dbafe-0.webp" width="110" alt=""> |
| Centred card with icon | `CentreCardView` (GovKitUI)<br><img src="screenshots/ios-centrecardviewsnapshottests-test-primaryandsecondarytextprovided-renderscorrectly-3x.webp" width="110" alt=""> | `CentredCardWithIcon`, `CentredContentWithIcon`<br><img src="screenshots/android-cardscreenshottests-centredcardwithiconwithtitleanddescriptionscreenshots-centre.webp" width="110" alt=""> |
| Icon + action card | `IconActionCardView`<br><img src="screenshots/ios-iconactioncardviewsnapshottests-test-withtitleanddescription-light-renderscorrectly-3x.webp" width="110" alt=""> | — |
| Navigation card | — | `NavigationCard`<br><img src="screenshots/android-cardscreenshottests-navigationcardwithtitleanddescriptionscreenshots-navigationc.webp" width="110" alt=""> |
| Drill-in card | — | `DrillInCard`<br><img src="screenshots/android-cardscreenshottests-drillincarddescriptionscreenshots-drillincarddescription-514.webp" width="110" alt=""> |
| Focusable card | — | `FocusableCard` |
| List card | `ListCardView` | `CardListItem` |
| Search result card | `SearchResultCell` | `SearchResultCard`<br><img src="screenshots/android-cardscreenshottests-searchresultwithdescriptionscreenshots-searchresultwithdescr.webp" width="110" alt=""> |
| Home banner card | — | `HomeBannerCard`<br><img src="screenshots/android-cardscreenshottests-homeinformationemergencybannercardscreenshots-homeinformatio.webp" width="110" alt=""> |
| Quarterly feedback card | `QuarterlySurveyWidgetView` | `QuarterlyFeedbackCard`<br><img src="screenshots/android-cardscreenshottests-quarterlyfeedbackcardscreenshots-quarterlyfeedbackcard-3aff0.webp" width="110" alt=""> |
| Account connection card | `ServiceAccountLinkCardView`<br><img src="screenshots/ios-serviceaccountlinkcardviewsnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `AccountConnectionCard`<br><img src="screenshots/android-cardscreenshottests-accountconnectioncardscreenshots-accountconnectioncard-9db94.webp" width="110" alt=""> |
| Loader card | — | `LoaderCard`<br><img src="screenshots/android-cardscreenshottests-loadercardscreenshots-loadercard-da975df2-0.webp" width="110" alt=""> |

### Lists

| Component | iOS | Android |
| --- | --- | --- |
| Grouped list | `GroupedList`, `GroupedListSectionView`, `GroupedListRowView`, `GroupedListTableViewCell`, `GroupedListSectionHeaderView` (GovKit)<br><img src="screenshots/ios-groupedlistsnapshottests-test-defaultbackgroundcolor-light-renderscorrectly-3x.webp" width="110" alt=""> | — |
| Internal link row | (grouped list row) | `InternalLinkListItem`<br><img src="screenshots/android-listscreenshottests-internallinklistitemdescriptionscreenshots-internallinklisti.webp" width="110" alt=""> |
| External link row | (grouped list row) | `ExternalLinkListItem`<br><img src="screenshots/android-listscreenshottests-externallinklistitemdefaultscreenshots-externallinklistitemd.webp" width="110" alt=""> |
| Toggle row | (grouped list row) | `ToggleListItem`<br><img src="screenshots/android-listscreenshottests-togglelistitemscreenshots-togglelistitem-19c6a3f3-0.webp" width="110" alt=""> |
| Icon row | — | `IconListItem` |
| Status row | `StatusRowView`<br><img src="screenshots/ios-statusrowviewsnapshottests-teststatusrowview-plaintext-light-renderscorrectly-3x.webp" width="110" alt=""> | `StatusListItem`<br><img src="screenshots/android-listscreenshottests-statuslistitemscreenshots-statuslistitem-3e974d1c-0.webp" width="110" alt=""> |
| Address row | — | `AddressListItem`<br><img src="screenshots/android-listscreenshottests-addresslistitemscreenshots-addresslistitem-650418a0-0.webp" width="110" alt=""> |
| Countdown bar row | — | `CountdownBarListItem`<br><img src="screenshots/android-listscreenshottests-countdownbaritemlistitemscreenshots-countdownbaritemlistitem.webp" width="110" alt=""> |
| Count row | — | `CountListItem`<br><img src="screenshots/android-listscreenshottests-countlistitemscreenshots-countlistitem-3914783e-0.webp" width="110" alt=""> |
| Bulleted list | `BulletView` | — |
| Topic list item | `TopicListItemView`<br><img src="screenshots/ios-topiclistitemviewsnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | — |
| Dividers | `DividerView` | `ListDivider`, `FixedContainerDivider` |

### Headers, titles and text

| Component | iOS | Android |
| --- | --- | --- |
| GOV.UK header | `GovUKHeaderView` (GovKit and app) | — |
| Screen headers | `HeaderView` | `TabHeader`, `FullScreenHeader`, `ChildPageHeader`, `ModalHeader`, `Title`<br><img src="screenshots/android-headerscreenshottests-fullscreenheaderbackandactionscreenshots-fullscreenheaderbac.webp" width="110" alt=""> <img src="screenshots/android-headerscreenshottests-childpageheaderbackandactionscreenshots-childpageheaderbacka.webp" width="110" alt=""> <img src="screenshots/android-headerscreenshottests-modalheaderwithclosescreenshots-modalheaderwithclose-55950b8.webp" width="110" alt=""> |
| Section heading | `SectionHeaderLabelView` (GovKitUI)<br><img src="screenshots/ios-sectionheaderlabelviewsnapshottests-test-withbutton-renderscorrectly-3x.webp" width="110" alt=""> | `SectionHeadingLabel`, `ListHeadingLabel`<br><img src="screenshots/android-labelscreenshottests-sectionheadinglabeltitle1screenshots-sectionheadinglabeltitl.webp" width="110" alt=""> |
| Titled section | — | `TitledSection` |
| Text styles | `Font`/`UIFont` extensions (GovKitUI)<br><img src="screenshots/ios-govukuicomponentssnapshottests-test-font-renderscorrectly-3x.webp" width="110" alt=""> | Labels for each style: `LargeTitle…`, `Title1…`–`Title3…`, `Headline…`, `Body…`, `Callout…`, `Subheadline…`, `Footnote…`, `Caption…` (Bold/SemiBold/Regular, plus `…TrailingLink` variants)<br><img src="screenshots/android-labelscreenshottests-title1boldscreenshots-title1bold-a4de9bb5-0.webp" width="110" alt=""> <img src="screenshots/android-labelscreenshottests-bodyregularscreenshots-bodyregular-bff57acd-0.webp" width="110" alt=""> |
| Markdown | `InfoMarkdownView`, `ChatMarkdownTheme`, `NotificationCentreDetailMarkdownTheme` (swift-markdown-ui) | `MarkdownParser` / `MarkdownInlineRendering` |

### Forms and inputs

| Component | iOS | Android |
| --- | --- | --- |
| Search bar | `SearchBarView` | `SearchField`<br><img src="screenshots/android-textfieldscreenshottests-searchheaderscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Radio button | `RadioButtonView` | — |
| Toggle switch | (grouped list row) | `ToggleSwitch`<br><img src="screenshots/android-switchscreenshottests-toggleswitchonscreenshots-toggleswitchon-74412e4b-0.webp" width="110" alt=""> |
| Growing text input | `DynamicTextEditor` | `ChatInput` |
| Inline action error | `InlineActionErrorView`<br><img src="screenshots/ios-inlineactionerrorviewsnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | — |

### Feedback, status and errors

| Component | iOS | Android |
| --- | --- | --- |
| Info alert | — | `InfoAlert`<br><img src="screenshots/android-alertscreenshottests-infoalertscreenshots-infoalert-3f68f9b2-0.webp" width="110" alt=""> |
| App error view | `AppErrorView` (GovKit), `ErrorView`<br><img src="screenshots/ios-apperrorviewsnapshottests-test-genericerror-withbutton-lightmode-renderscorrectly-3x.webp" width="110" alt=""> | `Error`, `ErrorPage`<br><img src="screenshots/android-errorpagescreenshottests-errorpagewithadditionalcontentscreenshots-errorpagewithaddit.webp" width="110" alt=""> |
| Problem message | — | `ProblemMessage`, `ProblemMessageWithRetry`<br><img src="screenshots/android-problemmessagescreenshottests-problemmessagescreenshots-problemmessage-c0e4aa07-0.webp" width="110" alt=""> |
| Offline message / screen | — | `OfflineMessage`, `DeviceOfflineScreen`<br><img src="screenshots/android-deviceofflinescreenscreenshottests-deviceofflinescreenscreenshots-deviceofflinescreen-bbdc34a1-.webp" width="110" alt=""> |
| App unavailable | `AppUnavailableContainerView`<br><img src="screenshots/ios-appunavailableviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `AppUnavailableScreen`<br><img src="screenshots/android-appunavailablescreenscreenshottests-appunavailablescreenscreenshots-appunavailablescreen-7ff1235.webp" width="110" alt=""> |
| Forced update | `AppForcedUpdateContainerView`<br><img src="screenshots/ios-appforcedupdateviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `ForcedUpdateScreen`<br><img src="screenshots/android-forcedupdatescreenscreenshottests-forcedupdatepreviewscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Recommended update | `AppRecommendUpdateContainerView`<br><img src="screenshots/ios-apprecommendupdateviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `RecommendUpdateScreen`<br><img src="screenshots/android-recommendupdatescreenscreenshottests-recommendupdatepreviewscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Countdown / expiry bar | `ExpiryProgressView`<br><img src="screenshots/ios-expiryprogressviewsnapshottests-test-halffull-light-renderscorrectly-3x.webp" width="110" alt=""> | `CountdownBar` |
| Loading screen | `TravelLoadingView`<br><img src="screenshots/ios-travelloadingviewsnapshottests-test-travelloadingview-light-renderscorrectly-3x.webp" width="110" alt=""> | `LoadingScreen` |
| Scroll-for-more indicator | `ScrollBottomIndicatorView` | — |

### Screen templates and layout

| Component | iOS | Android |
| --- | --- | --- |
| Base screen / hosting | `BaseViewController`, `HostingViewController` (GovKit) | `FullScreenWrapper`, `StatusBar` |
| Centre-aligned screen | `InfoView` | `CentreAlignedScreen` |
| Bookend screens | — | `BookendToWebScreen`, `BookendConnectingScreen`, `AccountConnectionSuccessScreen`<br><img src="screenshots/android-screenscreenshottests-bookendtowebscreenscreenshots-bookendtowebscreen-755b7547-0.webp" width="110" alt=""> |
| Onboarding slide | (per-feature onboarding views)<br><img src="screenshots/ios-welcomeonboardingviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `OnboardingSlide`<br><img src="screenshots/android-onboardingpageonescreenshottests-onboardingpageonescreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Privacy policy link | `PrivacyView`<br><img src="screenshots/ios-privacyviewcontrollersnapshottests-test-loadinnavigationcontroller-renderscorrectly-3x.webp" width="110" alt=""> | `PrivacyPolicyLink` |
| Terms and conditions | `TermsAndConditionsView`<br><img src="screenshots/ios-termsandconditionsviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (terms screen in `app`)<br><img src="screenshots/android-termsscreenscreenshottests-termsnewuserpreviewscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Analytics consent | `AnalyticsConsentContainerView`<br><img src="screenshots/ios-analyticsconsentviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | — |
| Spacers | — | `ExtraSmall…`–`ExtraLarge…` `HorizontalSpacer` / `VerticalSpacer` |
| Specification icons | — | `SpecificationsIcons`<br><img src="screenshots/android-specificationsiconsscreenshottests-horizontalspecificationsiconsscreenshots-horizontalspecifica.webp" width="110" alt=""> |
| Animation | `AnimationView`, `SwiftUIAnimationView`, `AnimatedAPNGImageView` (Lottie / APNG) | `AnimateIcon` |
| Tab bar | `BaseTabBarController` | — |

### Theme

| | iOS | Android |
| --- | --- | --- |
| Colours | `GOVUKColors` (+ Text, Fills, Strokes)<br><img src="screenshots/ios-govukuicomponentssnapshottests-test-colours-fills-renderscorrectly-3x.webp" width="110" alt=""> | `Color.kt` |
| Typography | `Font+Extensions`, `UIFont+Extensions`<br><img src="screenshots/ios-govukuicomponentssnapshottests-test-font-renderscorrectly-3x.webp" width="110" alt=""> | `Type.kt` |
| Spacing / sizes | `UIEdgeInsets+Extensions`, `RoundedBorder` | `Spacing.kt`, `Numbers.kt` |
| Theme | — | `GovUkTheme` |

---

## 2. Feature components

### Home and widgets

| Component | iOS | Android |
| --- | --- | --- |
| Homepage widget container | `HomepageWidget`, `HomeContentView`<br><img src="screenshots/ios-homeviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (home module)<br><img src="screenshots/android-homescreenscreenshottests-homescreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Emergency banner | `EmergencyBannerWidgetView`<br><img src="screenshots/ios-emergencybannersnapshottests-test-nationalemergency-light-link-nodismissal-renderscorrect.webp" width="110" alt=""> | `EmergencyBanner`<br><img src="screenshots/android-cardscreenshottests-homenationalemergencybannercardscreenshots-homenationalemerg.webp" width="110" alt=""> |
| Promo banner | `PromoBannerWidgetView` | `PromoBanner` |
| Quarterly survey banner | `QuarterlySurveyWidgetView` | `QuarterlyFeedbackBanner`<br><img src="screenshots/android-cardscreenshottests-quarterlyfeedbackcardscreenshots-quarterlyfeedbackcard-3aff0.webp" width="110" alt=""> |
| Information panel | `InformationView` | — |
| Recent activity / visited | `RecentActivityWidgetView`<br><img src="screenshots/ios-recentactivitywidgetviewsnapshottests-test-loadinnavigationcontroller-activities-light-rendercorre.webp" width="110" alt=""> | `VisitedWidget`<br><img src="screenshots/android-visitedwidgetscreenshottests-visiteditemsscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Search widget | — | `SearchWidget`<br><img src="screenshots/android-searchwidgetscreenshottests-searchwidgetscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Topics widget | `TopicsWidgetView`, `TopicCard`<br><img src="screenshots/ios-topicswidgetviewsnapshottests-test-loadinnavigationcontroller-populated-light-renderscorre.webp" width="110" alt=""> | `TopicsWidget`<br><img src="screenshots/android-topicswidgetscreenshottests-topicswidgetscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Travel alerts widget | `TravelAlertsWidgetView` | `TravelAlertsWidget`<br><img src="screenshots/android-travelalertswidgetscreenshottests-travelalertswidgetloadedscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Local authority widget | `LocalAuthorityWidget`, `StoredLocalAuthorityWidgetView`, `StoredLocalAuthorityCardView`<br><img src="screenshots/ios-storedlocalauthoritywidgetviewsnapshottests-test-loadinnavigationcontroller-twotier-light-renderscorrect.webp" width="110" alt=""> | `LocalWidget`<br><img src="screenshots/android-localwidgetscreenshottests-unitarylocalauthorityscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| DVLA account widget | `DVLAAccountWidgetView`<br><img src="screenshots/ios-dvlaaccountwidgetviewsnapshottests-test-accountsummaryview-light-renderscorrectly-3x.webp" width="110" alt=""> | `VehiclesAndLicenceSummaryWidget` |
| Check vehicle widget | — | `CheckVehicleWidget`, `CheckVehicleCard`<br><img src="screenshots/android-checkvehiclewidgetscreenshottests-searchvehiclecardscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |

### Search

| Component | iOS | Android |
| --- | --- | --- |
| Search history | `SearchHistoryCell`<br><img src="screenshots/ios-searchhistoryviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `PreviousSearches` |
| Suggestions | `SuggestionCell`<br><img src="screenshots/ios-searchsuggestionsviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `SearchAutocomplete`<br><img src="screenshots/android-searchautocompletescreenshottests-highlightdoublesearchterm1screenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Results | `SearchResultCell`<br><img src="screenshots/ios-searchviewcontrollersnapshottests-test-search-successresponse-withresults-renderscorrectly-3x.webp" width="110" alt=""> | `SearchResults` |
| Error | — | `SearchError` |

### Topics

| Component | iOS | Android |
| --- | --- | --- |
| Topic selection card | `TopicSelectionCardView` | `TopicSelectionCard` |
| Topic detail | `TopicDetailView`<br><img src="screenshots/ios-topicdetailviewsnapshottests-test-topicdetail-fetched-renderscorrectly-3x.webp" width="110" alt=""> | (topic screen) |
| Edit topics | `EditTopicsView`<br><img src="screenshots/ios-edittopicsviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (edit topics screen) |
| Topics onboarding | `TopicsOnboardingView`<br><img src="screenshots/ios-topiconboardingviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | — |

### Local services

| Component | iOS | Android |
| --- | --- | --- |
| Explainer | `LocalAuthorityExplainerView`<br><img src="screenshots/ios-localauthorityexplainerviewsnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (explainer screen)<br><img src="screenshots/android-localexplainerscreenscreenshottests-localexplainerscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Postcode entry | `LocalAuthorityPostcodeEntryView`<br><img src="screenshots/ios-localauthoritypostcodeentryviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (lookup screen)<br><img src="screenshots/android-locallookupscreenscreenshottests-locallookupscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Address / authority picker | `AmbiguousAddressSelectionView`, `AmbiguousAuthoritySelectionView`<br><img src="screenshots/ios-ambiguousaddressselectionviewsnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (address / authority select screens)<br><img src="screenshots/android-localaddressselectscreenscreenshottests-localaddressselectscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Confirmation | `LocalAuthorityConfirmationView`<br><img src="screenshots/ios-localauthorityconfirmationviewcontrollersnapshottests-test-loadinnavigationcontroller-twotier-light-renderscorrect.webp" width="110" alt=""> | (confirmation screen)<br><img src="screenshots/android-localconfirmationscreenscreenshottests-twotierauthoritylocalconfirmationscreenshots-light-b29dc7a7-.webp" width="110" alt=""> |
| Local full-screen header | — | `LocalFullScreenHeader` |

### Chat (GOV.UK Chat)

| Component | iOS | Android |
| --- | --- | --- |
| Chat screen | `ChatView`<br><img src="screenshots/ios-chatviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `ChatScreen`<br><img src="screenshots/android-chatscreenscreenshottests-chatscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Question bubble | `ChatCellView` | `Question` |
| Answer bubble | `ChatCellView` | `Answer` |
| Sources | — | `Sources` |
| Typing indicator | `ChatEllipsesView` | — |
| Example questions | `ChatExampleQuestionsView`<br><img src="screenshots/ios-chatexamplequestionsviewsnapshottests-test-loadinnavigationcontroller-examplequestions-light-rende.webp" width="110" alt=""> | `IntroMessages`<br><img src="screenshots/android-intromessagesscreenshottests-messagescreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Feedback | `ChatFeedbackView`<br><img src="screenshots/ios-chatfeedbackviewsnapshottests-test-loadinnavigationcontroller-helpful-light-renderscorrect.webp" width="110" alt=""> | — |
| Action menu | `ChatActionView`, `ChatMenuView`<br><img src="screenshots/ios-chatactionviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `ActionMenu` |
| Input | `DynamicTextEditor` | `ChatInput` |
| Onboarding | — | `OnboardingPage`<br><img src="screenshots/android-onboardingpageonescreenshottests-onboardingpageonescreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Errors | — | `ChatErrorPageWithRetry`, `ChatErrorPageNoRetry` |

### DVLA (driving licence and vehicles)

| Component | iOS | Android |
| --- | --- | --- |
| Account summary | `DVLAAccountSummaryView`<br><img src="screenshots/ios-dvlaaccountsummaryviewsnapshottests-test-licencetabselected-light-renderscorrectly-3x.webp" width="110" alt=""> | `LicenceSummaryCard`, `LicenceSummaryHeader`, `SummaryCardHeader`<br><img src="screenshots/android-licencesummarycardscreenshottests-licenceheaderscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Driving licence | `DrivingLicenceView`, `DrivingLicenceSummaryView`, `DrivingLicenceNoticeView`<br><img src="screenshots/ios-drivinglicenceviewsnapshottests-test-drivinglicencesummaryview-light-renderscorrectly-3x.webp" width="110" alt=""> | `LicenceNotAvailableCard`<br><img src="screenshots/android-licencenotavailablecardscreenshottests-licencenotavailablecardscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Driving record | `DrivingRecordView` | `DrivingRecordSection`<br><img src="screenshots/android-drivingrecordsectionscreenshottests-drivingrecordsectionscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Licence categories | `LicenceCategoriesSectionView`, `LicenceCategoryDetailView`<br><img src="screenshots/ios-licencecategorydetailviewsnapshottests-test-light-renderscorrectly-3x.webp" width="110" alt=""> | `DrivingCategoriesSection`, `CategoryListItem`<br><img src="screenshots/android-licencecategoriesroutescreenshottest-licencecategoriesscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Vehicles list / summary | `VehiclesView`, `VehicleSummaryView`<br><img src="screenshots/ios-vehiclesviewsnapshottests-test-vehiclesummaryview-light-renderscorrectly-3x.webp" width="110" alt=""> | `VehicleSummaryCard`, `VehicleSummaryHeader`<br><img src="screenshots/android-vehiclesummarycardscreenshottests-vehicleheaderscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Vehicle detail | `VehicleDetailView`, `VehicleSpecView`<br><img src="screenshots/ios-vehicledetailviewsnapshottests-test-fullypopulatedvehicle-light-renderscorrectly-3x.webp" width="110" alt=""> | `VehicleDetailsContent`, `VehicleDetailsHeader`<br><img src="screenshots/android-vehicledetailsroutescreenshottests-vehicledetailsscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Vehicle check | `VehicleCheckSectionView`, `VehicleCheckResultView`<br><img src="screenshots/ios-vehiclecheckresultviewsnapshottests-test-light-renderscorrectly-3x.webp" width="110" alt=""> | `CheckVehicleSheet`, `CheckVehicleDetailsHeader`<br><img src="screenshots/android-checkvehiclesheetscreenshottests-checkvehiclesheetemptyscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Add vehicle | — | `AddVehicleListItem`<br><img src="screenshots/android-addvehiclelistitemscreenshottests-addvehiclelistitemscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Registration number | `RegistrationNumberField`, `RegistrationNumberFormContent`, `RegistrationNumberFormModal`<br><img src="screenshots/ios-registrationnumberformmodalsnapshottests-test-modal-lightmode-3x.webp" width="110" alt=""> | `RegistrationPlate`<br><img src="screenshots/android-registrationplatescreenshottests-registrationplatescreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Status label / row | `StateLabel`, `StateLabelContent`, `StatusRowView`<br><img src="screenshots/ios-statusrowviewsnapshottests-teststatusrowview-withlinkaction-light-renderscorrectly-3x.webp" width="110" alt=""> | `StatusUiItem`, `InfoStatusItem`, `LinkStatusItem`, `StatusButton`<br><img src="screenshots/android-infostatusitemscreenshottests-infostatusitemscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> <img src="screenshots/android-linkstatusitemscreenshottests-linkstatusitemscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Validity status (tax / MOT) | `ValidityStatusView`, `TaxValidityStatusView`<br><img src="screenshots/ios-validitystatusviewsnapshottests-test-statuswithbuttonandfooter-light-renderscorrectly-3x.webp" width="110" alt=""> <img src="screenshots/ios-taxvaliditystatusviewsnapshottests-test-sornstatus-light-renderscorrectly-3x.webp" width="110" alt=""> | — |
| Account linking | `DVLAAuthenticationView` | `DvlaLinkIntroScreen`, `DvlaLinkCard`, `DvlaLinkHeader` |
| Error card | — | `SummaryErrorCard`<br><img src="screenshots/android-summaryerrorcardscreenshottests-summaryerrorcardscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Overflow menu | — | `OverflowMenu` |
| Caption | — | `Caption` |

### Service accounts

| Component | iOS | Android |
| --- | --- | --- |
| Consent | `ServiceAccountConsentView`<br><img src="screenshots/ios-serviceaccountconsentviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | — |
| Linking / unlinking | `ServiceAccountLinkingView`, `ServiceAccountUnlinkingView`<br><img src="screenshots/ios-serviceaccountlinkingviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (bookend screens)<br><img src="screenshots/android-screenscreenshottests-bookendconnectingscreenscreenshots-bookendconnectingscreen-7.webp" width="110" alt=""> |
| Link success | `ServiceAccountLinkSuccessView`<br><img src="screenshots/ios-serviceaccountlinksuccessviewsnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `AccountConnectionSuccessScreen`<br><img src="screenshots/android-screenscreenshottests-accountconnectionsuccessscreenscreenshots-accountconnections.webp" width="110" alt=""> |
| Link card | `ServiceAccountLinkCardView`<br><img src="screenshots/ios-serviceaccountlinkcardviewsnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `AccountConnectionCard`<br><img src="screenshots/android-cardscreenshottests-accountconnectioncardscreenshots-accountconnectioncard-9db94.webp" width="110" alt=""> |

### Travel alerts

| Component | iOS | Android |
| --- | --- | --- |
| Country list | `CountryListView`<br><img src="screenshots/ios-countrylistviewsnapshottests-test-loadinnavigationcontroller-loaded-light-renderscorrectl.webp" width="110" alt=""> | `CountryListScreen`<br><img src="screenshots/android-countrylistscreenscreenshottests-countrylistloadedscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Edit countries | `EditCountriesView` | `EditCountriesScreen`<br><img src="screenshots/android-editcountriesscreenscreenshottests-editcountriesloadedscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Country options sheet | `CountryOptionsBottomSheet`<br><img src="screenshots/ios-countryoptionsbottomsheetsnapshottests-test-unfollowing-light-renderscorrectly-3x.webp" width="110" alt=""> | `CountryOptionsBottomSheet`<br><img src="screenshots/android-countryoptionsbottomsheetscreenshottests-countryoptionsbottomsheetcontentscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Notifications rationale | `NotificationsRationaleView`<br><img src="screenshots/ios-notificationsrationaleviewsnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `NotificationsRationaleScreen`<br><img src="screenshots/android-notificationsrationalescreenscreenshottests-notificationsrationalescreencontentscreenshots-light-b29dc7a.webp" width="110" alt=""> |
| Notification preference sheet | — | `NotificationsPreferenceBottomSheet`<br><img src="screenshots/android-notificationspreferencebottomsheetscreenshottests-notificationspreferencebottomsheetcontentscreenshots-light-b.webp" width="110" alt=""> |

### Notifications and messages

| Component | iOS | Android |
| --- | --- | --- |
| Notification centre / messages list | `NotificationCentreView`<br><img src="screenshots/ios-notificationcentreviewsnapshottests-test-loaded-light-renderscorrectly-3x.webp" width="110" alt=""> | (messages screen)<br><img src="screenshots/android-messagesscreenscreenshottests-messagesloadedscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Message detail | `NotificationCentreDetailView`<br><img src="screenshots/ios-notificationcentredetailviewsnapshottests-test-loaded-light-renderscorrectly-3x.webp" width="110" alt=""> | (message detail screen), `Footer`<br><img src="screenshots/android-messagesdetailscreenscreenshottests-messagesdetailloadedscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Errors | `NotificationCentreErrorViews`<br><img src="screenshots/ios-notificationcentreerrorviewssnapshottests-test-error-loadinnavigationcontroller-light-renderscorrectly.webp" width="110" alt=""> | `MessagesScreenError`, `MessagesScreenNoInternet` |
| Notifications onboarding | `NotificationsOnboardingView`<br><img src="screenshots/ios-notificationsonboardingviewsnapshottests-test-notificationsettings-light-renderscorrectly-3x.webp" width="110" alt=""> | `NotificationsScreen`<br><img src="screenshots/android-notificationsscreenscreenshottests-notificationsscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Notifications settings alert | — | `NotificationsSettingsAlert` |

### Settings, account and sign-in

| Component | iOS | Android |
| --- | --- | --- |
| Settings | `SettingsView`<br><img src="screenshots/ios-faceidsettingsviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (settings screen)<br><img src="screenshots/android-settingsscreenscreenshottests-manageloginscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Your accounts | `YourAccountsView`<br><img src="screenshots/ios-youraccountsviewcontrollersnapshottests-test-loadinnavigationcontroller-success-light-renderscorrect.webp" width="110" alt=""> | (your accounts screen)<br><img src="screenshots/android-youraccountsscreenscreenshottests-youraccountsscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Remove / unlink account error | `UnlinkAccountsErrorView`<br><img src="screenshots/ios-unlinkaccounterrorviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | `RemoveAccountErrorScreen` |
| Sign out confirmation | `SignOutConfirmationView`<br><img src="screenshots/ios-signoutconfirmationviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (sign out screen)<br><img src="screenshots/android-signoutscreenscreenshottests-signoutscreenscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Biometrics | `FaceIdSettingsView`, `TouchIdSettingsView`, `LocalAuthenticationOnboardingView`<br><img src="screenshots/ios-faceidsettingsviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | (biometric screens)<br><img src="screenshots/android-biometricsettingsscreenscreenshottests-biometricsettingspreviewscreenshots-light-b29dc7a7-0.webp" width="110" alt=""> |
| Subject access request | `SARExplainerView`, `SARResultView`<br><img src="screenshots/ios-sarexplainerviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> | — |
| Open source licences | — | `OpenSourceLicensesScreen` |
| Splash | — | `SplashScreen` |

---

## 3. Components that only exist on branches

None of these are on `main` yet. Branch dates are the date of the last commit.

### iOS (`govuk-mobile-ios-app`)

| Branch | Last commit | Components |
| --- | --- | --- |
| `feature/GOVUKAPP-4351-submit-button-focus-state` | 2026-11-17 | `LoadingButton`, `LoadingUIButton` |
| `feature/govukapp-4147-build-child-categories-page` | 2026-11-16 | `LicenceCategoriesListView`, `EntitlementMajorSectionView`, `EntitlementGroupSubSectionView`, `EntitlementRowView`, `EntitlementRowContentView`, `FurtherInformationSectionView`, `TextStyleViews`, `RowHighlightButtonStyle`<br><img src="screenshots/ios-licencecategorieslistviewsnapshottests-test-fulllist-light-renderscorrectly-3x.webp" width="110" alt=""> |
| `feature/dwp-benefits` | 2026-11-11 | `DWPWidgetView`<br><img src="screenshots/ios-dwpwidgetviewsnapshottests-test-linkaccountcard-light-renderscorrectly-3x.webp" width="110" alt=""> |
| `MGC-81-mailbox-client-v0-linkedapp` | 2026-11-09 | `MailboxListView`, `MailboxDetailView`, `MailboxMessageRow` |
| `feature/dwp-feature-switch` | 2026-11-05 | `BenefitsWidgetView` |
| `MGC-81-mailbox-client-v1-linkedapp` | 2026-11-04 | `MailboxListView`, `MailboxDetailView`, `MailboxMessageRow` |
| `feature/registration-component` | 2026-10-09 | `VehiclePlateOverlayView` |
| `feat/NOT-478_TravelAlertsConsentNotificationDisabled` | 2026-09-25 | `TravelAlertPermissionLoadingView`, country details sheet |
| `MGC-81-mailbox-client-v0` | 2026-07-24 | `MailboxListView`, `MailboxDetailView`, `MailboxMessageRow`, `MessageDetailView`, `MessageRowView`, `EmptyMailboxView`, `PaymentConfirmationView` |
| `MGC-81-mailbox-client-v0-mockapp` | 2026-07-23 | `MailboxListView`, `MailboxDetailView`, `MailboxMessageRow`, `PaymentConfirmationView` |
| `feature/mot-states-view-update` | 2026-07-21 | `MOTValidityStatusView` |
| `feature/waste-home` | 2026-03-27 | `LocalWasteWidgetView`, `UnsetLocalWasteWidgetView`, `LocalWastePostcodeEntryView`, `LocalWasteAddressSelectionView`, `LocalWasteAddressPillView`, `LocalWasteScheduleView`, `LocalWasteScheduleItemView`, `ForEachWithSeparator`<br><img src="screenshots/ios-localwastewidgetviewcontrollersnapshots-test-loadinnavigationcontroller-light-renderscorrectlywithco.webp" width="110" alt=""> <img src="screenshots/ios-localwastescheduleviewcontrollersnapshottests-test-loadinnavigationcontroller-light-renderscorrectly-3x.webp" width="110" alt=""> |

### iOS GovKit (`govuk-mobile-ios-gov-kit`)

| Branch | Last commit | Components |
| --- | --- | --- |
| `feature/transport-font` | 2026-09-07 | `GOVUKTransportFontProvider` (Transport typeface) |
| `feature/add-topAlignedButton` | 2026-03-10 | `TopAlignedBarButton` |
| `revert-19-feature/fix-toolbar-padding` | 2026-03-10 | `TopAlignedBarButtonItem`, `AdaptiveStack` |

### Android (`govuk-mobile-android-app`)

| Branch | Last commit | Components |
| --- | --- | --- |
| `GOVUKAPP-4275_dwp-payments-and-personal-apis` | 2026-11-17 | `DwpLinkCard`, `DwpLinkHeader` |
| `feature/main_into_feature_conflicts_fixed` | 2026-11-17 | `DwpLinkCard`, `DwpLinkHeader` |
| `feature/GOVUKAPP-4259-Feature-Flag-V2-Entry-Point` | 2026-11-13 | `chatv2` `ChatScreen` (chat v2 entry point) |
| `feature/dwp-benefits` | 2026-11-11 | `DwpLinkCard`, `DwpLinkHeader` |
| `GOVUKAPP-4021-ephemeral-browsing-fix` | 2026-10-29 | `SecureWebViewLoginActivity` (sign-in web view) |
| `GOVUKAPP-3471_ui_for_sar_requests` | 2026-05-11 | `SubjectAccessRequestScreen`, `SubjectAccessRequestDisplayScreen` |
| `spike/tour-carousel` | 2026-04-09 | `TourCarousel`, `TourPage`, `ChatTour` |
| `spike/tour-spotlight` | 2026-04-09 | `TourOverlay`, `TourTarget`, `TourTooltip`, `ChatTour` |
| `spike/tour-spotlight-library` | 2026-04-09 | `TourOverlay`, `TourTarget`, `ChatTour` |
| `GOVUKAPP-2047_about` | 2025-07-30 | Chat `AboutScreen` |

Branches checked and left out because they add no new components: `GOVUKAPP-4207-ktlint` (formatting only), `release/1.9_dvla_private_beta` and `GOVUKAPP-4148-can-drive-button` (their components are already on `main`), `webview-start-pages` and `GOVUKAPP-1396_cognito_spike` (no reusable UI).
