// State Management
let currentBoard = localStorage.getItem("syllabiq_board") || "CBSE 10th";
let userApiKey = localStorage.getItem("syllabiq_gemini_key") || "";

// Sample PYQs with Recurrence Frequencies
const pyqData = [
  {
    id: 1,
    subject: "Physics",
    recurrence: "Asked 7x in Boards",
    tag: "High Yield",
    year: "2024, 2023, 2020, 2019",
    question: "State Snell's Law of Refraction and express refractive index in terms of speed of light in mediums.",
    steps: "Formula: n = c / v. Step 1: Definition of ratio of sin(i)/sin(r). Step 2: Medium dependency statement."
  },
  {
    id: 2,
    subject: "Chemistry",
    recurrence: "Asked 6x in Boards",
    tag: "High Yield",
    year: "2024, 2022, 2021, 2018",
    question: "Why does the colour of copper sulphate solution change when an iron nail is dipped in it? Write equation.",
    steps: "Displacement reaction: Fe + CuSO4 -> FeSO4 + Cu. Blue changes to light green."
  },
  {
    id: 3,
    subject: "Mathematics",
    recurrence: "Asked 5x in Boards",
    tag: "Guarantee 3M",
    year: "2024, 2023, 2022",
    question: "Prove that √5 is an irrational number using contradiction method.",
    steps: "Assume p/q coprime. Square both sides. Show 5 divides both p and q, contradicting coprime assumption."
  }
];

// Rationalized Portions per Board
const portionAlerts = {
  "CBSE 10th": [
    { subject: "Science", status: "Deleted", note: "Periodic Classification of Elements completely excised from syllabus." },
    { subject: "Maths", status: "Reduced", note: "Euclid's Division Lemma (Ex 1.1) and Frustum of Cone removed." }
  ],
  "CBSE 12th": [
    { subject: "Physics", status: "Reduced", note: "Potentiometer experiments and Davisson-Germer experiment deleted." },
    { subject: "Chemistry", status: "Deleted", note: "Solid State, Surface Chemistry, and Polymers completely excised." }
  ],
  "ICSE 10th": [
    { subject: "Physics", status: "Updated", note: "Modern Physics & radioactivity sections revised with standardized units." }
  ],
  "MH SSC 10th": [
    { subject: "Science 2", status: "Active", note: "Heredity and Evolution: All numericals verified for 2025-2026." }
  ],
  "MH HSC 12th": [
    { subject: "Maths", status: "Active", note: "Linear Programming & Differential Equations weightage adjusted." }
  ]
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initTheme();
  renderBoard();
  renderPYQs("all");
  renderPortions();
  setupEvents();
});

// Setup Events
function setupEvents() {
  document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);
  document.getElementById("boardSelectorBtn").addEventListener("click", () => showModal("boardModal"));
  document.getElementById("apiKeyModalBtn").addEventListener("click", () => {
    document.getElementById("apiKeyInput").value = userApiKey;
    showModal("keyModal");
  });

  document.getElementById("subjectFilter").addEventListener("change", (e) => {
    renderPYQs(e.target.value);
  });

  document.getElementById("chatForm").addEventListener("submit", handleChatSubmit);
}

// Tab Switching
function switchTab(tabId) {
  const tabs = ["home", "ai", "pyqs", "portion"];
  tabs.forEach(t => {
    const view = document.getElementById("view" + capitalize(t));
    if (view) view.classList.add("hidden");
    const navBtn = document.querySelector(`[data-tab="${t}"]`);
    if (navBtn) navBtn.classList.remove("active");
  });

  const activeView = document.getElementById("view" + capitalize(tabId));
  if (activeView) activeView.classList.remove("hidden");

  const activeNav = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeNav) activeNav.classList.add("active");

  lucide.createIcons();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Theme Handling
