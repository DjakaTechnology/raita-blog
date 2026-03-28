"use client";

import { useEffect } from "react";

export default function CodeCopyButton() {
  useEffect(() => {
    const pres = document.querySelectorAll(".wiki-content pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.className = "code-copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = (code || pre).textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2000);
        });
      });
      wrapper.appendChild(btn);
    });
  }, []);

  return null;
}
