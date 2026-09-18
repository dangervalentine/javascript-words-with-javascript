import React from "react";
import { AnimatePresence, motion } from "motion/react";

import { MAX_LETTERS } from "./helper";
import { TILE_SPRING, FADE } from "./motion";

export default function LetterInput({ value, onChange, onClear }) {
  const inputRef = React.useRef(null);
  const letters = [...value];

  return (
    <div className="letter-input">
      <div className="input-shell">
        <input
          ref={inputRef}
          type="text"
          className="letters-field"
          value={value}
          onChange={event => onChange(event.target.value)}
          maxLength={MAX_LETTERS}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          aria-label={`Your letters, up to ${MAX_LETTERS}`}
          placeholder={`enter up to ${MAX_LETTERS} letters`}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              className="clear-button"
              onClick={() => {
                onClear();
                inputRef.current?.focus();
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={FADE}
              aria-label="Clear letters"
            >
              ×
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* The rack mirrors what you typed as physical tiles, so the letters you
          are holding stay visible while you read the results. */}
      <div className="rack" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          {letters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              className="tile"
              layout
              initial={{ opacity: 0, scale: 0.4, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.4, y: 6 }}
              transition={TILE_SPRING}
            >
              {letter}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
