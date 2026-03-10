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

# Uber Hackathon - My Work Log (Yogita - Motion Analysis & Frontend)

## Team Structure
- **Manit**: Earnings velocity tracking, goal achievement prediction, ML model development  
- **Yogita**: Accelerometer data analysis, motion event detection, frontend development  
- **Pihu**: Audio intensity analysis, stress detection, project deployment

---

# March 4, 2026 – Problem Understanding & Initial Exploration

## Problem Statement Review
- Carefully reviewed the **Uber Pulse hackathon problem statement** to understand system requirements.
- Key objective identified:
  - Build a system capable of **tracking driver performance signals in real-time**.
  - Integrate **earnings velocity + behavioral signals (motion/audio)** to understand driver status.

## Initial Dataset Familiarization
Explored the **accelerometer motion dataset** provided for the challenge.

Key fields identified:
- `timestamp`
- `trip_id`
- `accel_x`
- `accel_y`
- `accel_z`
- `elapsed_seconds`

## Early Observations
- Motion data represents **driver movement patterns during trips**.
- Potential events detectable from accelerometer signals:
  - Sudden braking
  - Harsh turns
  - Impacts or abrupt movements

## Key Insight
Motion data could be used to **identify driver behaviour patterns** that correlate with driving quality or stress.

## Deliverables
✅ Reviewed full problem statement  
✅ Understood expected pipeline integration with earnings system  
✅ Explored accelerometer dataset structure  

---

# March 5, 2026 – Team Meeting & Task Allocation

## Team Discussion
Participated in the **team planning meeting** to clarify the challenge scope.

## Key Points Discussed
- Real-time system architecture
- Feature extraction from different signal sources
- Integration between:
  - earnings velocity
  - motion data
  - audio stress signals

## Work Distribution

Responsibilities assigned as follows:

**My Responsibilities**
- Analyze **accelerometer motion data**
- Detect motion-based driving events
- Produce **aggregated motion metrics per driver**
- Provide outputs for integration with Manit’s ML pipeline
- Develop the **frontend visualization interface**

## Office Hours Attendance
Attended **official hackathon office hours** to clarify:
- Expected modeling approach
- Data quality expectations
- Feature engineering considerations

### Important Takeaway
Mentors emphasized:
- Focus on **system design**
- Avoid overly complex models if **data quality is limited**

## Deliverables
✅ Finalized role as **Motion Analysis Lead + Frontend Developer**  
✅ Defined motion event detection strategy  

---

# March 6, 2026 – Motion Data Exploration & Feasibility Analysis

## Data Quality Analysis

Loaded the accelerometer dataset and performed exploratory analysis.

### Issues Discovered
The dataset contained several challenges:

- Missing values in accelerometer readings
- Duplicate rows
- Timestamp inconsistencies
- Noise in sensor readings
- Irregular sampling intervals
- Outliers in acceleration values

### Dataset Characteristics
- Small dataset size
- High level of sensor noise
- Multiple invalid or inconsistent records

## Exploratory Analysis

Performed several exploratory steps:

### 1. Distribution Analysis
Plotted distributions of:
- `accel_x`
- `accel_y`
- `accel_z`

### 2. Time Series Visualization
Visualized accelerometer signals over time for individual trips.

### 3. Correlation Analysis
- Checked correlation between acceleration axes.
- Attempted to identify patterns indicating driving behavior.

## Key Finding

The dataset was:

- **Small**
- **Noisy**
- **Messy**
- **Inconsistent**

This made **training a reliable ML model impractical**.

## Decision Taken

Instead of training a model, implemented a **rule-based motion event detection system**.

Advantages:
- More robust to noisy data
- Easier to interpret
- Faster to implement within hackathon time constraints

## Deliverables
✅ Completed exploratory analysis of motion data  
✅ Identified data quality limitations  
✅ Chose **rule-based detection approach** over ML  

---

# March 7, 2026 – Motion Data Processing Pipeline

## Data Cleaning Pipeline

Developed preprocessing functions to clean raw accelerometer data.

### Cleaning Steps Implemented
1. Load sensor data
2. Remove duplicate rows
3. Handle missing values
4. Sort records by timestamp
5. Validate time consistency
6. Remove extreme outliers

These steps ensured motion analysis operates on **clean, ordered sensor data**.

## Feature Computation

After cleaning the dataset, computed **motion severity indicators**.

### Motion Severity Metrics
- Turn severity
- Brake severity
- Impact severity

These metrics were derived from acceleration magnitude and direction changes.

## Event Detection Logic

Implemented rule-based event detection.

### Brake Events
Classified into:
- `no_brake`
- `moderate_brake`
- `harsh_brake`

### Turn Events
Classified into:
- `normal_turn`
- `sharp_turn`

### Impact Events
Detected sudden spikes in acceleration magnitude.

## Motion Event Aggregation

Aggregated events per trip and per driver to generate summary metrics.

Generated outputs such as:
- `total_motion_events`
- `brake_event_count`
- `turn_event_count`
- `impact_event_count`

