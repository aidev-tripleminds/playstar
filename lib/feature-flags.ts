// Language/translation UI is hidden until translations ship (BACK-5).
// Flip this back on to restore it — see BACK-137.
export const LANGUAGE_FEATURE_ENABLED = false;

// Skip-queue generate CTA is postponed (FRONT-655). Flip this back on to restore
// the prompt toggle, auto skip in Advanced settings, queued-card skip, and
// template skip-queue actions.
export const SKIP_QUEUE_FEATURE_ENABLED = false;

/**
 * FRONT-657: unfinished side-nav destinations (Feed, Dreambooth, Storyboard,
 * My AI Twin, Profile, Rewards). Flip on to restore the links.
 */
export const SIDE_NAV_PREVIEW_LINKS_ENABLED = false;

/**
 * FRONT-657: buy-premium countdown tile in homepage / explore grids.
 * Flip on to restore the card.
 */
export const HOMEPAGE_PREMIUM_COUNTDOWN_CARD_ENABLED = false;

/**
 * Creates a permanently unresolved dummy checkout that blocks account deletion.
 * Enable only for deliberate development testing; recovery requires the
 * brand-wide dummy-payment purge or a database reset.
 */
export const DUMMY_REQUIRES_ACTION_ENABLED = false;

/**
 * Minimal character profile (`/ai`, `/ai/:characterId`). Hidden until the page
 * is ready to ship. Flip on to publish it.
 */
export const MINIMAL_PROFILE_ENABLED = false;

/**
 * Navigation v2 (the app sidebar and `/nav-staging`). Hidden until the new
 * navigation is ready to ship. Flip on to publish it.
 */
export const NAVIGATION_V2_ENABLED = false;

/**
 * OMNI-537: generator tutorial (the prompt box info button and the Tutorial row
 * in Advanced settings). Hidden until each checkpoint has its own tutorial.
 * Flip on to restore it.
 */
export const GENERATE_TUTORIAL_ENABLED = false;
