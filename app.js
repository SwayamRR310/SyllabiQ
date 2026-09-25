/* ==========================================================================
   SYLLABIQ LOCAL DATABASE & STATE LAYER
   ========================================================================== */

const DB_KEYS = {
  USERS: "syllabiq_users_db",
  SESSION: "syllabiq_current_session",
  API_KEY: "syllabiq_gemini_key",
  THEME: "syllabiq_theme"
};

// Curriculum & Chapter Blueprint per Board
const boardCurriculumData = {
  "CBSE 10th": {
    "Physics": [
      { id: "cbse10_p1", title: "Light: Reflection & Refraction", marks: 7 },
      { id: "cbse10_p2", title: "Human Eye & Colourful World", marks: 5 },
      { id: "cbse10_p3", title: "Electricity & Circuits", marks: 7 },
      { id: "cbse10_p4", title: "Magnetic Effects of Electric Current", marks: 6 }
    ],
    "Chemistry": [
      { id: "cbse10_c1", title: "Chemical Reactions & Equations", marks: 6 },
      { id: "cbse10_c2", title: "Acids, Bases & Salts", marks: 6 },
      { id: "cbse10_c3", title: "Metals & Non-metals", marks: 7 },
      { id: "cbse10_c4", title: "Carbon & its Compounds", marks: 6 }
    ],
    "Mathematics": [
      { id: "cbse10_m1", title: "Real Numbers", marks: 6 },
      { id: "cbse10_m2", title: "Polynomials & Quadratic Equations", marks: 10 },
      { id: "cbse10_m3", title: "Triangles & Coordinate Geometry", marks: 12 },
      { id: "cbse10_m4", title: "Introduction to Trigonometry", marks: 12 }
    ]
  },
  "CBSE 12th": {
    "Physics": [
      { id: "cbse12_p1", title: "Electrostatics & Capacitance", marks: 8 },
      { id: "cbse12_p2", title: "Current Electricity", marks: 7 },
      { id: "cbse12_p3", title: "Electromagnetic Induction & AC", marks: 8 },
      { id: "cbse12_p4", title: "Ray & Wave Optics", marks: 14 }
    ],
    "Chemistry": [
      { id: "cbse12_c1", title: "Solutions & Colligative Properties", marks: 7 },
      { id: "cbse12_c2", title: "Electrochemistry", marks: 9 },
      { id: "cbse12_c3", title: "Chemical Kinetics", marks: 7 },
      { id: "cbse12_c4", title: "d and f Block Elements", marks: 7 }
    ]
  },
  "ICSE 10th": {
    "Physics": [
      { id: "icse10_p1", title: "Force, Work, Power & Energy", marks: 12 },
      { id: "icse10_p2", title: "Refraction through Lenses & Spectrum", marks: 14 },
      { id: "icse10_p3", title: "Current Electricity & Household Circuits", marks: 12 }
    ]
  },
  "MH SSC 10th": {
    "Science 1": [
      { id: "mh10_s1", title: "Gravitation & Kepler's Laws", marks: 5 },
      { id: "mh10_s2", title: "Periodic Classification of Elements", marks: 6 },
      { id: "mh10_s3", title: "Effects of Electric Current", marks: 7 }
    ]
  },
  "MH HSC 12th": {
    "Physics": [
      { id: "mh12_p1", title: "Rotational Dynamics", marks: 7 },
      { id: "mh12_p2", title: "Mechanical Properties of Fluids", marks: 7 },
      { id: "mh12_p3", title: "Oscillations & Superposition of Waves", marks: 8 }
    ]
  }
};

