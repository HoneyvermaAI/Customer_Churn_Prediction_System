# Customer Churn Predictor — AI Retention Intelligence

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-EB6440?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![JavaScript](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/Modern%20CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A full-stack, production-grade Machine Learning web application designed to evaluate subscriber retention risk. Powered by a trained **XGBoost Classifier** embedded in a **Scikit-Learn Pipeline** with a high-performance **FastAPI** backend and a premium dark-mode glassmorphism dashboard built with modern vanilla web technologies.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Project Architecture](#-project-architecture)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [API Reference](#-api-reference)
- [Installation & Quickstart](#-installation--quickstart)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Launch](#2-frontend-launch)
- [UI / UX Highlights](#-ui--ux-highlights)
- [Tech Stack](#-tech-stack)

---

## 🚀 Overview

Customer churn prediction is a critical capability in the telecommunications and subscription economy. Acquiring new subscribers can cost up to **5x to 7x more** than retaining existing ones. 

This application bridges the gap between machine learning modeling and interactive business intelligence:
- Takes **19 multi-dimensional customer signals** (demographics, account details, contracted services, and billing behavior).
- Computes churn probability and assigns calibrated risk classifications (`Low`, `Medium`, `High`) in real time.
- Delivers an intuitive, tactile interface for data science portfolio presentation, internal stakeholder demonstrations, or customer retention teams.

---

## ✨ Key Features

- **Tactile Yes/No Button Groups**: No generic dropdowns, checkboxes, or raw inputs. Every binary parameter uses responsive toggle buttons with high-contrast active states.
- **Pure User Choice**: Form starts clean with zero pre-filled assumptions; fields activate upon user interaction.
- **Real-Time Signal Progress Counter**: Live tracking indicator showing progress from `0 of 19` to `All 19 customer signals configured`.
- **Intelligent Validation & Auto-Scroll**: Highlights incomplete signals with red borders and animations, then auto-scrolls straight to the first missing field.
- **Animated AI Results Dashboard**:
  - **Verdict Card**: High-visibility `YES` / `NO` outcome with contextual retention guidance.
  - **Animated Circular SVG Gauge**: Smoothly counts up the churn probability from `0.00%` to the exact model output.
  - **Calibrated Risk Level**: `LOW (<40%)`, `MEDIUM (40–70%)`, or `HIGH (≥70%)` with color-coded alerts.
  - **Signal Snapshot**: Live summary of key attributes evaluated during inference.
- **One-Click Test Presets**: Built-in `Load High Risk Sample` and `Load Low Risk Sample` buttons for instant 1-click model demonstrations.
- **Backend Health Watchdog**: Pings `/health` periodically and renders live connection status (`● MODEL ONLINE` / `● BACKEND OFFLINE`).
- **Responsive Dark Glassmorphic Design**: Tailored for desktop, tablet, and mobile with CSS custom properties, backdrop blur, and touch targets $\ge 48\text{px}$.

---

## 📂 Project Architecture

```
Customer_Churn/
├── app.py                          # FastAPI application and prediction endpoint
├── customer_churn_model.pkl        # Serialized Scikit-Learn / XGBoost ML Pipeline
├── Requirements.txt                # Python backend dependencies
├── Telco-Customer-Churn.csv        # Historical dataset used for model training
├── Customer_Churn_Analysis.ipynb   # Exploratory Data Analysis & training notebook
├── README.md                       # Project documentation
│
└── frontend/                       # Modern AI Dashboard Frontend
    ├── index.html                  # Semantic dashboard structure & layout
    ├── style.css                   # Glassmorphism dark UI, animations & responsive styling
    └── script.js                   # State management, validation, API requests & gauge animation
```

---

## 🧠 Machine Learning Pipeline

The underlying predictive engine is a serialized **Scikit-Learn Pipeline** (`customer_churn_model.pkl`) trained on the Telco Customer Churn dataset using an **XGBoost Classifier**.

### Evaluated Customer Signals (19 Features)

| # | Section | Feature Name | Expected Type | Description / Values |
|---|---|---|---|---|
| 1 | **Customer Profile** | `gender` | `str` | `"Male"`, `"Female"` |
| 2 | | `SeniorCitizen` | `int` | `1` (Yes), `0` (No) |
| 3 | | `Partner` | `str` | `"Yes"`, `"No"` |
| 4 | | `Dependents` | `str` | `"Yes"`, `"No"` |
| 5 | **Account Information** | `tenure` | `int` | Number of months subscribed ($\ge 0$) |
| 6 | | `Contract` | `str` | `"Month-to-month"`, `"One year"`, `"Two year"` |
| 7 | | `MonthlyCharges` | `float` | Monthly billing amount in USD |
| 8 | | `TotalCharges` | `float` | Cumulative billing amount in USD |
| 9 | **Services** | `PhoneService` | `str` | `"Yes"`, `"No"` |
| 10 | | `MultipleLines` | `str` | `"Yes"`, `"No"` |
| 11 | | `InternetService` | `str` | `"DSL"`, `"Fiber optic"`, `"No"` |
| 12 | | `OnlineSecurity` | `str` | `"Yes"`, `"No"` |
| 13 | | `OnlineBackup` | `str` | `"Yes"`, `"No"` |
| 14 | | `DeviceProtection` | `str` | `"Yes"`, `"No"` |
| 15 | | `TechSupport` | `str` | `"Yes"`, `"No"` |
| 16 | **Streaming & Billing** | `StreamingTV` | `str` | `"Yes"`, `"No"` |
| 17 | | `StreamingMovies` | `str` | `"Yes"`, `"No"` |
| 18 | | `PaperlessBilling` | `str` | `"Yes"`, `"No"` |
| 19 | | `PaymentMethod` | `str` | `"Electronic check"`, `"Mailed check"`, `"Bank transfer (automatic)"`, `"Credit card (automatic)"` |

### Risk Threshold Logic
- **High Risk**: Churn Probability $\ge 70\%$
- **Medium Risk**: $40\% \le$ Churn Probability $< 70\%$
- **Low Risk**: Churn Probability $< 40\%$

---

## 📡 API Reference

### 1. Root Status
- **URL**: `GET /`
- **Response**:
  ```json
  {
    "message": "Customer Churn Prediction API is running",
    "status": "success"
  }
  ```

### 2. Health Check
- **URL**: `GET /health`
- **Response**:
  ```json
  {
    "status": "healthy",
    "model_loaded": true
  }
  ```

### 3. Predict Churn
- **URL**: `POST /predict`
- **Content-Type**: `application/json`

#### Sample Request Payload:
```json
{
  "gender": "Female",
  "SeniorCitizen": 1,
  "Partner": "No",
  "Dependents": "No",
  "tenure": 1,
  "PhoneService": "Yes",
  "MultipleLines": "No",
  "InternetService": "Fiber optic",
  "OnlineSecurity": "No",
  "OnlineBackup": "No",
  "DeviceProtection": "No",
  "TechSupport": "No",
  "StreamingTV": "Yes",
  "StreamingMovies": "Yes",
  "Contract": "Month-to-month",
  "PaperlessBilling": "Yes",
  "PaymentMethod": "Electronic check",
  "MonthlyCharges": 95.80,
  "TotalCharges": 95.80
}
```

#### Sample Response:
```json
{
  "prediction": "Yes",
  "churn_probability": 0.7961,
  "risk_level": "High"
}
```

---

## 🛠️ Installation & Quickstart

### Prerequisites
- **Python 3.10+**
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 1. Backend Setup

1. **Open a terminal** in the project directory:
   ```bash
   cd Customer_Churn
   ```

2. **Activate the virtual environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     .\.venv\Scripts\activate.bat
     ```
   - **Linux / macOS**:
     ```bash
     source .venv/bin/activate
     ```

3. **Install dependencies** (if not already installed):
   ```bash
   pip install -r Requirements.txt
   ```

4. **Start the FastAPI backend server**:
   ```bash
   uvicorn app:app --reload
   ```
   *The backend will be live at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

---

### 2. Frontend Launch

You can open the frontend in either of two ways:

#### Option A: Direct Browser Launch (Simplest)
Open the file [`frontend/index.html`](file:///c:/Users/honey/OneDrive/Desktop/Customer_Churn/frontend/index.html) directly in any web browser. Because CORS is enabled on the FastAPI backend (`allow_origins=["*"]`), API communication works out of the box.

#### Option B: Local HTTP Server
In a separate terminal window, serve the frontend directory:
```bash
python -m http.server 3000 --directory frontend
```
Then visit:
```
http://localhost:3000
```

---

## 🎨 UI / UX Highlights

```
  [ APP LAUNCH ]
         │
         ▼
  [ Hero Section ] ───────► Real-Time "MODEL ONLINE" Health Status
         │                  Pure CSS Animated AI Telemetry Visual
         ▼
  [ Progressive Stepper ] ─► PROFILE ─► ACCOUNT ─► SERVICES ─► BILLING ─► RESULT
         │
         ▼
  [ 4 Form Sections ] ────► Tactile Yes/No Toggle Buttons (No dropdowns)
         │                  Live Counter: "X of 19 signals configured"
         ▼
  [ Predict Action ] ─────► Comprehensive Validation & Auto-Scroll on Incomplete Fields
         │                  Async non-blocking fetch() with spinner
         ▼
  [ Results Dashboard ] ──► Outcome: YES / NO
                            Animated Circular SVG Gauge (0.00% ─► Actual %)
                            Risk Classification (Low / Med / High)
                            Reset: "Predict Another Customer"
```

---

## 💻 Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), [Pydantic](https://docs.pydantic.dev/)
- **Machine Learning**: [XGBoost](https://xgboost.readthedocs.io/), [Scikit-Learn](https://scikit-learn.org/), [Pandas](https://pandas.pydata.org/), [Joblib](https://joblib.readthedocs.io/)
- **Frontend**: Semantic HTML5, Modern CSS3 (Glassmorphism, Flexbox, CSS Grid, Custom Properties), Vanilla JavaScript (ES6+, Fetch API, SVG Animations)
- **Zero Heavy JS Frameworks**: No React, Next.js, Bootstrap, or Tailwind overhead — instantaneous loading and 100% maintainable native code.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, adapt, and build upon it for portfolio or commercial demonstrations.
