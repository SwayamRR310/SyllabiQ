/* ==========================================================================
   SYLLABIQ DATA ENGINE & APPLICATION CONTROLLER
   ========================================================================== */

const DB_KEYS = {
  USERS: "syllabiq_users_db",
  SESSION: "syllabiq_current_session",
  CURRICULUM: "syllabiq_curriculum_db",
  PYQS: "syllabiq_pyqs_db",
  PORTIONS: "syllabiq_portions_db",
  API_KEY: "syllabiq_gemini_key",
  THEME: "syllabiq_theme"
};

// Seed Curriculum Data
const defaultCurriculum = {
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
      { id: "cbse12_c3", title: "Chemical Kinetics", marks: 7 }
    ]
  },
  "ICSE 10th": {
    "Physics": [
      { id: "icse10_p1", title: "Force, Work, Power & Energy", marks: 12 },
      { id: "icse10_p2", title: "Refraction through Lenses & Spectrum", marks: 14 }
    ]
  },
  "MH SSC 10th": {
    "Science 1": [
      { id: "mh10_s1", title: "Gravitation & Kepler's Laws", marks: 5 },
      { id: "mh10_s2", title: "Effects of Electric Current", marks: 7 }
    ]
  },
  "MH HSC 12th": {
    "Physics": [
      { id: "mh12_p1", title: "Rotational Dynamics", marks: 7 },
      { id: "mh12_p2", title: "Mechanical Properties of Fluids", marks: 7 }
    ]
  }
};

// Seed PYQ Data
const defaultPYQs = [
  {
    id: "pyq_1",
    board: "CBSE 10th",
    subject: "Physics",
    recurrence: "Asked 7x in Boards",
    year: "2024, 2023, 2020, 2019",
    question: "State Snell's Law of Refraction and express refractive index in terms of speed of light in mediums.",
    steps: "Formula: n = c / v. Step 1: Definition of sin(i)/sin(r). Step 2: Medium speed ratio."
  },
  {
    id: "pyq_2",
    board: "CBSE 10th",
    subject: "Chemistry",
    recurrence: "Asked 6x in Boards",
    year: "2024, 2022, 2021, 2018",
    question: "Why does the colour of copper sulphate solution change when an iron nail is dipped into it? Write balanced chemical equation.",
    steps: "Displacement reaction: Fe + CuSO4 -> FeSO4 + Cu. Blue changes to light green."
  },
  {
    id: "pyq_3",
    board: "CBSE 10th",
    subject: "Mathematics",
    recurrence: "Asked 5x in Boards",
    year: "2024, 2023, 2022",
    question: "Prove that √5 is an irrational number using the method of contradiction.",
    steps: "Assume p/q coprime. Square both sides. Show 5 divides both p and q, contradicting coprime premise."
  }
];

// Seed Portion Notices with PDF capability
const defaultPortions = {
  "CBSE 10th": [
    { id: "prt_1", subject: "Science", status: "Deleted", note: "Periodic Classification of Elements completely excised from syllabus.", pdfName: null, pdfData: null },
    { id: "prt_2", subject: "Maths", status: "Reduced", note: "Euclid's Division Lemma (Ex 1.1) and Frustum of Cone removed.", pdfName: null, pdfData: null }
  ],
  "CBSE 12th": [
    { id: "prt_3", subject: "Physics", status: "Reduced", note: "Potentiometer experiments and Davisson-Germer experiment deleted.", pdfName: null, pdfData: null }
  ]
};

// Database Getter and Setter helpers
function getCurriculumDB() {
  const data = localStorage.getItem(DB_KEYS.CURRICULUM);
  if (!data) {
    localStorage.setItem(DB_KEYS.CURRICULUM, JSON.stringify(defaultCurriculum));
    return defaultCurriculum;
  }
  return JSON.parse(data);
}

function saveCurriculumDB(data) {
  localStorage.setItem(DB_KEYS.CURRICULUM, JSON.stringify(data));
}

function getPYQDB() {
  const data = localStorage.getItem(DB_KEYS.PYQS);
  if (!data) {
    localStorage.setItem(DB_KEYS.PYQS, JSON.stringify(defaultPYQs));
    return defaultPYQs;
  }
  return JSON.parse(data);
}

function savePYQDB(data) {
  localStorage.setItem(DB_KEYS.PYQS, JSON.stringify(data));
}

function getPortionDB() {
  const data = localStorage.getItem(DB_KEYS.PORTIONS);
  if (!data) {
    localStorage.setItem(DB_KEYS.PORTIONS, JSON.stringify(defaultPortions));
    return defaultPortions;
  }
  return JSON.parse(data);
}