These outputs were designed to integrate with **Manit’s earnings dataset**.

## Deliverables
✅ Implemented motion data cleaning pipeline  
✅ Developed rule-based motion event detection  
✅ Generated aggregated motion metrics for downstream models  

---

# March 8, 2026 – Pipeline Integration & Backend Finalization

## Motion Processing Pipeline

Finalized the full motion analysis workflow:

```
Raw Sensor Data → Cleaning → Feature Computation → Event Detection → Aggregation
```

## Integration Preparation

Prepared the motion outputs to be compatible with the main pipeline.

Ensured:
- Consistent driver identifiers
- Aggregated metrics per driver
- Clean feature columns

## Code Organization

Structured motion processing modules into a clear pipeline:

```
ingestion/
    load.py
    clean.py

analysis/
    normalise.py
    features.py

outputs/
    motion_score.py
```

This modular design ensures:
- Easy testing
- Clear separation of concerns
- Integration with other team components

## GitHub Contributions

Pushed the motion analysis modules to the repository.

## Deliverables
✅ Completed motion analysis backend  
✅ Structured modular pipeline for motion processing  
✅ Pushed backend implementation to GitHub  

---

# March 9, 2026 – Frontend Development

## Frontend Objective

Build a **dashboard interface** to visualize driver insights.

The goal was to present:
- Driver performance signals
- Motion event summaries
- System predictions

## Frontend Design

Developed a simple frontend prototype including:
- Driver performance overview
- Motion event summaries
- System status indicators

### UI Components Created
- Driver metrics display
- Motion event summaries
- Status panels for driver condition

## Implementation Note

Due to time constraints during the hackathon:

- Backend integration with frontend was **not fully completed**
- Some frontend data was **temporarily hardcoded** to demonstrate UI functionality

This allowed the team to **submit a working prototype interface**.

## GitHub Contribution

Pushed frontend implementation to the repository.

## Deliverables
✅ Designed and implemented frontend prototype  
✅ Built UI for driver monitoring dashboard  
✅ Pushed frontend code to GitHub  

---

# Final Contribution Summary

## Motion Analysis
- Explored accelerometer dataset
- Identified data quality limitations
- Implemented rule-based motion event detection
- Built motion data processing pipeline
- Generated aggregated motion metrics

## Frontend Development
- Designed driver monitoring dashboard
- Implemented UI components for displaying system outputs
- Integrated placeholder data for prototype submission

## Code Contributions
- Motion data preprocessing modules
- Event detection logic
- Motion feature aggregation
- Frontend prototype

---

# Uber Hackathon - My Work Log (Pihu - Audio Analysis Lead and Deployment)

## Team Structure
- **Manit**: Earnings velocity tracking, goal achievement prediction, ML model development  
- **Yogita**: Accelerometer data analysis, motion event detection, frontend development  
- **Pihu**: Audio intensity analysis, stress detection, acoustic feature engineering project deployment

---

# March 5, 2026 – Planning & Audio Signal Strategy

## Team Meeting

Reviewed challenge requirement:

Integrate multiple weak signals:

- Motion
- Audio
- Earnings

Goal:

Detect **stressful driver moments** and **driver progress patterns**.

---

## Audio Data Discussion

The dataset contains **audio intensity measurements**, not raw audio recordings.

Observations:

- **audio_classification** labels **speech activity**
- It does **not represent loudness directly**
- We must convert classification labels into **interpretable acoustic signals**

---

# Audio Data Understanding

## Dataset Columns

```
audio_id
trip_id
timestamp
elapsed_seconds
audio_level_db
audio_classification
sustained_duration_sec
```

### Column Meaning

```
audio_id: unique record identifier
trip_id: trip identifier
timestamp: recorded time
elapsed_seconds: time since trip start
audio_level_db: total sound intensity
audio_classification: speech activity category
sustained_duration_sec: upstream duration estimate
```


---

## Key Observations

- `audio_level_db` measures **overall environmental sound**
- `audio_classification` likely represents **speech detection output**
- `elapsed_seconds` is inconsistent with timestamps
- `sustained_duration_sec` is derived by an **unknown upstream algorithm**

### Decision

Ignore unreliable derived columns and **reconstruct time features ourselves**.

---

# March 6, 2026 – Audio Data Exploration

## Dataset Loading

Files used:

```
audio_intensity_data.csv
flagged_moments.csv
```

Initial inspection revealed:

- Approximately **200 audio observations**
- Data spread across multiple trips
- **Irregular timestamp spacing**

---

## Classification Categories Identified

```
quiet
normal
conversation
loud
very_loud
argument
```


---

# Observed Data Issues

## 1. Time Ordering Problem

Rows were **not chronologically sorted** within trips.

Example order:


06:10
06:11
08:05
06:13


### Fix Implemented

```python
audio = audio.sort_values(["trip_id", "timestamp"])
```

Recomputed timeline:

```
elapsed_seconds = timestamp − trip_start_timestamp
```

