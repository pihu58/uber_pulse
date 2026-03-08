import pandas as pd
import numpy as np

def load(file):
    ''' Loads raw sensor CSV data, removes duplicates and sorts it
"file": path to accelerometer CSV file '''
    df=pd.read_csv(file)

    df["timestamp"]=pd.to_datetime(df["timestamp"])  
    df=df.drop_duplicates()     
    df=df.sort_values(by=["trip_id","elapsed_seconds"]) 
    df=df.reset_index(drop=True)   

    return df   