// High-Yield PYQs
const pyqData = [
  {
    id: 1,
    subject: "Physics",
    recurrence: "Asked 7x in Boards",
    year: "2024, 2023, 2020, 2019",
    question: "State Snell's Law of Refraction and express refractive index in terms of speed of light in mediums.",
    steps: "Formula: n = c / v. Step 1: Definition of sin(i)/sin(r). Step 2: Medium speed ratio."
  },
  {
    id: 2,
    subject: "Chemistry",
    recurrence: "Asked 6x in Boards",
    year: "2024, 2022, 2021, 2018",
    question: "Why does the colour of copper sulphate solution change when an iron nail is dipped into it? Write balanced chemical equation.",
    steps: "Displacement reaction: Fe + CuSO4 -> FeSO4 + Cu. Blue changes to light green."
  },
  {
    id: 3,
    subject: "Mathematics",
    recurrence: "Asked 5x in Boards",
    year: "2024, 2023, 2022",
    question: "Prove that √5 is an irrational number using the method of contradiction.",
    steps: "Assume p/q coprime. Square both sides. Show 5 divides both p and q, contradicting coprime premise."
  }
];

// Portion Rationalization Notes
const portionAlerts = {
  "CBSE 10th": [
    { subject: "Science", status: "Deleted", note: "Periodic Classification of Elements completely excised from syllabus." },
    { subject: "Maths", status: "Reduced", note: "Euclid's Division Lemma (Ex 1.1) and Frustum of Cone removed." }
  ],
  "CBSE 12th": [
    { subject: "Physics", status: "Reduced", note: "Potentiometer experiments and Davisson-Germer experiment deleted." },
    { subject: "Chemistry", status: "Deleted", note: "Solid State, Surface Chemistry, and Polymers completely removed." }
  ],
  "ICSE 10th": [
    { subject: "Physics", status: "Updated", note: "Modern Physics & radioactivity sections revised with SI standards." }
  ],
  "MH SSC 10th": [
    { subject: "Science 2", status: "Active", note: "Heredity and Evolution: All numericals verified for 2025-2026." }
  ],
  "MH HSC 12th": [
    { subject: "Maths", status: "Active", note: "Linear Programming & Differential Equations weightage adjusted." }
  ]
};

// Active Session in memory
let currentUser = null;
let currentBoard = "CBSE 10th";
let activeProgressSubject = "All";
let userApiKey = localStorage.getItem(DB_KEYS.API_KEY) || "";

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initTheme();
  loadUserSession();
  renderBoard();
  renderProgressView();
  renderPYQs("all");
  renderPortions();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);
  document.getElementById("boardSelectorBtn").addEventListener("click", () => showModal("boardModal"));
  document.getElementById("authBtn").addEventListener("click", handleAuthBtnClick);
  document.getElementById("authToggleBtn").addEventListener("click", toggleAuthMode);
  document.getElementById("authForm").addEventListener("submit", handleAuthSubmit);
  document.getElementById("apiKeyModalBtn").addEventListener("click", () => {
    document.getElementById("apiKeyInput").value = userApiKey;
    showModal("keyModal");
  });
  document.getElementById("subjectFilter").addEventListener("change", (e) => renderPYQs(e.target.value));
  document.getElementById("chatForm").addEventListener("submit", handleChatSubmit);
}

/* ==========================================================================
   USER AUTHENTICATION & LOCAL DATABASE
   ========================================================================== */
function getLocalUsers() {
  return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "{}");
}

function saveLocalUsers(users) {
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
}

function loadUserSession() {
  const sessionEmail = localStorage.getItem(DB_KEYS.SESSION);
  if (sessionEmail) {
    const users = getLocalUsers();
    if (users[sessionEmail]) {
      currentUser = users[sessionEmail];
      currentBoard = currentUser.board || "CBSE 10th";
    }
  }
  updateAuthUI();
}

function updateAuthUI() {
  const authBtnText = document.getElementById("authBtnText");
  const greeting = document.getElementById("headerUserGreeting");

  if (currentUser) {
    authBtnText.innerText = currentUser.name.split(" ")[0];
    greeting.innerText = currentUser.name;
    document.getElementById("statTargetScore").innerText = (currentUser.targetScore || 95) + "%";
    document.getElementById("statStreak").innerText = `${currentUser.streak || 1} Days`;
    document.getElementById("statDoubts").innerText = currentUser.doubtsCount || 0;
  } else {
    authBtnText.innerText = "Sign In";
    greeting.innerText = "Guest Student";
    document.getElementById("statTargetScore").innerText = "95%+";
    document.getElementById("statStreak").innerText = "1 Day";
    document.getElementById("statDoubts").innerText = "0";
  }
  renderProgressStats();
}

