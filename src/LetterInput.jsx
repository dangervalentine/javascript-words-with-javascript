import React from "react";
import { AnimatePresence, motion } from "motion/react";

import { MAX_LETTERS, BLANK } from "./helper";
import { TILE_SPRING, FADE } from "./motion";

const LetterInput = React.forwardRef(function LetterInput(
  { value, onChange, onClear },
  ref
) {
  const letters = [...value];
  const remaining = MAX_LETTERS - letters.length;

  return (
    <div className="letter-input">
      <div className="input-shell">
        <input
          ref={ref}
          type="text"
          className="letters-field"
          value={value}
          onChange={event => onChange(event.target.value)}
          maxLength={MAX_LETTERS}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          inputMode="text"
          aria-label={`Your letters, up to ${MAX_LETTERS}. Use ? for a blank tile.`}
          placeholder={`your letters — ? for a blank`}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              className="clear-button"
              onClick={onClear}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={FADE}
              aria-label="Clear letters (Esc)"
              title="Clear (Esc)"
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
              className={`tile ${letter === BLANK ? "tile-blank" : ""}`}
              layout
              initial={{ opacity: 0, scale: 0.4, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.4, y: 6 }}
              transition={TILE_SPRING}
            >
              {letter}
            </motion.span>
          ))}
          {/* Empty slots show how many tiles are still free. */}
          {Array.from({ length: Math.max(0, remaining) }, (_, i) => (
            <motion.span
              key={`slot-${i}`}
              className="tile tile-empty"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default LetterInput;
