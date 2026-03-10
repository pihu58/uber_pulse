# Uber Pulse – Driver Stress & Goal Tracking System

Uber Pulse is a driver-support system built during the **Uber Hackathon** to help drivers **monitor stressful situations during trips and track their earnings goals in real time**.

The platform analyzes multiple signals such as **audio intensity, driving motion patterns, and earnings velocity** to detect stressful moments during rides and provide insights into driver performance.

This allows drivers to:

- Identify stressful trip situations (e.g., arguments with customers)
- Monitor driving behavior signals
- Track their progress toward earnings goals
- Receive insights about their shift performance

---

# Problem Statement

Ride-hailing drivers frequently encounter **stressful situations during trips**, including conflicts with passengers, high-pressure driving environments, and long working hours.

Currently, there is **no system that helps drivers detect stress signals during trips or monitor how these situations affect their performance**.

Uber Pulse addresses this by building a system that:

- Detects **stress signals during trips**
- Analyzes **driver motion behavior**
- Tracks **earnings progress toward daily goals**

The system provides drivers with insights that help them better manage their trips and performance.

---

# Solution Overview

Uber Pulse combines **three types of signals**:

### 1. Audio Signals
Audio intensity is analyzed to detect **possible arguments or stressful conversations during trips**.

High audio intensity spikes may indicate:
- customer-driver arguments
- stressful interactions
- emotionally intense situations

### 2. Motion Sensor Data
Accelerometer data is used to detect **driving behavior events** such as:

- harsh braking
- sharp turns
- sudden impacts

These events can indicate **stressful driving conditions or reactions during tense situations**.

### 3. Earnings Tracking
Driver earnings are analyzed in real time to track:

- earnings velocity
- progress toward earnings goals
- projected goal achievement

---

# System Architecture

```
                Data Sources
                    │
 ┌──────────────────┼──────────────────┐
 │                  │                  │
Audio Signals   Motion Sensors     Earnings Logs
                 (Accelerometer)
 │                  │                  │
 ▼                  ▼                  ▼
Stress Signal    Motion Event       Earnings
Detection         Detection        Analysis
 │                  │                  │
 └────────────── Feature Aggregation ──────────────┘
                         │
                         ▼
                 Prediction Engine
                         │
                         ▼
                Driver Insight System
                         │
                         ▼
                    Frontend Dashboard
```

---

# Data Processing Pipelines

## Motion Data Pipeline

Accelerometer sensor data is processed to detect motion-based driving events.

Pipeline steps:

1. Load raw accelerometer data
2. Remove duplicate records
3. Handle missing values
4. Sort by timestamp
5. Remove outliers
6. Compute motion severity metrics
7. Detect motion events
8. Aggregate events per driver

Detected events include:

- harsh braking
- moderate braking
- sharp turns
- impact events

These events help understand **driver behavior during stressful situations**.

---

# Stress Detection from Audio

Audio intensity is analyzed to detect **stressful moments during trips**.

Possible indicators include:

- sudden spikes in audio intensity
- repeated high-volume events
- prolonged high-intensity audio signals

These signals may correspond to **arguments between drivers and passengers**.

---

# Earnings Goal Tracking

The system tracks driver progress toward earnings goals.

Key metrics include:

- cumulative earnings
- earnings velocity
- time remaining in shift
- earnings gap
- projected goal achievement

Drivers can use these insights to **monitor their shift performance in real time**.

---

# Machine Learning System

The ML pipeline predicts whether a driver is likely to achieve their earnings goal.

### Classification Model

Predicts goal achievement.

Algorithm used:

```
XGBoost Classifier
```

### Regression Model

Predicts the final earnings ratio.

Algorithm used:

```
XGBoost Regressor
```

---

# Model Performance

| Metric | Result |
|------|------|
Accuracy | 88.2% |
ROC-AUC | 0.89 |
RMSE | 0.089 |
R² Score | 0.89 |

The model significantly improves prediction accuracy compared to simple rule-based approaches.

---

# Frontend Dashboard

A frontend dashboard was developed to display driver insights.

Dashboard features include:

- stress signal indicators
- motion event summaries
- driver performance metrics
- earnings goal tracking

Due to hackathon time constraints, some data displayed in the dashboard is **hardcoded for demonstration purposes**.

---

# Technology Stack

## Backend
- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost

## Data Processing
- Sensor signal analysis
- Feature engineering pipelines

## Frontend
- HTML
- CSS
- JavaScript

---

# Team

### Manit
- Earnings velocity analysis
- Feature engineering
- ML model development
- Prediction pipeline

### Yogita
- Motion sensor data analysis
- Motion event detection pipeline
- Data preprocessing
- Frontend dashboard development

### Pihu
- Audio signal analysis
- Stress detection features
- Integration with system pipeline

---

# Future Improvements

Possible improvements include:

- real-time streaming sensor analysis
- advanced ML models for stress detection
- full backend–frontend integration
- live driver safety alerts
- larger datasets for behavior modeling

---

# Hackathon Submission

Project developed as part of the **Uber Hackathon Challenge**.

Repository:

```
https://github.com/pihu58/uber_pulse
```

# Website link

[DriverPulse](https://uber-pulse.vercel.app/)