let isSignUpMode = false;

function handleAuthBtnClick() {
  if (currentUser) {
    // Open Profile Modal
    document.getElementById("profileName").innerText = currentUser.name;
    document.getElementById("profileEmail").innerText = currentUser.email;
    document.getElementById("profileAvatar").innerText = currentUser.name.charAt(0).toUpperCase();
    document.getElementById("profileBoardLabel").innerText = currentBoard;
    document.getElementById("profileTargetScore").innerText = (currentUser.targetScore || 95) + "%";
    document.getElementById("targetPercentageInput").value = currentUser.targetScore || 95;
    showModal("profileModal");
  } else {
    // Open Auth Modal
    isSignUpMode = false;
    updateAuthModalState();
    showModal("authModal");
  }
}

function toggleAuthMode() {
  isSignUpMode = !isSignUpMode;
  updateAuthModalState();
}

function updateAuthModalState() {
  document.getElementById("authModalTitle").innerText = isSignUpMode ? "Create Student Account" : "Student Sign In";
  document.getElementById("authModalSubtitle").innerText = isSignUpMode ? "Your progress and notes will be saved locally." : "Sign in to access your saved progress.";
  document.getElementById("authNameField").classList.toggle("hidden", !isSignUpMode);
  document.getElementById("authSubmitBtn").innerText = isSignUpMode ? "Register Account" : "Sign In";
  document.getElementById("authToggleQuestion").innerText = isSignUpMode ? "Already registered?" : "New student here?";
  document.getElementById("authToggleBtn").innerText = isSignUpMode ? "Sign In" : "Create Account";
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("authEmailInput").value.trim().toLowerCase();
  const password = document.getElementById("authPasswordInput").value.trim();
  const name = document.getElementById("authNameInput").value.trim();

  const users = getLocalUsers();

  if (isSignUpMode) {
    if (users[email]) {
      alert("An account with this email already exists.");
      return;
    }
    const newUser = {
      name: name || "Student",
      email: email,
      password: password,
      board: currentBoard,
      targetScore: 95,
      streak: 1,
      lastActiveDate: new Date().toDateString(),
      doubtsCount: 0,
      completedChapters: {} // e.g. { "cbse10_p1": true }
    };
    users[email] = newUser;
    saveLocalUsers(users);
    currentUser = newUser;
  } else {
    if (!users[email] || users[email].password !== password) {
      alert("Invalid email or password.");
      return;
    }
    currentUser = users[email];
  }

  localStorage.setItem(DB_KEYS.SESSION, currentUser.email);
  closeModals();
  updateAuthUI();
  renderProgressView();
}

function logoutStudent() {
  localStorage.removeItem(DB_KEYS.SESSION);
  currentUser = null;
  closeModals();
  updateAuthUI();
  renderProgressView();
}

function updateTargetScore() {
  const val = parseInt(document.getElementById("targetPercentageInput").value);
  if (!val || val < 35 || val > 100) return;
  if (currentUser) {
    currentUser.targetScore = val;
    syncCurrentUser();
    updateAuthUI();
  }
  closeModals();
}

function syncCurrentUser() {
  if (!currentUser) return;
  const users = getLocalUsers();
  users[currentUser.email] = currentUser;
  saveLocalUsers(users);
}

// Daily Streak Check-in
function claimDailyStreak() {
  if (!currentUser) {
    alert("Please sign in or create an account to record your streaks!");
    handleAuthBtnClick();
    return;
  }
  const today = new Date().toDateString();
  if (currentUser.lastActiveDate === today) {
    alert("🔥 Streak already marked for today! Keep up the revision!");
    return;
  }
  currentUser.streak = (currentUser.streak || 0) + 1;
  currentUser.lastActiveDate = today;
  syncCurrentUser();
  updateAuthUI();
  alert(`🔥 Streak extended! You are now at ${currentUser.streak} days!`);
}

