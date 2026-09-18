import React from "react";
import { AnimatePresence, motion } from "motion/react";

import Header from "./Header";
import LetterInput from "./LetterInput";
import ResultGroup from "./ResultGroup";
import { search, normalise, loadIndex } from "./helper";
import { SEARCH_DEBOUNCE, INTRO, FADE } from "./motion";
import "./App.css";

const EMPTY = { letters: "", groups: [], total: 0, ms: 0 };

export default function App() {
  const [letters, setLetters] = React.useState("");
  const [result, setResult] = React.useState(EMPTY);
  const [size, setSize] = React.useState(0);

  const query = normalise(letters);

  // Warm the dictionary on mount so the first search is as fast as the rest.
  React.useEffect(() => {
    let live = true;
    loadIndex().then(index => live && setSize(index.size));
    return () => {
      live = false;
    };
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

  const settled = result.letters === query;
  const showEmpty = Boolean(query) && settled && result.total === 0;

  return (
    <div className="app">
      <Header />

      <main className="main">
        <LetterInput
          value={query}
          onChange={setLetters}
          onClear={() => setLetters("")}
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
              <>Searching {size.toLocaleString()} words</>
            ) : (
              <>Loading dictionary…</>
            )
          ) : !settled ? (
            <>Searching…</>
          ) : result.total > 0 ? (
            <>
              <strong>{result.total.toLocaleString()}</strong> words from these
              letters{" "}
              <span className="summary-time">· {Math.round(result.ms)}ms</span>
            </>
          ) : (
            <>No words from these letters</>
          )}
        </motion.p>

        <AnimatePresence mode="wait">
          {showEmpty ? (
            <motion.p
              key="none"
              className="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={FADE}
            >
              Nothing playable. Try swapping a letter.
            </motion.p>
          ) : (
            <motion.div key={result.letters} className="groups">
              {result.groups.map((group, i) => (
                <ResultGroup
                  key={group.length}
                  index={i}
                  length={group.length}
                  words={group.words}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
