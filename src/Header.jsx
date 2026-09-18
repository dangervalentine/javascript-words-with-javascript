import React from "react";
import { motion } from "motion/react";

import logo from "./logo.svg";
import { INTRO } from "./motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={INTRO}
    >
      <img className="logo" src={logo} alt="" aria-hidden="true" />
      <div className="header-text">
        <h1 className="title">
          Words With <span className="title-accent">JavaScript</span>
        </h1>
        <a
          className="credit"
          href="https://github.com/dangervalentine"
          target="_blank"
          rel="noopener noreferrer"
        >
          by Danger Valentine
        </a>
      </div>
    </motion.header>
  );
}