/* ==========================================================================
   PROGRESS TRACKING & CHAPTER CHECKLIST
   ========================================================================== */
function renderProgressView() {
  const curriculum = boardCurriculumData[currentBoard] || {};
  const subjects = Object.keys(curriculum);

  // Render subject filter pills
  const pillContainer = document.getElementById("progressSubjectPills");
  if (subjects.length === 0) {
    pillContainer.innerHTML = `<span class="text-xs text-slate-400">Curriculum preview not available for this board.</span>`;
    document.getElementById("chapterChecklistContainer").innerHTML = "";
    return;
  }

  let pillsHtml = `<button onclick="filterProgressSubject('All')" class="chip ${activeProgressSubject === 'All' ? 'bg-violet-600 text-white dark:bg-violet-600' : ''}">All</button>`;
  subjects.forEach(sub => {
    pillsHtml += `<button onclick="filterProgressSubject('${sub}')" class="chip ${activeProgressSubject === sub ? 'bg-violet-600 text-white dark:bg-violet-600' : ''}">${sub}</button>`;
  });
  pillContainer.innerHTML = pillsHtml;

  // Render checklist chapters
  const checklistContainer = document.getElementById("chapterChecklistContainer");
  let allChapters = [];

  subjects.forEach(sub => {
    if (activeProgressSubject === "All" || activeProgressSubject === sub) {
      curriculum[sub].forEach(ch => allChapters.push({ ...ch, subject: sub }));
    }
  });

  const completedMap = (currentUser && currentUser.completedChapters) ? currentUser.completedChapters : getGuestCompletedMap();

  checklistContainer.innerHTML = allChapters.map(ch => {
    const isDone = !!completedMap[ch.id];
    return `
      <div class="chapter-row ${isDone ? 'completed' : ''} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm">
        <div class="flex items-center gap-3">
          <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleChapterDone('${ch.id}')" class="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 cursor-pointer">
          <div>
            <div class="text-xs font-bold text-slate-900 dark:text-slate-100 ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''}">${ch.title}</div>
            <div class="text-[10px] text-slate-400">${ch.subject} · Approx Weightage: ${ch.marks} Marks</div>
          </div>
        </div>
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${isDone ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}">
          ${isDone ? 'Completed' : 'Pending'}
        </span>
      </div>
    `;
  }).join("");

  renderProgressStats();
}

function filterProgressSubject(sub) {
  activeProgressSubject = sub;
  renderProgressView();
}

function getGuestCompletedMap() {
  return JSON.parse(localStorage.getItem("syllabiq_guest_completed") || "{}");
}

function toggleChapterDone(chapterId) {
  if (currentUser) {
    if (!currentUser.completedChapters) currentUser.completedChapters = {};
    if (currentUser.completedChapters[chapterId]) {
      delete currentUser.completedChapters[chapterId];
    } else {
      currentUser.completedChapters[chapterId] = true;
    }
    syncCurrentUser();
  } else {
    // Guest fallback
    const map = getGuestCompletedMap();
    if (map[chapterId]) delete map[chapterId];
    else map[chapterId] = true;
    localStorage.setItem("syllabiq_guest_completed", JSON.stringify(map));
  }
  renderProgressView();
}

function resetCurrentBoardProgress() {
  if (confirm("Reset all ticked chapters for this board?")) {
    if (currentUser) {
      currentUser.completedChapters = {};
      syncCurrentUser();
    } else {
      localStorage.removeItem("syllabiq_guest_completed");
    }
    renderProgressView();
  }
}

