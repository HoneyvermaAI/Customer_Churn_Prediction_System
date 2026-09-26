/**
 * Customer Churn Predictor — Frontend JavaScript
 * Handles form state, UI interactions, API communications, and animated dashboard outputs.
 * Left entirely to user's choice: starts clean without pre-filled selections.
 */

// ============================================================================
// 1. API Configuration & Constants
// ============================================================================
const API_BASE = "http://127.0.0.1:8000";
const PREDICT_URL = `${API_BASE}/predict`;
const HEALTH_URL = `${API_BASE}/health`;

// Gauge Circumference: 2 * PI * r = 2 * PI * 68 ≈ 427.256
const GAUGE_CIRCUMFERENCE = 427.256;

// ============================================================================
// 2. Application State (Starts empty, left to USER'S CHOICE)
// ============================================================================
const state = {
  gender: null,
  SeniorCitizen: null,
  Partner: null,
  Dependents: null,
  tenure: null,
  PhoneService: null,
  MultipleLines: null,
  InternetService: null,
  OnlineSecurity: null,
  OnlineBackup: null,
  DeviceProtection: null,
  TechSupport: null,
  StreamingTV: null,
  StreamingMovies: null,
  Contract: null,
  PaperlessBilling: null,
  PaymentMethod: null,
  MonthlyCharges: null,
  TotalCharges: null
};

// ============================================================================
// 3. DOM Elements
// ============================================================================
const form = document.getElementById("churnPredictionForm");
const predictBtn = document.getElementById("predictBtn");
const btnSpinner = document.getElementById("btnSpinner");
const btnText = document.getElementById("btnText");
const featuresReadyText = document.getElementById("featuresReadyText");

const tenureInput = document.getElementById("tenureInput");
const tenureDisplayBadge = document.getElementById("tenureDisplayBadge");
const monthlyChargesInput = document.getElementById("monthlyChargesInput");
const totalChargesInput = document.getElementById("totalChargesInput");
const calcTotalBtn = document.getElementById("calcTotalBtn");

const resultSection = document.getElementById("resultSection");
const errorCard = document.getElementById("errorCard");
const errorTitle = document.getElementById("errorTitle");
const errorDescription = document.getElementById("errorDescription");
const errorTerminalTip = document.getElementById("errorTerminalTip");
const dismissErrorBtn = document.getElementById("dismissErrorBtn");
const resetBtn = document.getElementById("resetBtn");
const editInputsBtn = document.getElementById("editInputsBtn");

// Model Status Indicator
const modelStatusIndicator = document.getElementById("modelStatusIndicator");
const modelStatusText = document.getElementById("modelStatusText");

// Presets
const presetHighRiskBtn = document.getElementById("presetHighRiskBtn");
const presetLowRiskBtn = document.getElementById("presetLowRiskBtn");

// Result Elements
const verdictBadge = document.getElementById("verdictBadge");
const verdictWord = document.getElementById("verdictWord");
const verdictLabel = document.getElementById("verdictLabel");
const verdictMessage = document.getElementById("verdictMessage");
const gaugeProgressRing = document.getElementById("gaugeProgressRing");
const churnPercentageDisplay = document.getElementById("churnPercentageDisplay");
const riskLevelBadge = document.getElementById("riskLevelBadge");
const riskLevelText = document.getElementById("riskLevelText");
const snapContract = document.getElementById("snapContract");
const snapTenure = document.getElementById("snapTenure");
const snapSpend = document.getElementById("snapSpend");

// ============================================================================
// 4. Initialization & Backend Health Check
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  setupInteractiveButtons();
  setupNumericInputs();
  setupScrollSpy();
  setupPresets();
  checkBackendHealth();
  updateSignalsCounter();

  // Periodically check backend health every 30 seconds
  setInterval(checkBackendHealth, 30000);
});

/**
 * Pings backend health endpoint to reflect real-time API status
 */
