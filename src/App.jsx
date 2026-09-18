import React from "react";
import { AnimatePresence, motion } from "motion/react";

import Header from "./Header";
import LetterInput from "./LetterInput";
import ResultGroup from "./ResultGroup";
import EmptyState from "./EmptyState";
import { GithubAttribution } from "./GithubAttribution";
import { search, normalise, loadIndex } from "./helper";
import { SEARCH_DEBOUNCE, INTRO, FADE } from "./motion";
import "./App.css";

const EMPTY = { letters: "", groups: [], total: 0, ms: 0, blanks: 0 };

export default function App() {
  const [letters, setLetters] = React.useState("");
  const [result, setResult] = React.useState(EMPTY);
  const [size, setSize] = React.useState(0);
  const [copied, setCopied] = React.useState(null);
  const [stuck, setStuck] = React.useState(false);
  const inputRef = React.useRef(null);

  const query = normalise(letters);

  // Warm the dictionary on mount so the first search is as fast as the rest.
  React.useEffect(() => {
    let live = true;
    loadIndex().then(index => live && setSize(index.size));
    return () => {
      live = false;
    };
  }, []);

  // Focus the field on load, but only with a real pointer — autofocus on a
  // phone throws up the keyboard before anyone has asked for it.
  React.useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches) inputRef.current?.focus();
  }, []);

  // Debounced so a fast typist triggers one scan rather than one per key.
  React.useEffect(() => {
    if (!query) {
      setResult(EMPTY);
      return;
    }
    let live = true;
    const timer = window.setTimeout(() => {
      search(query).then(next => live && setResult(next));
    }, SEARCH_DEBOUNCE);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  // Esc clears from anywhere; typing a letter anywhere jumps into the field,
  // so the input never has to be hunted for.
  React.useEffect(() => {
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") {
        setLetters("");
        inputRef.current?.focus();
        return;
      }
      if (
        /^[a-zA-Z?]$/.test(event.key) &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // The search bar only grows a border once it is actually pinned.
  React.useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function copyWord(word) {
    navigator.clipboard?.writeText(word).catch(() => {});
    setCopied(word);
    window.setTimeout(
      () => setCopied(current => (current === word ? null : current)),
      900
    );
  }

  function pickExample(example) {
    setLetters(example);
    inputRef.current?.focus();
  }

  const settled = result.letters === query;
  const showEmptyState = !query;
  const showNoMatches = Boolean(query) && settled && result.total === 0;

  return (
    <div className="app">
      <Header />

      <div className={`search-bar ${stuck ? "stuck" : ""}`}>
        <LetterInput
          ref={inputRef}
          value={query}
          onChange={setLetters}
          onClear={() => {
            setLetters("");
            inputRef.current?.focus();
          }}
        />

        <motion.p
          className="summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={INTRO}
          aria-live="polite"
        >
          {!query ? (
            size ? (
              <>{size.toLocaleString()} words ready</>
            ) : (
              <>Loading dictionary…</>
            )
          ) : !settled ? (
            <>Searching…</>
          ) : result.total > 0 ? (
            <>
              <strong>{result.total.toLocaleString()}</strong> words
              <span className="summary-time"> · {Math.round(result.ms)}ms</span>
            </>
          ) : (
            <>No words from these letters</>
          )}
        </motion.p>
      </div>

      <main className="main">
        <AnimatePresence mode="wait">
          {showEmptyState ? (
            <EmptyState key="empty" onPick={pickExample} />
          ) : showNoMatches ? (
            <motion.div
              key="none"
              className="no-matches"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={FADE}
            >
              <p>Nothing playable from those letters.</p>
              <p className="no-matches-hint">
                Try swapping one, or add <kbd>?</kbd> as a blank.
              </p>
            </motion.div>
          ) : (
            <motion.div key={result.letters} className="groups">
              {result.groups.map((group, i) => (
                <ResultGroup
                  key={group.length}
                  index={i}
                  length={group.length}
                  words={group.words}
                  copied={copied}
                  onCopy={copyWord}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <GithubAttribution />
    </div>
  );
}
