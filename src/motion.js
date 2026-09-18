// Every timing value in the app. One file so the interactions feel like one
// system, and so a single edit can retune the whole thing.

// How long the input sits idle before the dictionary is searched. Long enough
// that a fast typist triggers one search rather than eleven, short enough that
// it still feels like live results.
export const SEARCH_DEBOUNCE = 120;

// A letter tile landing in the rack.
export const TILE_SPRING = {
  type: "spring",
  stiffness: 520,
  damping: 24,
  mass: 0.7
};

// Result groups entering. Staggered by index so the longest words — the ones
// worth having — arrive last and draw the eye down the list.
export const GROUP_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 30
};

export const GROUP_STAGGER = 0.045;

export const INTRO = { duration: 0.4, ease: "easeOut" };

export const FADE = { duration: 0.18, ease: "easeOut" };