async function checkBackendHealth() {
  try {
    const res = await fetch(HEALTH_URL, { method: "GET", mode: "cors" });
    if (res.ok) {
      modelStatusIndicator.classList.remove("offline");
      modelStatusText.textContent = "MODEL ONLINE";
    } else {
      showOfflineStatus();
    }
  } catch (err) {
    showOfflineStatus();
  }
}

function showOfflineStatus() {
  modelStatusIndicator.classList.add("offline");
  modelStatusText.textContent = "BACKEND OFFLINE";
}

// ============================================================================
// 5. Button Group & Card Selection Handlers (Interactive User Choice)
// ============================================================================
function setupInteractiveButtons() {
  // Selectable Button Groups (Gender, Contract, InternetService)
  document.querySelectorAll(".btn-group:not(.btn-group-yn)").forEach((group) => {
    const field = group.dataset.field;
    if (!field) return;

    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".select-btn");
      if (!btn) return;

      group.querySelectorAll(".select-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const val = btn.dataset.value;
      state[field] = val;

      clearFieldError(field);
      updateSignalsCounter();
    });
  });

  // YES / NO Button Groups
  document.querySelectorAll(".btn-group-yn").forEach((group) => {
    const field = group.dataset.field;
    const isNumericBinary = group.dataset.type === "numeric-binary"; // SeniorCitizen (0 or 1)

    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".yn-btn");
      if (!btn) return;

      group.querySelectorAll(".yn-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const raw = btn.dataset.value;
      if (isNumericBinary) {
        state[field] = Number(raw);
      } else {
        state[field] = raw; // "Yes" or "No"
      }

      clearFieldError(field);
      updateSignalsCounter();
    });
  });

  // Payment Method Selectable Cards
  const paymentGrid = document.querySelector(".payment-cards-grid");
  if (paymentGrid) {
    paymentGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".payment-card");
      if (!card) return;

      paymentGrid.querySelectorAll(".payment-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      state.PaymentMethod = card.dataset.value;

      clearFieldError("PaymentMethod");
      updateSignalsCounter();
    });
  }
}

// ============================================================================
// 6. Numeric & Stepper Inputs
// ============================================================================
function setupNumericInputs() {
  // Tenure input & badge sync
  tenureInput.addEventListener("input", () => {
    clearFieldError("tenure");
    if (tenureInput.value.trim() === "") {
      state.tenure = null;
      tenureDisplayBadge.textContent = "Select tenure";
    } else {
      const val = parseInt(tenureInput.value, 10);
      state.tenure = isNaN(val) ? 0 : Math.max(0, val);
      updateTenureBadge();
    }
    updateSignalsCounter();
  });

  // Tenure quick chips
  document.querySelectorAll("[data-set-tenure]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const months = parseInt(chip.dataset.setTenure, 10);
      tenureInput.value = months;
      state.tenure = months;
      clearFieldError("tenure");
      updateTenureBadge();
      updateSignalsCounter();
    });
  });

  // Monthly charges
  monthlyChargesInput.addEventListener("input", () => {
    clearFieldError("MonthlyCharges");
    if (monthlyChargesInput.value.trim() === "") {
      state.MonthlyCharges = null;
    } else {
      const val = parseFloat(monthlyChargesInput.value);
      state.MonthlyCharges = isNaN(val) ? 0 : Math.max(0, val);
    }
    updateSignalsCounter();
  });

  // Total charges
  totalChargesInput.addEventListener("input", () => {
    clearFieldError("TotalCharges");
    if (totalChargesInput.value.trim() === "") {
      state.TotalCharges = null;
    } else {
      const val = parseFloat(totalChargesInput.value);
      state.TotalCharges = isNaN(val) ? 0 : Math.max(0, val);
    }
    updateSignalsCounter();
  });

  // Auto calculate total (tenure * monthlyCharges)
  calcTotalBtn.addEventListener("click", () => {
    if (state.tenure === null || state.MonthlyCharges === null) {
      showError(
        "Please enter both tenure and MonthlyCharges to calculate estimated TotalCharges.",
        "Missing Inputs",
        false
      );
      return;
    }
    const estimated = (state.tenure * state.MonthlyCharges).toFixed(2);
    totalChargesInput.value = estimated;
    state.TotalCharges = parseFloat(estimated);
    clearFieldError("TotalCharges");
    updateSignalsCounter();
  });
}