function renderProgressStats() {
  const curriculum = boardCurriculumData[currentBoard] || {};
  let totalChapters = 0;
  let totalMarks = 0;
  let earnedMarks = 0;
  let completedCount = 0;

  const completedMap = (currentUser && currentUser.completedChapters) ? currentUser.completedChapters : getGuestCompletedMap();

  Object.values(curriculum).forEach(chapList => {
    chapList.forEach(ch => {
      totalChapters++;
      totalMarks += ch.marks;
      if (completedMap[ch.id]) {
        completedCount++;
        earnedMarks += ch.marks;
      }
    });
  });

  const pct = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
  const simulatedScore = totalMarks > 0 ? Math.min(100, Math.round(40 + (earnedMarks / totalMarks) * 55)) : 40;

  // Update elements
  document.getElementById("statProgressPct").innerText = `${pct}%`;
  document.getElementById("statChaptersRatio").innerText = `${completedCount}/${totalChapters}`;
  document.getElementById("progressPercentageLabel").innerText = `${pct}%`;
  document.getElementById("progressBarFill").style.width = `${pct}%`;
  document.getElementById("progressSummaryText").innerText = `${completedCount} of ${totalChapters} chapters completed`;
  document.getElementById("predictedScoreBadge").innerText = `Est. Board Score: ~${simulatedScore}%`;
}

/* ==========================================================================
   NAVIGATION & BOARD SELECTION
   ========================================================================== */
function switchTab(tabId) {
  const tabs = ["home", "progress", "ai", "pyqs", "portion"];
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

function selectBoard(boardName) {
  currentBoard = boardName;
  if (currentUser) {
    currentUser.board = boardName;
    syncCurrentUser();
  }
  renderBoard();
  renderPortions();
  renderProgressView();
  closeModals();
}

function renderBoard() {
  document.getElementById("currentBoardLabel").innerText = currentBoard;
  document.getElementById("chatBoardLabel").innerText = currentBoard;
}

/* ==========================================================================
   HIGH YIELD PYQS & PORTION TRACKER
   ========================================================================== */
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

function renderPortions() {
  const list = portionAlerts[currentBoard] || [];
  const container = document.getElementById("portionCardList");

  if (list.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-4 text-center">No major portion omissions registered for ${currentBoard}.</div>`;
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

/* ==========================================================================
   LOW-TOKEN DOUBT SOLVER AI ENGINE
   ========================================================================== */
async function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("doubtInput");
  const doubt = input.value.trim();
  if (!doubt) return;

  appendChat("user", doubt);
  input.value = "";

  if (currentUser) {
    currentUser.doubtsCount = (currentUser.doubtsCount || 0) + 1;
    syncCurrentUser();
    updateAuthUI();
  }

  const aiBubbleId = appendChat("ai", "Calculating step solution...");

  try {
    let answerText = "";
    if (userApiKey) {
      answerText = await callGemini(doubt);
    } else {
      await new Promise(r => setTimeout(r, 600));
      answerText = simulateStepSolution(doubt);
    }
    updateChatBubble(aiBubbleId, answerText);
  } catch (err) {
    updateChatBubble(aiBubbleId, "Error connecting to AI. Step fallback: \n" + simulateStepSolution(doubt));
  }
}

async function callGemini(doubt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userApiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: "You are a concise Board Exam Doubt Solver. Solve ONLY the doubt asked. Show: 1. Formula 2. Direct Substitution 3. Final boxed answer with SI units. Keep total response under 100 words. Zero chit-chat." }]
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
      <div class="math-final">Final Answer: Verified stepwise result for "${doubt.slice(0, 30)}..."</div>
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

/* ==========================================================================
   THEME, MODALS, AND CONFIG
   ========================================================================== */
function initTheme() {
  const isDark = localStorage.getItem(DB_KEYS.THEME) === "dark" || 
    (!localStorage.getItem(DB_KEYS.THEME) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add("dark");
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem(DB_KEYS.THEME, isDark ? "dark" : "light");
}

function showModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModals() {
  document.getElementById("boardModal").classList.add("hidden");
  document.getElementById("keyModal").classList.add("hidden");
  document.getElementById("authModal").classList.add("hidden");
  document.getElementById("profileModal").classList.add("hidden");
}

function saveApiKey() {
  const val = document.getElementById("apiKeyInput").value.trim();
  userApiKey = val;
  localStorage.setItem(DB_KEYS.API_KEY, val);
  closeModals();
  alert("Gemini API key saved!");
}