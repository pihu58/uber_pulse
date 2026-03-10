import numpy as np
import pandas as pd

def turn_severity(df):
    # Calculate severity of turn using accel_y

    ay=df["accel_y"].abs()
    max_turn=ay.quantile(0.99)
    if max_turn==0:
        max_turn=1
    df["turn_severity"]=ay/max_turn
    df["turn_severity"]=df["turn_severity"].clip(0,1)
    
    return df

def brake_severity(df):
    # Calculate brake severity using speed change and elapsed time

    dv=df.groupby("trip_id")["speed_kmh"].diff()*(1000/3600)
    dt=df.groupby("trip_id")["elapsed_seconds"].diff()
    dt=dt.replace(0,np.nan)
    acc=dv/dt
    acc=acc.fillna(0)
    braking_force=(-acc).clip(lower=0)
    max_brake=braking_force.quantile(0.99)
    if max_brake==0:
        max_brake=1
    df["brake_severity"]=braking_force/max_brake
    df["brake_severity"]=df["brake_severity"].clip(0,1)

    return df

def impact_severity(df):
    # Calculate impact severity using accel_z

    shock=(df["accel_z"]-9.8).abs()
    max_shock=shock.quantile(0.99)
    if max_shock==0:
        max_shock=1
    df["impact_severity"]=shock/max_shock
    df["impact_severity"]=df["impact_severity"].clip(0,1)

    return df