function updateTenureBadge() {
  if (state.tenure === null) {
    tenureDisplayBadge.textContent = "Select tenure";
  } else if (state.tenure === 1) {
    tenureDisplayBadge.textContent = "1 month";
  } else {
    tenureDisplayBadge.textContent = `${state.tenure} months`;
  }
}

function clearFieldError(fieldName) {
  const item = document.querySelector(`.field-item[data-field="${fieldName}"]`);
  if (item) {
    item.classList.remove("has-error");
  }
}

/**
 * Updates the footer status counter displaying how many customer signals are selected
 */
function updateSignalsCounter() {
  const fields = [
    "gender", "SeniorCitizen", "Partner", "Dependents",
    "tenure", "Contract", "MonthlyCharges", "TotalCharges",
    "PhoneService", "MultipleLines", "InternetService",
    "OnlineSecurity", "OnlineBackup", "DeviceProtection", "TechSupport",
    "StreamingTV", "StreamingMovies", "PaperlessBilling", "PaymentMethod"
  ];

  let filledCount = 0;
  fields.forEach((f) => {
    if (state[f] !== null && state[f] !== undefined && state[f] !== "") {
      filledCount++;
    }
  });

  if (featuresReadyText) {
    if (filledCount === fields.length) {
      featuresReadyText.textContent = "All 19 customer signals configured — ready for XGBoost inference";
    } else if (filledCount === 0) {
      featuresReadyText.textContent = "Select customer attributes above to generate prediction";
    } else {
      featuresReadyText.textContent = `${filledCount} of 19 customer signals configured`;
    }
  }
}

// ============================================================================
// 7. Presets for Instant Testing (Optional Demo Helper)
// ============================================================================
const PRESET_HIGH_RISK = {
  gender: "Female",
  SeniorCitizen: 1,
  Partner: "No",
  Dependents: "No",
  tenure: 1,
  PhoneService: "Yes",
  MultipleLines: "No",
  InternetService: "Fiber optic",
  OnlineSecurity: "No",
  OnlineBackup: "No",
  DeviceProtection: "No",
  TechSupport: "No",
  StreamingTV: "Yes",
  StreamingMovies: "Yes",
  Contract: "Month-to-month",
  PaperlessBilling: "Yes",
  PaymentMethod: "Electronic check",
  MonthlyCharges: 95.80,
  TotalCharges: 95.80
};

const PRESET_LOW_RISK = {
  gender: "Male",
  SeniorCitizen: 0,
  Partner: "Yes",
  Dependents: "Yes",
  tenure: 64,
  PhoneService: "Yes",
  MultipleLines: "Yes",
  InternetService: "DSL",
  OnlineSecurity: "Yes",
  OnlineBackup: "Yes",
  DeviceProtection: "Yes",
  TechSupport: "Yes",
  StreamingTV: "Yes",
  StreamingMovies: "Yes",
  Contract: "Two year",
  PaperlessBilling: "No",
  PaymentMethod: "Credit card (automatic)",
  MonthlyCharges: 79.50,
  TotalCharges: 5088.00
};

function setupPresets() {
  presetHighRiskBtn.addEventListener("click", () => applyPreset(PRESET_HIGH_RISK));
  presetLowRiskBtn.addEventListener("click", () => applyPreset(PRESET_LOW_RISK));
}

function applyPreset(preset) {
  Object.assign(state, preset);
  syncStateToUI();
  hideError();
  document.querySelectorAll(".field-item.has-error").forEach((el) => el.classList.remove("has-error"));
  updateSignalsCounter();
  
  // Smooth scroll to form
  document.getElementById("formSection").scrollIntoView({ behavior: "smooth" });
}

