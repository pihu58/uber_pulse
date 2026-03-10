# Uber Hackathon - My Work Log (Manit - Earnings Analysis Lead)

## Team Structure
- **Manit**: Earnings velocity tracking, goal achievement prediction, ML model development
- **Yogita**: Accelerometer data processing, motion event aggregation
- **Pihu**: Audio intensity analysis, stress detection

---

## March 5, 2026 - Planning & Setup

### Team Meeting
- **Problem Discussion**: Reviewed challenge requirements - build ML system to track driver earnings velocity and predict goal achievement in real-time
- **Doubts Clarification**:
  - Confirmed target variable: binary goal achievement (achieved vs not achieved)
  - Discussed feature leakage concerns - must use only data available at checkpoint time
  - Clarified extreme velocity values (700+ $/hr) are real surge scenarios, not errors
  - Decided on model choice: XGBoost/LightGBM for interpretability + performance

### My Task Allocation
- Lead earnings analysis and ML pipeline
- Integrate sensor data from team members
- Build master dataset and train models
- Create real-time inference system

### What Delivered Today
✅ Defined 12-step implementation roadmap across 4 phases
✅ Set up notebook structure (earnings.ipynb)

---

## March 6, 2026 - Data Exploration Day

### Morning Session (9 AM - 12 PM)
**Loading & Initial Inspection**
- ✅ Loaded 6 datasets into pandas: drivers, trips, goals, velocity logs, trip summaries, flagged moments
- ✅ Checked data shapes and quality:
  - Drivers: 220 rows × 7 columns
  - Trips: 220 rows × 9 columns
  - Driver goals: 210 rows × 8 columns
  - Earnings velocity log: 221 rows × 11 columns

**Earnings Velocity Analysis**
- ✅ Velocity distribution analysis:
  - Range: 14.7 - 2,834.1 $/hr (median: 121.7 $/hr)
  - 221 velocity checkpoints across 118 unique drivers
  - Forecast status: 77 ahead, 78 on_track, 66 at_risk
- ✅ Discovered extreme velocities (>700 $/hr) - decided to keep as valid surge scenarios

**Driver Goals Analysis**
- ✅ Goal achievement breakdown:
  - 210 total goals tracked
  - Achievement rate: 63.3% (133 achieved, 77 not achieved)
  - Target earnings range: 800-1,500 ₹
  - Target hours: 8-10 hours per shift

### Afternoon Session (1 PM - 5 PM)
**Visualizations Created**
- ✅ 4-panel visualization dashboard:
  - Current velocity distribution histogram
  - Velocity delta distribution (showing positive/negative deviations)
  - Box plots: velocity_delta by forecast_status
  - Scatter plot: cumulative earnings vs elapsed hours
  
**Key Insights Discovered**
- ✅ Velocity_delta strongly correlates with goal achievement (as expected)
- ✅ Negative velocity deltas occur in ~40% of checkpoints (drivers falling behind)
- ✅ Extreme velocities appear during short time windows with surge pricing
- ✅ Most drivers cluster around 100-200 $/hr velocity range

**Data Quality Issues Identified**
- ✅ Some missing values in driver profiles (handled with 0 fill)
- ✅ Infinity values possible from division by zero (planned handling strategy)
- ✅ Timestamp parsing needed for time-based features

---

## March 7, 2026 - Feature Engineering Day

### Morning Session (9 AM - 12 PM)
**Master Dataset Creation**
- ✅ Merged earnings velocity log with driver goals on (driver_id + date):
  - Result: 221 velocity checkpoints with target labels
  - Missing target: 11 rows (dropped later)
  
- ✅ Joined driver profiles (experience, rating, city, shift preference)
  - Added 6 driver-level features
  
- ✅ Aggregated trip features per driver:
  - avg_surge, max_surge (from surge_multiplier)
  - avg_duration_min, avg_distance_km, avg_fare
  - Result: 5 trip-level features per driver

- ✅ Integrated sensor data from Yogita & Pihu:
  - Fixed column name mismatch (motion_events_count vs motion_events)
  - Aggregated: total_motion_events, total_audio_events, avg_stress_score
  - Result: 3 quality features per driver

