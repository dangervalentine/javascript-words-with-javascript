import React from "react";
import { motion } from "motion/react";

import { GROUP_SPRING, GROUP_STAGGER } from "./motion";

// Above this, a group renders as flowing text instead of individual chips.
// Short-word groups can run to thousands of entries, and thousands of DOM
// nodes is the difference between instant and janky.
const CHIP_LIMIT = 400;

export default function ResultGroup({ length, words, index }) {
  const asChips = words.length <= CHIP_LIMIT;

  return (
    <motion.section
      className="group"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...GROUP_SPRING, delay: index * GROUP_STAGGER }}
    >
      <header className="group-head">
        <h2 className="group-length">
          {length} <span className="group-length-unit">letters</span>
        </h2>
        <span className="group-count">{words.length.toLocaleString()}</span>
      </header>

      {asChips ? (
        <ul className="word-list">
          {words.map(word => (
            <li key={word} className="word">
              {word}
            </li>
          ))}
        </ul>
      ) : (
        <p className="word-run">{words.join(", ")}</p>
      )}
    </motion.section>
  );
}
