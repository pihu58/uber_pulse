import pandas as pd

def load_audio(file):

    audio = pd.read_csv(file)

    audio["timestamp"] = pd.to_datetime(audio["timestamp"])

    audio = audio.sort_values(["trip_id","timestamp"]).reset_index(drop=True)

    return audio