### Afternoon Session (1 PM - 5 PM)
**Feature Engineering Pipeline**

**1. Progress Metrics (3 features)**
- ✅ progress_percent = (cumulative_earnings / target_earnings) × 100
- ✅ hours_progress_percent = (elapsed_hours / target_hours) × 100
- ✅ earnings_gap = target_earnings - cumulative_earnings

**2. Velocity Trends (5 features)**
- ✅ velocity_acceleration = current_velocity - target_velocity
- ✅ required_velocity = earnings_gap / time_remaining_hours
- ✅ velocity_volatility = abs(velocity_delta)
- ✅ velocity_rolling_mean (2-checkpoint window per driver)
- ✅ velocity_rolling_std (2-checkpoint window per driver)

**3. Time Features (3 features)**
- ✅ hour_of_day (extracted from timestamp)
- ✅ time_remaining_hours = target_hours - elapsed_hours
- ✅ shift_stage (early/mid/late/overtime based on hours_progress_percent)

**4. Efficiency Metrics (2 features)**
- ✅ trips_per_hour = trips_completed / elapsed_hours
- ✅ earnings_per_trip = cumulative_earnings / trips_completed

**5. Lag Features (1 feature)**
- ✅ velocity_lag1 (previous checkpoint velocity per driver)

**6. Categorical Encoding**
- ✅ One-hot encoded: city, shift_preference, shift_stage
- ✅ Result: Added 15+ dummy variables

### Evening Session (5 PM - 7 PM)
**Data Cleaning & Finalization**
- ✅ Handled missing values:
  - Filled numeric columns with 0
  - Dropped 11 rows with missing target (goal_achieved)
  
- ✅ Replaced infinity values (from division by zero)
- ✅ Final verification: no NaN, no Inf in dataset

**Final Dataset Metrics**
- ✅ **221 samples × 67 features** ready for modeling
- ✅ Target distribution: 63.3% achieved, 36.7% not achieved
- ✅ No data leakage verified - all features use only past data

---

## March 8, 2026 - Model Training Day

### Morning Session (9 AM - 12 PM)
**Data Splitting**
- ✅ Split strategy: 70% train, 15% validation, 15% test
- ✅ Results:
  - Train: 154 samples (70%)
  - Validation: 33 samples (15%)
  - Test: 34 samples (15%)
- ✅ Stratified split maintains target distribution across all sets

**Baseline Model 1: Threshold Rule**
- ✅ Simple rule: "achieved" if velocity_delta > 0
- ✅ Validation accuracy: **51.5%** (barely better than random)
- ✅ This is the rule-based system we're trying to beat

**Baseline Model 2: Logistic Regression**
- ✅ Scaled features with StandardScaler
- ✅ Trained with max_iter=1000
- ✅ Validation performance:
  - Accuracy: **78.8%**
  - ROC-AUC: **0.86**
  - Precision: 82.4%, Recall: 77.8%, F1: 80.0%
- ✅ This becomes our baseline to beat (+27.3pp improvement over threshold rule)

### Afternoon Session (1 PM - 5 PM)
**XGBoost Classifier Training**
- ✅ Model configuration:
  - n_estimators=100, max_depth=6, learning_rate=0.1
  - eval_metric='logloss', random_state=42
  
- ✅ Training completed with early stopping monitoring
- ✅ Validation performance:
  - Accuracy: **87.9%** (+9.1pp vs Logistic Regression)
  - ROC-AUC: **0.93**
  - Precision: 88.9%, Recall: 88.9%, F1: 88.9%
  - Confusion Matrix: 5/33 errors, well-balanced

**Feature Importance Analysis**
- ✅ Extracted feature importances from XGBoost
- ✅ Top 5 features identified:
  1. velocity_delta (highest importance)
  2. progress_percent
  3. earnings_gap
  4. time_remaining_hours
  5. velocity_rolling_mean
  
- ✅ Created visualization: horizontal bar chart of top 15 features
- ✅ Verified no unexpected features dominating (sanity check passed)

