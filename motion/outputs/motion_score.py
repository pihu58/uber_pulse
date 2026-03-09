import pandas as pd

def motion_score(df):
    # Compute motion score

    #weights
    turn=0.2
    brake=0.6
    impact=0.2

    df["motion_score"]=(
        turn*df["turn_severity"]+
        brake*df["brake_severity"]+
        impact*df["impact_severity"]
    )
    df["motion_score"]=df["motion_score"].clip(0,1)

    return df