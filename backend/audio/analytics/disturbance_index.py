def compute_cdi(audio):

    audio["cabin_disturbance_index"] = (
        audio["estimated_cabin_db"]/20 +
        audio["speech_dominance_ratio"]*5
    )

    audio["cabin_disturbance_index"] = (
        audio.groupby("trip_id")["cabin_disturbance_index"]
        .transform(lambda x: x.rolling(3,min_periods=1).mean())
    )

    return audio