function savePortionDB(data) {
  localStorage.setItem(DB_KEYS.PORTIONS, JSON.stringify(data));
}

// Runtime Global State
let currentUser = null;
let currentBoard = "CBSE 10th";
let activeProgressSubject = "All";
let userApiKey = localStorage.getItem(DB_KEYS.API_KEY) || "";
let selectedSubjectForChapterAdd = "";
let uploadedPdfBase64 = null;
let uploadedPdfName = null;

/* ==========================================================================
   APP INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
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

  const subjectFilter = document.getElementById("subjectFilter");
  if (subjectFilter) {
    subjectFilter.addEventListener("change", (e) => renderPYQs(e.target.value));
  }

  const chatForm = document.getElementById("chatForm");
  if (chatForm) {
    chatForm.addEventListener("submit", handleChatSubmit);
  }
}

/* ==========================================================================
   AUTHENTICATION & USER PROFILE
   ========================================================================== */
function getLocalUsers() {
  return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "{}");
}

function saveLocalUsers(users) {
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
}

function loadUserSession() {
  const sessionEmail = localStorage.getItem(DB_KEYS.SESSION);
  if (sessionEmail === "admin") {
    currentUser = { name: "Product Owner (Admin)", email: "admin", role: "admin", board: currentBoard };
  } else if (sessionEmail) {
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
  const adminBtn = document.getElementById("adminPortalBtn");

  if (currentUser) {
    authBtnText.innerText = currentUser.name.split(" ")[0];
    greeting.innerText = currentUser.name;
    document.getElementById("statTargetScore").innerText = (currentUser.targetScore || 95) + "%";
    document.getElementById("statStreak").innerText = `${currentUser.streak || 1} Days`;
    document.getElementById("statDoubts").innerText = currentUser.doubtsCount || 0;

    if (currentUser.role === "admin") {
      adminBtn.classList.remove("hidden");
    } else {
      adminBtn.classList.add("hidden");
    }
  } else {
    authBtnText.innerText = "Sign In";
    greeting.innerText = "Guest Student";
    adminBtn.classList.add("hidden");
  }
  renderProgressStats();
}

let isSignUpMode = false;

function handleAuthBtnClick() {
  if (currentUser) {
    document.getElementById("profileName").innerText = currentUser.name;
    document.getElementById("profileEmail").innerText = currentUser.email;
    document.getElementById("profileAvatar").innerText = currentUser.name.charAt(0).toUpperCase();
    document.getElementById("profileBoardLabel").innerText = currentBoard;
    document.getElementById("profileTargetScore").innerText = (currentUser.targetScore || 95) + "%";
    document.getElementById("targetPercentageInput").value = currentUser.targetScore || 95;
    showModal("profileModal");
  } else {
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
  document.getElementById("authModalTitle").innerText = isSignUpMode ? "Create Student Account" : "Student / Admin Sign In";
  document.getElementById("authModalSubtitle").innerText = isSignUpMode ? "Saved locally on this device." : "Use 'admin' with pass 'admin123' to unlock content manager.";
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

  // Admin Shortcut for Product Owner
  if (email === "admin" && password === "admin123") {
    currentUser = { name: "Product Owner (Admin)", email: "admin", role: "admin", board: currentBoard };
    localStorage.setItem(DB_KEYS.SESSION, "admin");
    closeModals();
    updateAuthUI();
    alert("Logged in as Admin / Product Owner!");
    switchTab("admin");
    return;
  }

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
      completedChapters: {}
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
  if (!currentUser || currentUser.role === "admin") return;
  const users = getLocalUsers();
  users[currentUser.email] = currentUser;
  saveLocalUsers(users);
}

function claimDailyStreak() {
  if (!currentUser) {
    alert("Please sign in or create an account to record streaks!");
    handleAuthBtnClick();
    return;
  }
  const today = new Date().toDateString();
  if (currentUser.lastActiveDate === today) {
    alert("🔥 Streak already marked for today!");
    return;
  }
  currentUser.streak = (currentUser.streak || 0) + 1;
  currentUser.lastActiveDate = today;
  syncCurrentUser();
  updateAuthUI();
  alert(`🔥 Streak extended! You are now at ${currentUser.streak} days!`);
}

/* ==========================================================================
   PROGRESS TRACKING (DYNAMIC CHAPTERS & WEIGHTAGE)
   ========================================================================== */
function renderProgressView() {
  const curriculumDB = getCurriculumDB();
  const curriculum = curriculumDB[currentBoard] || {};
  const subjects = Object.keys(curriculum);

  const pillContainer = document.getElementById("progressSubjectPills");
  if (!pillContainer) return;

  if (subjects.length === 0) {
    pillContainer.innerHTML = `<span class="text-xs text-slate-400">No subjects configured for ${currentBoard} yet. (Add via Admin Portal)</span>`;
    document.getElementById("chapterChecklistContainer").innerHTML = "";
    return;
  }

  let pillsHtml = `<button onclick="filterProgressSubject('All')" class="chip ${activeProgressSubject === 'All' ? 'bg-violet-600 text-white dark:bg-violet-600' : ''}">All</button>`;
  subjects.forEach(sub => {
    pillsHtml += `<button onclick="filterProgressSubject('${sub}')" class="chip ${activeProgressSubject === sub ? 'bg-violet-600 text-white dark:bg-violet-600' : ''}">${sub}</button>`;
  });
  pillContainer.innerHTML = pillsHtml;

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
  if (currentUser && currentUser.role !== "admin") {
    if (!currentUser.completedChapters) currentUser.completedChapters = {};
    if (currentUser.completedChapters[chapterId]) {
      delete currentUser.completedChapters[chapterId];
    } else {
      currentUser.completedChapters[chapterId] = true;
    }
    syncCurrentUser();
  } else {
    const map = getGuestCompletedMap();
    if (map[chapterId]) delete map[chapterId];
    else map[chapterId] = true;
    localStorage.setItem("syllabiq_guest_completed", JSON.stringify(map));
  }
  renderProgressView();
}

function resetCurrentBoardProgress() {
  if (confirm("Reset all ticked chapters for this board?")) {
    if (currentUser && currentUser.role !== "admin") {
      currentUser.completedChapters = {};
      syncCurrentUser();
    } else {
      localStorage.removeItem("syllabiq_guest_completed");
    }
    renderProgressView();
  }
}

function renderProgressStats() {
  const curriculumDB = getCurriculumDB();
  const curriculum = curriculumDB[currentBoard] || {};
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

  document.getElementById("statProgressPct").innerText = `${pct}%`;
  document.getElementById("statChaptersRatio").innerText = `${completedCount}/${totalChapters}`;
  document.getElementById("progressPercentageLabel").innerText = `${pct}%`;
  document.getElementById("progressBarFill").style.width = `${pct}%`;
  document.getElementById("progressSummaryText").innerText = `${completedCount} of ${totalChapters} chapters completed`;
  document.getElementById("predictedScoreBadge").innerText = `Est. Board Score: ~${simulatedScore}%`;
}

/* ==========================================================================
   HIGH YIELD PYQS & PORTION NOTICES (PDF VIEWING)
   ========================================================================== */
function renderPYQs(filter) {
  const allPyqs = getPYQDB();
  const boardPyqs = allPyqs.filter(q => !q.board || q.board === currentBoard);

  const filterSelect = document.getElementById("subjectFilter");
  if (filterSelect) {
    const uniqueSubjects = [...new Set(boardPyqs.map(q => q.subject))];
    filterSelect.innerHTML = `<option value="all">All Subjects</option>` + uniqueSubjects.map(s => `<option value="${s}">${s}</option>`).join("");
    if (filter !== "all") filterSelect.value = filter;
  }

  const container = document.getElementById("pyqContainer");
  if (!container) return;

  const filtered = filter === "all" ? boardPyqs : boardPyqs.filter(q => q.subject.toLowerCase() === filter.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-4 text-center">No PYQs found for this subject yet.</div>`;
    return;
  }

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
  const portionDB = getPortionDB();
  const list = portionDB[currentBoard] || [];
  const container = document.getElementById("portionCardList");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-4 text-center">No portion omissions registered for ${currentBoard}.</div>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
      <div class="flex items-start gap-3">
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
      ${item.pdfData ? `
        <a href="${item.pdfData}" download="${item.pdfName || 'Syllabus_Circular.pdf'}" class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 rounded-xl text-xs font-semibold hover:bg-violet-100 transition border border-violet-200 dark:border-violet-900/40">
          <i data-lucide="file-down" class="w-4 h-4"></i>
          <span>Download PDF</span>
        </a>
      ` : ''}
    </div>
  `).join("");
  if (window.lucide) lucide.createIcons();
}

/* ==========================================================================
   PRODUCT OWNER / ADMIN CONSOLE LOGIC
   ========================================================================== */
function switchAdminSection(section) {
  ["curriculum", "pyqs", "portion"].forEach(sec => {
    const el = document.getElementById(`adminSec-${sec}`);
    const btn = document.getElementById(`adminSecBtn-${sec}`);
    if (el) el.classList.add("hidden");
    if (btn) btn.classList.remove("active");
  });
  
  const targetEl = document.getElementById(`adminSec-${section}`);
  const targetBtn = document.getElementById(`adminSecBtn-${section}`);
  if (targetEl) targetEl.classList.remove("hidden");
  if (targetBtn) targetBtn.classList.add("active");

  if (section === "curriculum") renderAdminCurriculum();
  if (section === "pyqs") renderAdminPYQs();
  if (section === "portion") renderAdminPortions();
}

function renderAdminCurriculum() {
  document.getElementById("adminBoardTarget").innerText = currentBoard;
  const db = getCurriculumDB();
  const curriculum = db[currentBoard] || {};
  const container = document.getElementById("adminCurriculumTree");
  if (!container) return;

  const subjects = Object.keys(curriculum);
  if (subjects.length === 0) {
    container.innerHTML = `<div class="text-xs text-slate-400 p-4 border border-dashed rounded-xl text-center">No subjects yet. Click "+ Add Subject" to begin.</div>`;
    return;
  }

  container.innerHTML = subjects.map(sub => {
    const chapters = curriculum[sub] || [];
    return `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div class="flex items-center gap-2">
            <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">${sub}</h4>
            <span class="text-[10px] text-slate-400 font-mono">(${chapters.length} Chapters)</span>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="promptAddChapter('${sub}')" class="text-xs text-violet-600 hover:text-violet-700 font-semibold px-2 py-1">+ Add Chapter</button>
            <button onclick="adminDeleteSubject('${sub}')" class="text-xs text-red-500 hover:text-red-700 px-1.5 py-1">Delete Subject</button>
          </div>
        </div>

        <div class="space-y-1.5">
          ${chapters.map(ch => `
            <div class="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
              <span class="text-slate-800 dark:text-slate-200">${ch.title} <span class="text-slate-400 font-mono text-[10px]">(${ch.marks} Marks)</span></span>
              <button onclick="adminDeleteChapter('${sub}', '${ch.id}')" class="text-slate-400 hover:text-red-500 text-[11px]">✕</button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function adminSaveNewSubject() {
  const name = document.getElementById("newSubjectName").value.trim();
  if (!name) return;

  const db = getCurriculumDB();
  if (!db[currentBoard]) db[currentBoard] = {};
  if (!db[currentBoard][name]) {
    db[currentBoard][name] = [];
    saveCurriculumDB(db);
  }
  document.getElementById("newSubjectName").value = "";
  closeModals();
  renderAdminCurriculum();
  renderProgressView();
}

function adminDeleteSubject(sub) {
  if (!confirm(`Delete subject "${sub}" and all its chapters?`)) return;
  const db = getCurriculumDB();
  if (db[currentBoard] && db[currentBoard][sub]) {
    delete db[currentBoard][sub];
    saveCurriculumDB(db);
    renderAdminCurriculum();
    renderProgressView();
  }
}

function promptAddChapter(sub) {
  selectedSubjectForChapterAdd = sub;
  document.getElementById("addChapterSubjectTarget").innerText = sub;
  showModal("addChapterModal");
}

function adminSaveNewChapter() {
  const title = document.getElementById("newChapterTitle").value.trim();
  const marks = parseInt(document.getElementById("newChapterMarks").value) || 5;
  if (!title) return;

  const db = getCurriculumDB();
  if (!db[currentBoard] || !db[currentBoard][selectedSubjectForChapterAdd]) return;

  const newId = "ch_" + Date.now();
  db[currentBoard][selectedSubjectForChapterAdd].push({ id: newId, title: title, marks: marks });
  saveCurriculumDB(db);

  document.getElementById("newChapterTitle").value = "";
  document.getElementById("newChapterMarks").value = "";
  closeModals();
  renderAdminCurriculum();
  renderProgressView();
}

function adminDeleteChapter(sub, chId) {
  const db = getCurriculumDB();
  if (db[currentBoard] && db[currentBoard][sub]) {
    db[currentBoard][sub] = db[currentBoard][sub].filter(ch => ch.id !== chId);
    saveCurriculumDB(db);
    renderAdminCurriculum();
    renderProgressView();
  }
}

function renderAdminPYQs() {
  const allPyqs = getPYQDB();
  const boardPyqs = allPyqs.filter(q => !q.board || q.board === currentBoard);
  const container = document.getElementById("adminPyqList");
  if (!container) return;

  const db = getCurriculumDB();
  const subjects = Object.keys(db[currentBoard] || {});
  const pyqSubSelect = document.getElementById("newPyqSubject");
  if (pyqSubSelect) {
    pyqSubSelect.innerHTML = subjects.map(s => `<option value="${s}">${s}</option>`).join("");
  }

  container.innerHTML = boardPyqs.map(q => `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
      <div>
        <div class="font-bold text-slate-800 dark:text-slate-200">${q.question.slice(0, 70)}...</div>
        <div class="text-[10px] text-slate-400">${q.subject} · ${q.recurrence}</div>
      </div>
      <button onclick="adminDeletePYQ('${q.id}')" class="text-red-500 hover:text-red-700 text-xs px-2 py-1">Delete</button>
    </div>
  `).join("");
}

function adminSaveNewPyq() {
  const subject = document.getElementById("newPyqSubject").value;
  const recurrence = document.getElementById("newPyqRecurrence").value.trim() || "Asked 5x in Boards";
  const year = document.getElementById("newPyqYears").value.trim() || "2024, 2023";
  const question = document.getElementById("newPyqQuestion").value.trim();
  const steps = document.getElementById("newPyqSteps").value.trim();

  if (!question) return;

  const allPyqs = getPYQDB();
  allPyqs.unshift({
    id: "pyq_" + Date.now(),
    board: currentBoard,
    subject: subject,
    recurrence: recurrence,
    year: year,
    question: question,
    steps: steps
  });
  savePYQDB(allPyqs);

  document.getElementById("newPyqQuestion").value = "";
  document.getElementById("newPyqSteps").value = "";
  closeModals();
  renderAdminPYQs();
  renderPYQs("all");
}

function adminDeletePYQ(id) {
  let allPyqs = getPYQDB();
  allPyqs = allPyqs.filter(q => q.id !== id);
  savePYQDB(allPyqs);
  renderAdminPYQs();
  renderPYQs("all");
}

function previewPdfFileName(input) {
  const file = input.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("Please select a PDF smaller than 5MB.");
    input.value = "";
    return;
  }

  uploadedPdfName = file.name;
  document.getElementById("pdfFileNameDisplay").innerText = `Selected: ${file.name}`;

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedPdfBase64 = e.target.result;
  };
  reader.readAsDataURL(file);
}

function renderAdminPortions() {
  const db = getPortionDB();
  const list = db[currentBoard] || [];
  const container = document.getElementById("adminPortionList");
  if (!container) return;

  container.innerHTML = list.map(item => `
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
      <div>
        <div class="font-bold text-slate-800 dark:text-slate-200">${item.subject} (${item.status})</div>
        <div class="text-[10px] text-slate-400">${item.note} ${item.pdfName ? `· 📎 ${item.pdfName}` : ''}</div>
      </div>
      <button onclick="adminDeletePortion('${item.id}')" class="text-red-500 hover:text-red-700 text-xs px-2 py-1">Delete</button>
    </div>
  `).join("");
}

function adminSaveNewPortion() {
  const subject = document.getElementById("newPortionSubject").value.trim();
  const status = document.getElementById("newPortionStatus").value;
  const note = document.getElementById("newPortionNote").value.trim();

  if (!subject || !note) return;

  const db = getPortionDB();
  if (!db[currentBoard]) db[currentBoard] = [];

  db[currentBoard].unshift({
    id: "prt_" + Date.now(),
    subject: subject,
    status: status,
    note: note,
    pdfName: uploadedPdfName,
    pdfData: uploadedPdfBase64
  });

  savePortionDB(db);

  document.getElementById("newPortionSubject").value = "";
  document.getElementById("newPortionNote").value = "";
  document.getElementById("newPortionPdfFile").value = "";
  uploadedPdfBase64 = null;
  uploadedPdfName = null;
  document.getElementById("pdfFileNameDisplay").innerText = "Optional (Max 5MB)";

  closeModals();
  renderAdminPortions();
  renderPortions();
}

function adminDeletePortion(id) {
  const db = getPortionDB();
  if (db[currentBoard]) {
    db[currentBoard] = db[currentBoard].filter(p => p.id !== id);
    savePortionDB(db);
    renderAdminPortions();
    renderPortions();
  }
}

/* ==========================================================================
   TAB NAVIGATION (FIXED PRECISE MAP)
   ========================================================================== */
function switchTab(tabId) {
  const tabMap = {
    home: "viewHome",
    progress: "viewProgress",
    ai: "viewAI",
    pyqs: "viewPYQs",
    portion: "viewPortion",
    admin: "viewAdmin"
  };

  // Hide all sections
  Object.values(tabMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  // Reset active classes on all nav buttons
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.classList.remove("active");
  });

  // Display the target tab
  const targetId = tabMap[tabId];
  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    targetEl.classList.remove("hidden");
  }

  // Set clicked tab to active
  const activeNav = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
  }

  if (tabId === "admin") {
    switchAdminSection("curriculum");
  }

  if (window.lucide) lucide.createIcons();
}

function selectBoard(boardName) {
  currentBoard = boardName;
  if (currentUser && currentUser.role !== "admin") {
    currentUser.board = boardName;
    syncCurrentUser();
  }
  renderBoard();
  renderPortions();
  renderProgressView();
  renderPYQs("all");
  closeModals();
}

function renderBoard() {
  const boardLabel = document.getElementById("currentBoardLabel");
  const chatLabel = document.getElementById("chatBoardLabel");
  if (boardLabel) boardLabel.innerText = currentBoard;
  if (chatLabel) chatLabel.innerText = currentBoard;
}

/* ==========================================================================
   LOW-TOKEN DOUBT SOLVER AI ENGINE
   ========================================================================== */
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

  if (currentUser && currentUser.role !== "admin") {
    currentUser.doubtsCount = (currentUser.doubtsCount || 0) + 1;
    syncCurrentUser();
    updateAuthUI();
  }

  const aiBubbleId = appendChat("ai", "Calculating step solution...");

  // Check if API key exists
  const activeKey = (userApiKey || localStorage.getItem(DB_KEYS.API_KEY) || "").trim();

  if (!activeKey) {
    updateChatBubble(aiBubbleId, `
      <div class="space-y-2">
        <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 text-xs">
          <strong>⚠️ No Gemini API Key Connected</strong><br/>
          Click the <span class="font-bold underline cursor-pointer" onclick="showModal('keyModal')">🔑 key icon</span> in the top right to paste your free Google AI Studio key.
        </div>
        ${simulateStepSolution(doubt)}
      </div>
    `);
    return;
  }

  try {
    const answerText = await callGemini(doubt, activeKey);
    updateChatBubble(aiBubbleId, answerText);
  } catch (err) {
    console.error("Gemini Error:", err);
    updateChatBubble(aiBubbleId, `
      <div class="space-y-2">
        <div class="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
          Error from Gemini API: ${err.message}
        </div>
        <div class="text-[10px] text-slate-400">Showing local offline format:</div>
        ${simulateStepSolution(doubt)}
      </div>
    `);
  }
}

async function callGemini(doubt, key) {
  // Use the recommended model from the API error
  const modelName = "gemini-3.8-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(key)}`;

  const prompt = `You are a concise Board Exam Doubt Solver for ${currentBoard}.
Solve the following doubt directly and concisely according to official board step-marking criteria:
Doubt: "${doubt}"

Format your answer strictly as:
Step 1: Formula / Governing Law
Step 2: Stepwise Substitution or Derivation
Final Boxed Answer: Clear result with SI units.
Do not add pleasantries or conversational filler. Keep it under 150 words.`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.2
      }
    })
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || `HTTP ${response.status}`);
  }

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("No response generated by model.");
  }

  const rawText = data.candidates[0].content.parts[0].text;
  return formatAiOutput(rawText);
}

function formatAiOutput(text) {
  // Turn markdown bold into HTML strong
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Format linebreaks cleanly
  formatted = formatted.replace(/\n/g, '<br/>');

  return `<div class="text-xs leading-relaxed space-y-1">${formatted}</div>`;
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
  const input = document.getElementById("doubtInput");
  if (input) {
    input.value = q;
    input.focus();
  }
}

/* ==========================================================================
   THEME, MODALS, AND UTILITY
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
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("hidden");
}

function closeModals() {
  [
    "boardModal",
    "keyModal",
    "authModal",
    "profileModal",
    "addSubjectModal",
    "addChapterModal",
    "addPyqModal",
    "addPortionModal"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

function saveApiKey() {
  const val = document.getElementById("apiKeyInput").value.trim();
  userApiKey = val;
  localStorage.setItem(DB_KEYS.API_KEY, val);
  closeModals();
  alert("Gemini API key saved!");
}