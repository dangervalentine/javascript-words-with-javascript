const A = 97; // "a"
const ALPHABET_SIZE = 26;

// The input caps at 11 letters, so nothing longer can ever match.
export const MAX_LETTERS = 11;

// Stands in for a blank tile — it can become any single letter.
export const BLANK = "?";

// The dictionary is a 2.4MB static asset, fetched rather than bundled. Inlined
// into the JS it blocked first paint; as a separate file the shell renders
// immediately and the browser caches the dictionary on its own.
const DICTIONARY_URL = `${import.meta.env.BASE_URL}dictionary.json`;

// Built once, on first load, and reused for every keystroke after.
//
// The rule is unchanged — a word matches when it needs no more of any letter
// than you hold — but the per-word letter counts are precomputed here instead
// of being rebuilt on every comparison. The original recomputed a 26-key
// object for all ~170,000 words on every single keystroke.
//
// Counts live in one flat Uint8Array of 26 slots per word rather than an array
// of objects: one allocation instead of ~170,000, and the comparison loop
// walks contiguous memory.
let indexPromise = null;

function buildIndex(words) {
  const playable = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length > MAX_LETTERS) continue;
    // Skip anything with punctuation; the original produced NaN counts for
    // those and silently mismatched.
    if (!/^[a-z]+$/.test(word)) continue;
    playable.push(word);
  }

  const counts = new Uint8Array(playable.length * ALPHABET_SIZE);
  for (let i = 0; i < playable.length; i++) {
    const base = i * ALPHABET_SIZE;
    const word = playable[i];
    for (let j = 0; j < word.length; j++) {
      counts[base + (word.charCodeAt(j) - A)] += 1;
    }
  }

  return { playable, counts, size: words.length };
}

export function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(DICTIONARY_URL)
      .then(response => {
        if (!response.ok) throw new Error(`dictionary ${response.status}`);
        return response.json();
      })
      .then(data => buildIndex(data.dictionary));
  }
  return indexPromise;
}

export function normalise(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z?]/g, "")
    .slice(0, MAX_LETTERS);
}

/**
 * Finds every word playable from `raw`. `?` is a blank tile and can stand in
 * for any one letter.
 *
 * Groups come back longest-first, since the long words are the ones worth
 * finding. Words that needed a blank are flagged so the UI can mark them.
 */
export async function search(raw) {
  const letters = normalise(raw);
  if (!letters) return { letters: "", groups: [], total: 0, ms: 0, blanks: 0 };

  const { playable, counts } = await loadIndex();
  const started = performance.now();

  const held = new Uint8Array(ALPHABET_SIZE);
  let blanks = 0;
  for (let i = 0; i < letters.length; i++) {
    const ch = letters[i];
    if (ch === BLANK) blanks += 1;
    else held[ch.charCodeAt(0) - A] += 1;
  }

  const byLength = new Map();
  let total = 0;

  for (let i = 0; i < playable.length; i++) {
    const word = playable[i];
    if (word.length > letters.length) continue;

    const base = i * ALPHABET_SIZE;
    // How many letters the word needs that we are not holding. Blanks cover
    // that shortfall, one letter each.
    let deficit = 0;
    let fits = true;
    for (let c = 0; c < ALPHABET_SIZE; c++) {
      const short = counts[base + c] - held[c];
      if (short > 0) {
        deficit += short;
        if (deficit > blanks) {
          fits = false;
          break;
        }
      }
    }
    if (!fits) continue;

    let bucket = byLength.get(word.length);
    if (!bucket) byLength.set(word.length, (bucket = []));
    bucket.push(deficit > 0 ? { word, blank: true } : { word, blank: false });
    total += 1;
  }

  const groups = [...byLength.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([length, list]) => ({ length, words: list }));

  return { letters, groups, total, blanks, ms: performance.now() - started };
}