/**
 * Synchronizes the internal `state` object back to all UI controls
 */
function syncStateToUI() {
  // Update inputs
  tenureInput.value = state.tenure !== null ? state.tenure : "";
  updateTenureBadge();

  monthlyChargesInput.value = state.MonthlyCharges !== null ? state.MonthlyCharges.toFixed(2) : "";
  totalChargesInput.value = state.TotalCharges !== null ? state.TotalCharges.toFixed(2) : "";

  // Update Selectable Groups
  document.querySelectorAll(".btn-group:not(.btn-group-yn)").forEach((group) => {
    const field = group.dataset.field;
    if (!field || !(field in state)) return;

    group.querySelectorAll(".select-btn").forEach((btn) => {
      btn.classList.toggle("active", state[field] !== null && btn.dataset.value === state[field]);
    });
  });

  // Update Yes/No Groups
  document.querySelectorAll(".btn-group-yn").forEach((group) => {
    const field = group.dataset.field;
    if (!field || !(field in state)) return;

    const isNumericBinary = group.dataset.type === "numeric-binary";
    const currentVal = state[field];

    group.querySelectorAll(".yn-btn").forEach((btn) => {
      if (currentVal === null) {
        btn.classList.remove("active");
      } else if (isNumericBinary) {
        btn.classList.toggle("active", Number(btn.dataset.value) === Number(currentVal));
      } else {
        btn.classList.toggle("active", btn.dataset.value === currentVal);
      }
    });
  });

  // Update Payment Method cards
  const paymentGrid = document.querySelector(".payment-cards-grid");
  if (paymentGrid) {
    paymentGrid.querySelectorAll(".payment-card").forEach((card) => {
      card.classList.toggle("active", state.PaymentMethod !== null && card.dataset.value === state.PaymentMethod);
    });
  }
}

// ============================================================================
// 8. Progress Rail / ScrollSpy
// ============================================================================
function setupScrollSpy() {
  const sections = [
    document.getElementById("section-profile"),
    document.getElementById("section-account"),
    document.getElementById("section-services"),
    document.getElementById("section-billing"),
    document.getElementById("resultSection")
  ].filter(Boolean);

  const navLinks = document.querySelectorAll(".progress-bar-nav .step-item");

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 180;

    sections.forEach((sec) => {
      if (sec.style.display === "none") return;

      const top = sec.offsetTop;
      const height = sec.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        const id = sec.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.target === id);
        });
      }
    });
  }, { passive: true });
}

// ============================================================================
// 9. Validation & Prediction Pipeline
// ============================================================================
predictBtn.addEventListener("click", handlePredictClick);

async function handlePredictClick() {
  hideError();

  // 1. Validation across all fields
  const missingFields = validateForm();
  if (missingFields.length > 0) {
    highlightMissingFields(missingFields);
    return;
  }

  // 2. Prepare Payload (Strict conformity with FastAPI CustomerData schema)
  const payload = {
    gender: String(state.gender),
    SeniorCitizen: Number(state.SeniorCitizen),
    Partner: String(state.Partner),
    Dependents: String(state.Dependents),
    tenure: Number(state.tenure),
    PhoneService: String(state.PhoneService),
    MultipleLines: String(state.MultipleLines),
    InternetService: String(state.InternetService),
    OnlineSecurity: String(state.OnlineSecurity),
    OnlineBackup: String(state.OnlineBackup),
    DeviceProtection: String(state.DeviceProtection),
    TechSupport: String(state.TechSupport),
    StreamingTV: String(state.StreamingTV),
    StreamingMovies: String(state.StreamingMovies),
    Contract: String(state.Contract),
    PaperlessBilling: String(state.PaperlessBilling),
    PaymentMethod: String(state.PaymentMethod),
    MonthlyCharges: Number(state.MonthlyCharges),
    TotalCharges: Number(state.TotalCharges)
  };

  // 3. Loading State
  setLoadingState(true);

  try {
    const response = await fetch(PREDICT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const detail = errJson?.detail || `Server responded with HTTP ${response.status}`;
      throw new Error(detail);
    }

    const data = await response.json();
    renderPredictionResult(data);
  } catch (err) {
    console.error("Prediction Error:", err);
    showError(
      "Unable to connect to the prediction server. Please make sure the FastAPI backend is running at http://127.0.0.1:8000.",
      "Unable to connect to the prediction server.",
      true
    );
  } finally {
    setLoadingState(false);
  }
}

