import React from "react";
import { motion } from "motion/react";

import { GROUP_SPRING } from "./motion";

// Letter sets that show off something specific: a short one, the README's own
// worked example, a long one, and one that teaches the blank tile.
const EXAMPLES = [
  { letters: "palm", note: "short" },
  { letters: "really", note: "the classic" },
  { letters: "stationed", note: "nine letters" },
  { letters: "friend?", note: "with a blank" }
];

export default function EmptyState({ onPick }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={GROUP_SPRING}
    >
      <p className="empty-lead">
        Type the letters you are holding and every word you can build from them
        appears below, longest first.
      </p>

      <div className="examples">
        <span className="examples-label">Try</span>
        <div className="examples-row">
          {EXAMPLES.map(example => (
            <button
              key={example.letters}
              type="button"
              className="example"
              onClick={() => onPick(example.letters)}
            >
              <span className="example-letters">{example.letters}</span>
              <span className="example-note">{example.note}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="tips">
        <li>
          <kbd>?</kbd> stands in for a blank tile — any single letter
        </li>
        <li>
          <kbd>Esc</kbd> clears the rack, or just start typing anywhere
        </li>
        <li>Click any word to copy it</li>
      </ul>
    </motion.div>
  );
}