Implementation:
```
audio["elapsed_seconds"] = (
    audio.groupby("trip_id")["timestamp"]
    .transform(lambda x: (x - x.min()).dt.total_seconds())
)
```

Result:

Each trip now forms a consistent time series.

2. Classification Mapping Problem

Initial approach mapped labels to numbers:

- quiet → 0
- normal → 1
- loud → 2
- very_loud → 3

Problem:

These numbers were arbitrary and physically meaningless.

Solution

Use typical human speech intensity ranges.

Mapping used:

- quiet         → 35 dB
- normal        → 55 dB
- conversation  → 60 dB
- loud          → 70 dB
- very_loud     → 85 dB
- argument      → 90 dB

Implementation:
```
speech_db_map = {...}

audio["estimated_cabin_db"] = (
    audio["audio_classification"].map(speech_db_map)
)
```

Fallback value:
```
fillna(55)
March 7, 2026 – Acoustic Signal Modeling
Separating Cabin Speech and Environmental Noise
```
Measured signal:
```
audio_level_db
```
This value includes:
```
cabin speech
+ external environment noise
Key Insight
```

Decibels are logarithmic, so we cannot subtract dB values directly.

Correct relation:
```
Power = 10^(dB / 10)
```
Therefore:
```
P_total = P_cabin + P_external
```
Implementation

Convert decibels to power:
```
P_total = 10 ** (audio_level_db / 10)
P_cabin = 10 ** (estimated_cabin_db / 10)
```
Compute external power:
```
P_external = max(P_total - P_cabin, small_value)
```
Convert back to decibels:
```
external_noise_db = 10 * log10(P_external)
```
This produced a physically consistent separation of sound sources.

March 8, 2026 – Behavioral Audio Features
Speech Dominance Ratio

Goal:

Detect when passenger voices dominate the environment.

Formula:
```
speech_dominance_ratio =
    cabin_power / (cabin_power + external_power)
```
Range:

0 → environment dominant
1 → speech dominant

Interpretation:

- low     → traffic noise
- medium  → conversation
- high    → loud passengers
- Cabin Disturbance Index (CDI)

Designed to measure speech intensity and dominance.

Formula:
```
CDI = estimated_cabin_db / 20
      + speech_dominance_ratio * 5
```
Higher CDI indicates:

- louder speech

- stronger speech dominance

March 8, 2026 – Sustained Duration Fix

Dataset column: sustained_duration_sec

Problems identified:

- Derived by an unknown upstream algorithm
- Inconsistent with recomputed timestamps
- Unreliable for time analysis

Decision

- Discard this column and compute sustained speech segments ourselves.
- Sustained Speech Detection

Define loud speech:
```
estimated_cabin_db > 70
```
Mark rows:
```
audio["loud_speech"]
```
Detect segment boundaries:
```
segment_change = loud_speech != loud_speech.shift()
```
Assign segment IDs per trip.

Segment duration:
```
duration = end_timestamp − start_timestamp
```
Output file:
```
audio_loud_segments.csv
```
Example record:
```
trip_id   start   end   duration
TRIP002   06:10   06:12   120s
```
March 9, 2026 – Temporal Clustering

Observation:

Arguments rarely appear as single isolated events.

Typical pattern:

- loud speech
-  pause
- loud speech

These should be treated as one disturbance episode.

Temporal Clustering Algorithm

Segments are grouped if:

gap_between_segments < threshold

Threshold used:

60 seconds

Cluster fields:

- start_time
- end_time
- duration_sec
- events

Output file:
```
audio_disturbance_clusters.csv
```
March 9, 2026 – Speech Escalation Detection

Arguments often show increasing loudness over time.

Example pattern:

55 dB → 60 dB → 68 dB → 75 dB
Detection Algorithm

Slide a window over speech loudness values

Detect strictly increasing sequences

Record escalation events

Window size:

4 consecutive observations

Output file:

audio_escalation_events.csv

Example:

trip_id   start   end   start_db   end_db
TRIP003   06:10   06:14   55        75
March 9, 2026 – Visualization & Validation

Created timeline visualization with two panels.

Panel 1 – Environment

Displays:

Total audio dB

External noise levels

Panel 2 – Cabin Activity

Displays:

Estimated speech loudness

Cabin Disturbance Index

Disturbance clusters

Escalation events

Clusters are highlighted using shaded time intervals.

Purpose:

Validate

speech spikes

disturbance clusters

escalation patterns

Final Output Files
processed_audio_acoustic_features.csv
audio_loud_segments.csv
audio_disturbance_clusters.csv
audio_escalation_events.csv
audio_trip_summary.csv
Key Achievements

Reconstructed reliable trip timelines

Implemented physically correct sound separation

Derived interpretable speech behavior signals

Built disturbance detection pipeline

Implemented temporal clustering and escalation detection

Produced modular outputs for fusion with motion and earnings signals

Final Outcome

The audio module now provides:

- Speech intensity signals

- Sustained disturbance detection

- Escalation detection

- Trip-level acoustic insights