function validateForm() {
  const missing = [];

  const checks = [
    { key: "gender", label: "Gender" },
    { key: "SeniorCitizen", label: "SeniorCitizen" },
    { key: "Partner", label: "Partner" },
    { key: "Dependents", label: "Dependents" },
    { key: "tenure", label: "Tenure" },
    { key: "Contract", label: "Contract" },
    { key: "MonthlyCharges", label: "MonthlyCharges" },
    { key: "TotalCharges", label: "TotalCharges" },
    { key: "PhoneService", label: "PhoneService" },
    { key: "MultipleLines", label: "MultipleLines" },
    { key: "InternetService", label: "InternetService" },
    { key: "OnlineSecurity", label: "OnlineSecurity" },
    { key: "OnlineBackup", label: "OnlineBackup" },
    { key: "DeviceProtection", label: "DeviceProtection" },
    { key: "TechSupport", label: "TechSupport" },
    { key: "StreamingTV", label: "StreamingTV" },
    { key: "StreamingMovies", label: "StreamingMovies" },
    { key: "PaperlessBilling", label: "PaperlessBilling" },
    { key: "PaymentMethod", label: "PaymentMethod" }
  ];

  checks.forEach(({ key, label }) => {
    const val = state[key];
    if (val === null || val === undefined || val === "") {
      missing.push({ key, label });
    }
  });

  return missing;
}

function highlightMissingFields(missing) {
  // Clear any existing error outlines
  document.querySelectorAll(".field-item.has-error").forEach((el) => el.classList.remove("has-error"));

  // Highlight all missing fields
  missing.forEach(({ key }) => {
    const item = document.querySelector(`.field-item[data-field="${key}"]`);
    if (item) {
      item.classList.add("has-error");
    }
  });

  // Scroll to the first missing field
  const firstMissingKey = missing[0].key;
  const firstItem = document.querySelector(`.field-item[data-field="${firstMissingKey}"]`);
  if (firstItem) {
    firstItem.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Display clear alert message
  const missingLabels = missing.slice(0, 3).map((m) => m.label).join(", ");
  const moreCount = missing.length > 3 ? ` and ${missing.length - 3} more` : "";
  showError(
    `Please configure all fields according to the customer's attributes. Missing: <strong>${missingLabels}${moreCount}</strong>.`,
    "Customer Signals Incomplete",
    false
  );
}

function setLoadingState(isLoading) {
  if (isLoading) {
    predictBtn.disabled = true;
    predictBtn.classList.add("is-loading");
    btnSpinner.style.display = "inline-block";
    btnText.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = " Analyzing customer data...";
    });
  } else {
    predictBtn.disabled = false;
    predictBtn.classList.remove("is-loading");
    btnSpinner.style.display = "none";
    btnText.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = " PREDICT CHURN";
    });
  }
}

