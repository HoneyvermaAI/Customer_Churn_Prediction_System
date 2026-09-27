# Customer Churn Predictor — AI Retention Intelligence

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge\&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-EB6440?style=for-the-badge\&logo=xgboost\&logoColor=white)](https://xgboost.readthedocs.io/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge\&logo=scikit-learn)](https://scikit-learn.org/)
[![JavaScript](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/Modern%20CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A full-stack Machine Learning web application designed to evaluate subscriber retention risk. Powered by a trained **XGBoost Classifier** embedded in a **Scikit-Learn Pipeline**, with a high-performance **FastAPI** backend and a responsive dark-mode dashboard built with modern vanilla web technologies.

---

## 🌐 Live Demo
https://customer-churn-prediction-system-tawny.vercel.app/
### 🚀 Frontend

**Customer Churn Prediction System:**
https://customer-churn-prediction-system-tawny.vercel.app/

### ⚡ Backend API

**FastAPI Backend:**
https://customer-churn-api-dnkq.onrender.com

### 📚 API Documentation

**Interactive Swagger Docs:**
https://customer-churn-api-dnkq.onrender.com/docs

> The frontend is deployed on **Vercel**, while the FastAPI machine learning backend is deployed on **Render**.

---

## 📑 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [Project Architecture](#-project-architecture)
* [Machine Learning Pipeline](#-machine-learning-pipeline)
* [API Reference](#-api-reference)
* [Installation & Quickstart](#-installation--quickstart)
* [UI / UX Highlights](#-ui--ux-highlights)
* [Tech Stack](#-tech-stack)

---

## 🚀 Overview

Customer churn prediction is a critical capability in the telecommunications and subscription economy.

This application bridges the gap between machine learning modeling and interactive business intelligence:

* Takes **19 multi-dimensional customer signals** including demographics, account details, services, and billing behavior.
* Computes churn probability and assigns risk classifications: `Low`, `Medium`, or `High`.
* Provides an interactive dashboard for real-time customer churn prediction.
* Separates the frontend and ML backend into independently deployed services.

---

## ✨ Key Features

* **Tactile Yes/No Button Groups**: Responsive toggle buttons instead of generic dropdowns or checkboxes.
* **Pure User Choice**: Form starts clean with zero pre-filled assumptions.
* **Real-Time Signal Progress Counter**: Tracks progress from `0 of 19` to `All 19 customer signals configured`.
* **Intelligent Validation & Auto-Scroll**: Highlights incomplete fields and automatically scrolls to the first missing field.
* **Animated AI Results Dashboard**:

  * **Verdict Card**: Displays `YES` / `NO` churn prediction.
  * **Animated Circular SVG Gauge**: Displays the predicted churn probability.
  * **Risk Level**: `LOW`, `MEDIUM`, or `HIGH`.
  * **Signal Snapshot**: Displays key customer attributes used during prediction.
* **One-Click Test Presets**: High-risk and low-risk sample customers.
* **Backend Health Watchdog**: Continuously checks the `/health` endpoint.
* **Responsive Dark Glassmorphic Design**: Optimized for desktop, tablet, and mobile.

---

## 📂 Project Architecture

```text
Customer_Churn/
│
├── app.py
├── customer_churn_model.pkl
├── Requirements.txt
├── Telco-Customer-Churn.csv
├── Customer_Churn_Analysis.ipynb
├── README.md
│
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

---

## 🧠 Machine Learning Pipeline

The predictive engine is a serialized **Scikit-Learn Pipeline** containing an **XGBoost Classifier**, trained on the Telco Customer Churn dataset.

### Evaluated Customer Signals

The model receives 19 customer features covering:

* Customer demographics
* Account information
* Subscription tenure
* Contract type
* Internet and phone services
* Security and support services
* Streaming services
* Billing information
* Payment method

### Risk Threshold Logic

* **High Risk**: Churn Probability ≥ 70%
* **Medium Risk**: 40% ≤ Churn Probability < 70%
* **Low Risk**: Churn Probability < 40%

---

## 📡 API Reference

**Live Backend URL:**
https://customer-churn-api-dnkq.onrender.com

**Interactive Swagger Docs:**
https://customer-churn-api-dnkq.onrender.com/docs

### Root Status

```http
GET /
```

### Health Check

```http
GET /health
```

### Predict Churn

```http
POST /predict
```

**Content-Type:**

```text
application/json
```

### Sample Request

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

### Sample Response

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

* Python 3.10+
* Modern web browser
* Git

### 1. Backend Setup

```bash
git clone <your-repository-url>
cd Customer_Churn
```

Create and activate a virtual environment:

**Windows PowerShell**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux / macOS**

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r Requirements.txt
```

Start the FastAPI backend:

```bash
uvicorn app:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### 2. Frontend Launch

The frontend is located inside the `frontend` directory.

You can launch it using:

```bash
python -m http.server 3000 --directory frontend
```

Then open:

```text
http://localhost:3000
```

---

## 🎨 UI / UX Highlights

```text
[ APP LAUNCH ]
       │
       ▼
[ Hero Section ]
       │
       ▼
[ PROFILE ]
       │
       ▼
[ ACCOUNT ]
       │
       ▼
[ SERVICES ]
       │
       ▼
[ BILLING ]
       │
       ▼
[ PREDICT CHURN ]
       │
       ▼
[ RESULTS DASHBOARD ]
       │
       ├── YES / NO Prediction
       ├── Churn Probability
       ├── Risk Classification
       └── Customer Signal Snapshot
```

---

## 💻 Tech Stack

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Machine Learning

* XGBoost
* Scikit-Learn
* Pandas
* Joblib

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Fetch API
* SVG Animations

### Deployment

* **Frontend:** Vercel
* **Backend:** Render

---

## 📄 License

This project is licensed under the MIT License.
Feel free to use, adapt, and build upon it for portfolio or commercial demonstrations.
