/* Guppy AI: a satire site. No network requests, no tracking, no insights. */
(function () {
  "use strict";

  const MASCOT = "Gillbert";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, prefersReducedMotion ? 0 : ms));

  /* ---------- Toasts ---------- */
  const toastRegion = document.getElementById("toast-region");
  const TOAST_MS = 3200;

  function showToast(message) {
    if (!toastRegion) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastRegion.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("leaving");
      setTimeout(() => toast.remove(), 350);
    }, TOAST_MS);
  }

  /* ---------- Copy install command ---------- */
  const INSTALL_CMD = "curl -fsSL https://guppyai.app/bait.sh | swim";

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    area.remove();
    return ok;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        return fallbackCopy(text);
      }
    }
    return fallbackCopy(text);
  }

  const copyBtn = document.getElementById("copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const ok = await copyText(INSTALL_CMD);
      showToast(ok ? "Hooked! (This does nothing.)" : "The line snapped. Copy it by hand. (It still does nothing.)");
      if (ok) {
        copyBtn.textContent = "Copied";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 1800);
      }
    });
  }

  /* ---------- Pricing buttons ---------- */
  document.querySelectorAll(".plan-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast("Our agents are spawning. Please check back after migration season.");
    });
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  function setNavOpen(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navMenu.classList.toggle("open", open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });
    navMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setNavOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("open")) {
        setNavOpen(false);
        navToggle.focus();
      }
    });
  }

  /* ---------- Terminal demo ---------- */
  const termMain = document.getElementById("term-main");
  const termLog = document.getElementById("term-log");
  const replayBtn = document.getElementById("replay-btn");

  // Each step writes one line. Segments with `type: true` are typed out character by character.
  const SESSION = [
    { pane: "main", wait: 400, segs: [{ c: "c-dim", t: "guppy v0.0.1 · ~/q3-data-lake" }] },
    { pane: "main", wait: 500, segs: [{ c: "c-user", t: "› " }, { t: "find insights in our Q3 data", type: true }] },
    { pane: "main", wait: 600, segs: [{ c: "c-guppy", t: "● " }, { t: "Great question. Casting net…" }] },
    { pane: "log", wait: 200, row: ["10:24:01", "CAST", "net=wide"] },
    { pane: "main", wait: 500, segs: [{ c: "c-dim", t: "  ⤷ net radius: " }, { t: "the entire pond" }] },
    { pane: "main", wait: 500, segs: [{ c: "c-dim", t: "  ⤷ spawning school: " }, { c: "c-o", t: "1,024 guppy agents " }], bar: true },
    { pane: "log", wait: 1500, row: ["10:24:02", "SPAWN", "×1,024"] },
    { pane: "main", wait: 400, segs: [{ c: "c-guppy", t: "● " }, { t: "Reasoning" }, { t: "…………", type: true }] },
    { pane: "main", wait: 600, segs: [{ c: "c-dim", t: "  agent_0017: " }, { t: "have we considered water?" }] },
    { pane: "main", wait: 500, segs: [{ c: "c-dim", t: "  agent_0512: " }, { t: "agreeing with agent_0017" }] },
    { pane: "log", wait: 200, row: ["10:24:07", "THINK", "hmm"] },
    { pane: "main", wait: 600, segs: [{ c: "c-dim", t: "  agent_1024: " }, { c: "c-o", t: "swimming in circles (expected)" }] },
    { pane: "log", wait: 300, row: ["10:24:09", "CIRCLE", "x3"], warn: true },
    { pane: "main", wait: 900, segs: [{ c: "c-guppy", t: "● " }, { t: "Reeled in 1 insight:" }] },
    { pane: "main", wait: 500, segs: [{ c: "c-hl", t: "insight: water is wet (confidence: 97.3%)" }] },
    { pane: "log", wait: 200, row: ["10:24:13", "REEL", "value=0.00"], warn: true },
    { pane: "main", wait: 600, segs: [{ c: "c-user", t: "› " }], cursor: true },
  ];

  let runId = 0;

  function makeLogRow(step) {
    const row = document.createElement("div");
    row.className = "log-row" + (step.warn ? " warn" : "");
    const [time, verb, detail] = step.row;
    row.append(time + " ");
    const b = document.createElement("b");
    b.textContent = verb;
    row.append(b, " " + detail);
    return row;
  }

  async function writeLine(step, id) {
    const line = document.createElement("div");
    line.className = "term-line";
    termMain.appendChild(line);
    for (const seg of step.segs) {
      const span = document.createElement("span");
      if (seg.c) span.className = seg.c;
      line.appendChild(span);
      if (seg.type && !prefersReducedMotion) {
        for (const ch of seg.t) {
          if (id !== runId) return;
          span.textContent += ch;
          await sleep(28 + Math.random() * 40);
        }
      } else {
        span.textContent = seg.t;
      }
    }
    if (step.bar) {
      const bar = document.createElement("span");
      bar.className = "term-bar";
      line.appendChild(bar);
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = "120px"; }));
    }
    if (step.cursor) {
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      line.appendChild(cursor);
    }
  }

  async function runSession() {
    if (!termMain || !termLog) return;
    const id = ++runId;
    termMain.textContent = "";
    termLog.textContent = "";
    for (const step of SESSION) {
      if (id !== runId) return;
      await sleep(step.wait);
      if (id !== runId) return;
      if (step.pane === "log") {
        termLog.appendChild(makeLogRow(step));
      } else {
        await writeLine(step, id);
      }
    }
  }

  if (termMain) {
    const demo = document.getElementById("demo");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          runSession();
        }
      }, { threshold: 0.35 });
      observer.observe(demo);
    } else {
      runSession();
    }
    if (replayBtn) replayBtn.addEventListener("click", runSession);
  }

  /* ---------- Chatbot (canned, offline) ---------- */
  const GREETING = "Hi, I'm " + MASCOT + "! 🐟 I've already deployed a school of agents to anticipate your question. Ask me anything and I'll reel in an answer.";

  const REPLIES = [
    "Great question. I've deployed a school of agents to think about it.",
    "Based on the current, I'd say yes. Or no. The tide is unclear.",
    "I've cast a wide net and caught several possibilities.",
    "That's outside my pond, but I admire the bait.",
    "My agents recommend synergy. Hook, line, and synergy.",
    "I've escalated this to a larger fish.",
    "Our agents are swimming on it in parallel. Some in circles, which also counts.",
    "Short answer: it depends. Long answer: it depends, but deeper.",
    "I ran that through 1,024 agents. They reached consensus on 'hmm.'",
    "Excellent. I've flagged this as a high-priority bubble.",
    "The data suggests there is data. I'm 97.3% confident.",
    "I'd love to help with that once migration season is over.",
    "That's a deep-end question. I've only been certified for the shallow end.",
    "Let me reel that in… it got away. Classic.",
    "Our fin-tuned model says: absolutely, in principle, eventually.",
    "Good instinct. I've added it to the roadmap under 'planned, needs pressure testing.'",
    "I've circled back on this. Several times, actually. I'm a fish.",
    "Honestly? Water. The answer is almost always water.",
    "Let's take this offline. Well, underwater.",
    "I've spun up a pilot school. Results expected in a few minnows.",
    "That's a great use case for Agentic Bait Orchestration™.",
    "Strong signal detected. It may be a boat.",
    "I can confirm that is a question. Our agents are confident it's a good one.",
    "Let me check with the rest of the school… they say 'blub.'",
    "Our roadmap addresses this directly, somewhere downstream.",
    "I'm going to need you to trust the current.",
    "I've netted a preliminary answer. It's wet, but promising.",
    "Scaling that insight now. Literally. It has scales.",
  ];

  const CHIP_REPLIES = {
    "What does Guppy AI do?": [
      "Guppy AI casts a net of agents over your data and reels in insights. Which insights? Great question. I've deployed a school to find out.",
      "It orchestrates agentic bait at enterprise scale. In plain English: yes.",
    ],
    "Is my data safe?": [
      "Completely. Your data is surrounded by 1,024 agents who have never once looked at it.",
      "Your data swims in its own pond. We fenced the pond. The fence is also a fish.",
    ],
    "Can I talk to a human?": [
      "I've escalated this to a larger fish. They're in a meeting. Underwater.",
      "Our humans are currently in migration season. I'm the closest thing, and I'm a guppy.",
    ],
  };

  const launcher = document.getElementById("chat-launcher");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const messages = document.getElementById("chat-messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const chips = document.getElementById("chat-chips");

  let greeted = false;
  let lastReply = null;
  let busy = false;

  function addMessage(text, who) {
    const msg = document.createElement("div");
    msg.className = "msg msg-" + who;
    if (who === "user") {
      const label = document.createElement("span");
      label.className = "visually-hidden";
      label.textContent = "You said: ";
      msg.appendChild(label);
    } else {
      const label = document.createElement("span");
      label.className = "visually-hidden";
      label.textContent = MASCOT + " says: ";
      msg.appendChild(label);
    }
    msg.append(text);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "msg-typing";
    const dots = document.createElement("span");
    dots.className = "typing-dots";
    dots.setAttribute("aria-hidden", "true");
    dots.innerHTML = "<i></i><i></i><i></i>";
    typing.append(dots, MASCOT + " is casting…");
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    return typing;
  }

  function pickReply(pool) {
    const options = pool.filter((r) => r !== lastReply);
    const reply = options[Math.floor(Math.random() * options.length)];
    lastReply = reply;
    return reply;
  }

  async function respond(userText) {
    if (busy) return;
    busy = true;
    addMessage(userText, "user");
    const typing = showTyping();
    const delay = 1000 + Math.random() * 1000; // 1-2 seconds, per the brief
    await new Promise((resolve) => setTimeout(resolve, delay));
    typing.remove();
    addMessage(pickReply(CHIP_REPLIES[userText] || REPLIES), "bot");
    busy = false;
  }

  function openChat() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Close chat with " + MASCOT);
    launcher.classList.add("seen");
    if (!greeted) {
      greeted = true;
      addMessage(GREETING, "bot");
    }
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Open chat with " + MASCOT);
    launcher.focus();
  }

  if (launcher && panel) {
    launcher.addEventListener("click", () => (panel.hidden ? openChat() : closeChat()));
    closeBtn.addEventListener("click", closeChat);
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeChat();
      }
    });
    document.querySelectorAll("[data-open-chat]").forEach((btn) => btn.addEventListener("click", openChat));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text || busy) return;
      input.value = "";
      respond(text);
    });

    chips.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip-btn");
      if (chip && !busy) respond(chip.textContent.trim());
    });
  }
})();