// ============================================================================
// 10. Result Presentation & Animation
// ============================================================================
function renderPredictionResult(data) {
  // Expected response structure:
  // { prediction: "Yes"|"No", churn_probability: 0.7682, risk_level: "High"|"Medium"|"Low" }

  const prediction = data.prediction || (data.churn_probability >= 0.5 ? "Yes" : "No");
  const probability = typeof data.churn_probability === "number" ? data.churn_probability : 0;
  const riskLevel = data.risk_level || "Medium";

  // 1. Reveal result section
  resultSection.style.display = "block";

  // 2. Verdict Badge & Label
  verdictBadge.className = "verdict-badge";
  if (prediction === "Yes") {
    verdictBadge.classList.add("churn-yes");
    verdictWord.textContent = "YES";
    verdictLabel.textContent = "Customer likely to churn";
    verdictMessage.textContent = "Customer has a higher predicted likelihood of churn.";
  } else {
    verdictBadge.classList.add("churn-no");
    verdictWord.textContent = "NO";
    verdictLabel.textContent = "Customer unlikely to churn";
    verdictMessage.textContent = "Customer has a lower predicted likelihood of churn.";
  }

  // 3. Risk Level Badge
  riskLevelBadge.className = "risk-level-badge";
  const normalizedRisk = riskLevel.toLowerCase();
  if (normalizedRisk === "high") {
    riskLevelBadge.classList.add("risk-high");
  } else if (normalizedRisk === "medium") {
    riskLevelBadge.classList.add("risk-medium");
  } else {
    riskLevelBadge.classList.add("risk-low");
  }
  riskLevelText.textContent = riskLevel.toUpperCase();

  // 4. Update Profile Highlights
  snapContract.textContent = state.Contract;
  snapTenure.textContent = `${state.tenure} ${state.tenure === 1 ? "month" : "months"}`;
  snapSpend.textContent = `$${state.MonthlyCharges !== null ? state.MonthlyCharges.toFixed(2) : "0.00"}`;

  // 5. Animate Gauge & Percentage
  animateCircularGauge(probability, normalizedRisk);

  // 6. Smooth scroll to result
  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

/**
 * Animates the SVG circular stroke and counts up percentage number
 */
function animateCircularGauge(probability, riskLevel) {
  const percentValue = Math.min(100, Math.max(0, probability * 100));

  // Determine stroke color based on risk level
  let strokeColor = "var(--accent-primary)";
  if (riskLevel === "high") strokeColor = "var(--color-danger)";
  else if (riskLevel === "medium") strokeColor = "var(--color-warning)";
  else if (riskLevel === "low") strokeColor = "var(--color-success)";

  gaugeProgressRing.style.stroke = strokeColor;

  // Animate SVG Stroke Dashoffset
  // Offset = circumference * (1 - probability)
  const targetOffset = GAUGE_CIRCUMFERENCE * (1 - probability);
  gaugeProgressRing.style.strokeDashoffset = targetOffset;

  // Animate Number Counting (0% -> target%)
  const duration = 1200; // ms
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentPercent = easeProgress * percentValue;

    churnPercentageDisplay.textContent = `${currentPercent.toFixed(2)}%`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      churnPercentageDisplay.textContent = `${percentValue.toFixed(2)}%`;
    }
  }

  requestAnimationFrame(updateCounter);
}

// ============================================================================
// 11. Error Handling & Reset Actions
// ============================================================================
function showError(message, title = "Action Required", showTerminalTip = false) {
  if (errorTitle) errorTitle.textContent = title;
  if (errorDescription) errorDescription.innerHTML = message;
  if (errorTerminalTip) errorTerminalTip.style.display = showTerminalTip ? "block" : "none";
  errorCard.style.display = "flex";
}

function hideError() {
  errorCard.style.display = "none";
}

dismissErrorBtn.addEventListener("click", hideError);

// Reset form & restart to clean state
resetBtn.addEventListener("click", () => {
  // Reset all state to null (clean user choice)
  Object.keys(state).forEach((k) => {
    state[k] = null;
  });

  syncStateToUI();
  hideError();

  // Clear all error highlights
  document.querySelectorAll(".field-item.has-error").forEach((el) => el.classList.remove("has-error"));

  // Reset gauge
  gaugeProgressRing.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
  churnPercentageDisplay.textContent = "0.00%";

  // Hide result card
  resultSection.style.display = "none";

  // Reset signals counter
  updateSignalsCounter();

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Edit inputs button
if (editInputsBtn) {
  editInputsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("formSection").scrollIntoView({ behavior: "smooth" });
  });
}
