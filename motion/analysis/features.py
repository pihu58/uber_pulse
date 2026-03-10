import numpy as np

def brake_type(df):
    # Detect brake severity: no_brake, moderate_brake or harsh_brake
    
    s=df["brake_severity"].fillna(0)
    df["brake_type"]=np.select(
        [
            s<0.2,
            (s>=0.2)&(s<0.5),
            s>=0.5
        ],
        [
            "no_brake",
            "moderate_brake",
            "harsh_brake"
        ],
        default="no_brake"
    )
    
    return df

def turn_type(df):
    #Detect turn severity: no_turn, normal_turn or sharp_turn
    
    s=df["turn_severity"].fillna(0)
    
    df["turn_type"]=np.select(
        [
            s<0.2,
            (s>=0.2)&(s<0.6),
            s>=0.6
        ],
        [
            "no_turn",
            "normal_turn",
            "sharp_turn"
        ],
        default="no_turn"
    )
    
    return df

def detect_impact(df):
    # Detect impact: normal, upward or downward
    
    shock=df["accel_z"]-9.8
    
    df["impact_type"]=np.select(
        [
            shock.abs()<2,
            shock>2,
            shock<-2
        ],
        [
            "normal",
            "upward_impact",
            "downward_impact"
        ],
        default="normal"
    )
    
    return df