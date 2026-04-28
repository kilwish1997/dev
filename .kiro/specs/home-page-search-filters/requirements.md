# Requirements Document

## Introduction

This feature enhances the Home page (`/`) of the **Local Shops Finder** React application by adding a real-time search bar and a richer set of filters. Currently the page shows nearby places fetched from OpenStreetMap, grouped by category, with only a distance dropdown and a table/map view toggle. Users must scroll through all results to find a specific place. The goal is to let users quickly narrow results by name, type, or address, and to sort or filter by additional criteria such as opening-hours availability and alphabetical/distance ordering — without triggering a new API call.

All filtering and sorting described here operates **client-side** on the already-fetched `shops` array. No new network requests are introduced by this feature.

---

## Glossary

- **Search_Bar**: The text input component rendered above the filters bar that accepts free-text queries.
- **Filter_Panel**: The existing filters bar extended with the new filter controls (opening-hours toggle, sort selector).
- **Active_Filters**: The combined set of values currently applied: search query, distance, opening-hours toggle, and sort order.
- **Filtered_List**: The subset of fetched shops that satisfies all Active_Filters, in the order determined by the sort option.
- **Shop**: A place object returned by the Overpass API and stored in the `shops` state array, containing at minimum `name`, `shopType`, `address`, `distance`, and `openingHours` fields.
- **Open_Now**: A Shop whose `openingHours` field contains a parseable OSM opening-hours string that covers the current local day and time. Shops with `openingHours === 'Not available'` are treated as unknown and excluded when the filter is active.
- **Result_Count**: The integer count of Shops in the Filtered_List, displayed in the page header.
- **Sort_Order**: One of three options — `nearest` (ascending distance), `alphabetical` (ascending name), or `relevance` (default fetch order, i.e. nearest first as returned by the existing `filterShops` sort).

---

## Requirements

### Requirement 1: Real-Time Search Bar

**User Story:** As a user, I want to type a search query and immediately see only the shops whose name, type, or address matches my query, so that I can find a specific place without scrolling through all results.

#### Acceptance Criteria

1. THE Search_Bar SHALL be rendered as a visible text input above the Filter_Panel on the Home page.
2. WHEN the user types in the Search_Bar, THE Search_Bar SHALL update the Filtered_List within 300 ms without triggering a new Overpass API request.
3. WHEN evaluating a search query, THE Search_Bar SHALL match Shops whose `name`, `shopType`, or `address` field contains the query string as a case-insensitive substring.
4. WHEN the search query is an empty string, THE Search_Bar SHALL include all Shops that satisfy the remaining Active_Filters in the Filtered_List.
5. THE Search_Bar SHALL display a placeholder text of "Search by name, type or address…" when empty.
6. WHEN the user clicks a clear button rendered inside the Search_Bar, THE Search_Bar SHALL reset the query to an empty string and restore focus to the input.
7. IF the Filtered_List is empty after applying the search query, THEN THE Search_Bar SHALL cause the results area to display the message "No results match your search. Try a different keyword or adjust your filters."

---

### Requirement 2: Opening-Hours Availability Filter

**User Story:** As a user, I want to filter results to show only places that are open right now, so that I do not waste time navigating to a closed shop.

#### Acceptance Criteria

1. THE Filter_Panel SHALL render an "Open Now" toggle control alongside the existing distance selector.
2. WHEN the "Open Now" toggle is inactive, THE Filter_Panel SHALL include all Shops regardless of their `openingHours` value in the Filtered_List.
3. WHEN the "Open Now" toggle is active, THE Filter_Panel SHALL include only Open_Now Shops in the Filtered_List.
4. WHEN the "Open Now" toggle is active and a Shop's `openingHours` value is `'Not available'`, THE Filter_Panel SHALL exclude that Shop from the Filtered_List.
5. WHEN the "Open Now" toggle state changes, THE Filter_Panel SHALL update the Filtered_List within 300 ms without triggering a new Overpass API request.

---

### Requirement 3: Sort Order Control

**User Story:** As a user, I want to sort the results by distance or alphabetically, so that I can browse places in the order most useful to me.

#### Acceptance Criteria

1. THE Filter_Panel SHALL render a sort selector offering the options: "Nearest First", "A → Z", and "Z → A".
2. WHEN the sort selector value is "Nearest First", THE Filter_Panel SHALL order the Filtered_List by ascending `distance`.
3. WHEN the sort selector value is "A → Z", THE Filter_Panel SHALL order the Filtered_List by ascending `name` using locale-aware string comparison.
4. WHEN the sort selector value is "Z → A", THE Filter_Panel SHALL order the Filtered_List by descending `name` using locale-aware string comparison.
5. WHEN the sort selector value changes, THE Filter_Panel SHALL reorder the Filtered_List within 300 ms without triggering a new Overpass API request.
6. THE Filter_Panel SHALL default the sort selector to "Nearest First" on page load and after each new category or distance fetch.

---

### Requirement 4: Active Filter Summary and Reset

**User Story:** As a user, I want to see a summary of my active filters and reset them all at once, so that I can quickly return to the full unfiltered list.

#### Acceptance Criteria

1. WHEN at least one of the following is true — the search query is non-empty, the "Open Now" toggle is active, or the sort order is not "Nearest First" — THE Filter_Panel SHALL display a "Clear all filters" button.
2. WHEN the user activates the "Clear all filters" button, THE Filter_Panel SHALL reset the search query to empty, the "Open Now" toggle to inactive, and the sort order to "Nearest First".
3. WHEN no Active_Filters deviate from their defaults, THE Filter_Panel SHALL hide the "Clear all filters" button.

---

### Requirement 5: Result Count Display

**User Story:** As a user, I want to see how many results are currently shown after filtering, so that I know whether my filters are too restrictive.

#### Acceptance Criteria

1. THE Home_Page SHALL display the Result_Count in the header as "{n} shops found near you in {city}".
2. WHEN the Filtered_List changes due to any Active_Filter update, THE Home_Page SHALL update the Result_Count display within 300 ms.
3. WHEN the Result_Count is zero, THE Home_Page SHALL display "0 shops found near you in {city}" in the header.

> **Note:** Requirement 5.1–5.3 formalises the existing header behaviour and extends it to reflect the Filtered_List count (post-search/filter) rather than the raw fetched count.

---

### Requirement 6: Filter State Persistence Across View Modes

**User Story:** As a user, I want my search and filter choices to remain active when I switch between Table View and Map View, so that I do not have to re-enter them after toggling the view.

#### Acceptance Criteria

1. WHEN the user switches between Table View and Map View, THE Home_Page SHALL preserve the current search query, "Open Now" toggle state, and sort order without resetting them.
2. WHILE Map View is active, THE Home_Page SHALL render only the Filtered_List markers on the map, applying the same Active_Filters as the Table View.

---

### Requirement 7: Accessibility of Search and Filter Controls

**User Story:** As a user relying on keyboard navigation or a screen reader, I want the search bar and new filter controls to be fully accessible, so that I can use them without a mouse.

#### Acceptance Criteria

1. THE Search_Bar SHALL have an associated `<label>` element or `aria-label` attribute with the text "Search shops".
2. THE Search_Bar clear button SHALL have an `aria-label` attribute with the text "Clear search".
3. THE Filter_Panel "Open Now" toggle SHALL have an `aria-pressed` attribute that reflects its current boolean state.
4. THE Filter_Panel sort selector SHALL have an associated `<label>` element or `aria-label` attribute with the text "Sort by".
5. WHEN the user presses the Escape key while the Search_Bar is focused, THE Search_Bar SHALL clear the current query and remove focus from the input.