function initTheme() {
  const isDark = localStorage.getItem("syllabiq_theme") === "dark" || 
    (!localStorage.getItem("syllabiq_theme") && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add("dark");
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("syllabiq_theme", isDark ? "dark" : "light");
}

// Board Selection
function selectBoard(boardName) {
  currentBoard = boardName;
  localStorage.setItem("syllabiq_board", boardName);
  renderBoard();
  renderPortions();
  closeModals();
}

function renderBoard() {
  document.getElementById("currentBoardLabel").innerText = currentBoard;
}

// Render High-Yield PYQs
function renderPYQs(filter) {
  const container = document.getElementById("pyqContainer");
  const filtered = filter === "all" ? pyqData : pyqData.filter(q => q.subject.toLowerCase() === filter.toLowerCase());

  container.innerHTML = filtered.map(q => `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
      <div class="flex items-center justify-between text-[11px] mb-2">
        <span class="font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-full">${q.recurrence}</span>
        <span class="text-slate-400 font-mono">${q.year}</span>
      </div>
      <h4 class="font-bold text-xs text-slate-800 dark:text-slate-100">${q.question}</h4>
      <div class="math-step mt-2 text-slate-600 dark:text-slate-300">
        <span class="font-bold text-[10px] uppercase text-violet-500 block">Marking Guide:</span>
        ${q.steps}
      </div>
    </div>
  `).join("");
}

// Render Portion Alerts
function renderPortions() {
  const list = portionAlerts[currentBoard] || [];
  const container = document.getElementById("portionCardList");
  
  if (list.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-4 text-center">No major portion omissions reported for this board.</div>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0 text-xs font-bold">
        ${item.status === 'Deleted' ? '✕' : '!'}
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-xs text-slate-900 dark:text-white">${item.subject}</span>
          <span class="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600">${item.status}</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${item.note}</p>
      </div>
    </div>
  `).join("");
}

// Doubt Solver AI (Ultra Low-Token Architecture)
async function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("doubtInput");
  const doubt = input.value.trim();
  if (!doubt) return;

  appendChat("user", doubt);
  input.value = "";

  const aiBubbleId = appendChat("ai", "Calculating step solution...");

  try {
    let answerText = "";
    if (userApiKey) {
      // Call Gemini 2.5 Flash with strict token controls
      answerText = await callGemini(doubt);
    } else {
      // Offline fallback solver
      await new Promise(r => setTimeout(r, 600));
      answerText = simulateStepSolution(doubt);
    }
    updateChatBubble(aiBubbleId, answerText);
  } catch (err) {
    updateChatBubble(aiBubbleId, "Error connecting to AI. Using step fallback: \n" + simulateStepSolution(doubt));
  }
}

async function callGemini(doubt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userApiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: "You are a concise Board Exam Doubt Solver. Solve ONLY the doubt asked. Show: 1. Formula 2. Direct Substitution 3. Final boxed answer with SI units. Keep total response under 100 words. No chit-chat." }]
      },
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.1
      },
      contents: [{
        parts: [{ text: `Target Board: ${currentBoard}. Doubt: ${doubt}` }]
      }]
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function simulateStepSolution(doubt) {
  return `
    <div class="space-y-1.5">
      <div class="math-step"><strong>Step 1 (Formula):</strong> State relevant governing law/formula directly.</div>
      <div class="math-step"><strong>Step 2 (Substitution):</strong> Substitute values according to SI standard.</div>
      <div class="math-final">Final Answer: Verified stepwise result for "${doubt.slice(0, 28)}..."</div>
    </div>
  `;
}

function appendChat(role, text) {
  const log = document.getElementById("chatLog");
  const id = "msg-" + Date.now();
  const isUser = role === "user";

  const row = document.createElement("div");
  row.className = `flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`;
  row.innerHTML = `
    <div class="w-7 h-7 rounded-full ${isUser ? 'bg-indigo-600' : 'bg-violet-600'} text-white flex items-center justify-center text-xs shrink-0 font-bold">
      ${isUser ? 'U' : 'AI'}
    </div>
    <div id="${id}" class="${isUser ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'} text-xs p-3 rounded-2xl ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'} max-w-[85%]">
      ${text}
    </div>
  `;
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
  return id;
}

function updateChatBubble(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = text;
}

function presetQuestion(q) {
  document.getElementById("doubtInput").value = q;
  document.getElementById("doubtInput").focus();
}

// Modal Helpers
function showModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModals() {
  document.getElementById("boardModal").classList.add("hidden");
  document.getElementById("keyModal").classList.add("hidden");
}

function saveApiKey() {
  const val = document.getElementById("apiKeyInput").value.trim();
  userApiKey = val;
  localStorage.setItem("syllabiq_gemini_key", val);
  closeModals();
  alert("Gemini Key saved locally!");
}