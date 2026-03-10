import pandas as pd
import numpy as np

def handle_duplicates(df):
    # Remove duplicate rows from the dataset
    df=df.drop_duplicates()
    return df

def handle_missing(df):
    # Handle missing values in the dataset

    # Columns that must not contain missing values
    critical_cols=["sensor_id","trip_id","timestamp","elapsed_seconds"]
    df=df.dropna(subset=critical_cols)

    # Numeric columns
    num_cols=["accel_x","accel_y","accel_z","speed_kmh","gps_lat","gps_lon"]
    
    # Interpolate missing values with each trip
    df[num_cols]=(
       df.groupby("trip_id")[num_cols]
       .apply(lambda x: x.interpolate(method="linear"))
       .reset_index(level=0,drop=True)
    )

    # Fill any remaining NaN values with trip-wise mean
    df[num_cols]=(
       df.groupby("trip_id")[num_cols]
       .transform(lambda x: x.fillna(x.mean()))
    )

    return df

def validate_time(df):
    # Validate timestamps using elapsed seconds
    df=df.copy()

    df["expected_elapsed"]=(df.groupby("trip_id")["timestamp"].transform(lambda x:(x-x.min()).dt.total_seconds()))
    dif=abs(df["expected_elapsed"]-df["elapsed_seconds"])
    df=df[dif<5]
    df=df.drop(columns=["expected_elapsed"])

    return df

def remove_outliers(df):
    # Handle extreme values

    cols=["accel_x","accel_y","accel_z","speed_kmh"]
  
    for c in cols:
        df[c]=df.groupby("trip_id")[c].transform(lambda x:x.clip(x.mean()-3*x.std(),x.mean()+3*x.std()))
  
    return df