### Evening Session (5 PM - 8 PM)
**XGBoost Regressor Training**
- ✅ Target: achievement_ratio (final_earnings / target_earnings)
- ✅ Same hyperparameters as classifier
- ✅ Validation performance:
  - RMSE: **0.0913** (9.13% average error)
  - MAE: **0.0603** (6.03% average error)
  - R² Score: **0.8947** (89.47% variance explained)

- ✅ Created scatter plot: predicted vs actual achievement ratio
- ✅ Most predictions fall close to diagonal line (good fit)

**Test Set Evaluation**
- ✅ Final holdout test results:
  - **Classification**: 88.2% accuracy, 0.89 ROC-AUC
  - **Regression**: RMSE 0.0896, R² 0.8921
  - Confusion matrix: 30/34 correct predictions (4 errors)

**Verification Checks Passed**
- ✅ Achieved >75% accuracy target (88.2% actual)
- ✅ Beat threshold baseline by 36.7pp (target: ≥12pp)
- ✅ Beat logistic baseline by 9.4pp
- ✅ Top features include velocity_delta, progress_percent, time_remaining ✓

---

## March 9, 2026 - Inference System Day

### Morning Session (9 AM - 12 PM)
**Inference Function Development**
- ✅ Created `predict_goal_achievement()` function:
  - Input: driver_state (DataFrame or dict with current checkpoint data)
  - Output: dict with prediction results
  
- ✅ Function components:
  - Feature validation & missing column handling
  - Classification prediction (goal achievement probability)
  - Regression prediction (final earnings forecast)
  - Status determination based on thresholds
  - Recommendation generation

**Status Thresholds Implemented**
- ✅ **Ahead**: probability > 0.65 (high confidence)
- ✅ **On Track**: probability 0.35-0.65 (moderate confidence)
- ✅ **At Risk**: probability < 0.35 (low confidence)

**Recommendation Logic**
- ✅ For "at_risk": Calculate exact velocity adjustment needed
  - "Need ₹X more in next Y hours at Z $/hr (adjust velocity by +N $/hr)"
  
- ✅ For "on_track": Show projected finish
  - "Maintain current pace. Projected to finish at ₹X"
  
- ✅ For "ahead": Encourage continued performance
  - "On track to exceed goal! Projected final earnings: ₹X"

### Afternoon Session (1 PM - 4 PM)
**Testing & Validation**
- ✅ Tested on 5 random drivers from test set
- ✅ Results validation:
  - Driver at_risk with prob=0.23 → recommendation calculated correctly
  - Driver ahead with prob=0.89 → forecast shows exceeding goal
  - Driver on_track with prob=0.52 → actionable guidance provided

- ✅ Verified prediction-outcome alignment:
  - Drivers predicted "ahead" mostly achieved goals ✓
  - Drivers predicted "at_risk" mostly didn't achieve ✓
  
- ✅ Recommendation accuracy check:
  - Required velocity calculations mathematically correct ✓
  - Time remaining properly computed ✓
  - Earnings gap properly tracked ✓

### Evening Session (4 PM - 6 PM)
**Model Persistence & Documentation**
- ✅ Saved models using pickle:
  - xgb_classifier.pkl (classification model)
  - xgb_regressor.pkl (regression model)
  - feature_columns.pkl (67 feature names in order)
  - scaler.pkl (StandardScaler for logistic regression baseline)

- ✅ Created implementation summary (Cell 37):
  - Phase 1: Complete ✓
  - Phase 2: Complete ✓
  - Phase 3: Complete ✓
  - Ready for Phase 4 (optional visualizations)

**Final Deliverables**
- ✅ Complete earnings.ipynb with 37 cells
- ✅ All models trained, validated, and saved
- ✅ Inference function operational and tested
- ✅ Achievement: **88.2% test accuracy, 0.89 ROC-AUC** (exceeds all targets)

**Code Quality**
- ✅ All cells executable in sequence
- ✅ Clear markdown documentation between phases
- ✅ Visualizations embedded for easy review
- ✅ Error handling implemented (NaN checks, infinity handling)


