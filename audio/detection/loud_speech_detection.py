def detect_loud_segments(audio, threshold=70):

    audio["loud_speech"] = audio["estimated_cabin_db"] > threshold

    audio["segment_change"] = (
        audio["loud_speech"] != audio["loud_speech"].shift()
    )

    audio["segment_id"] = (
        audio.groupby("trip_id")["segment_change"].cumsum()
    )

    segments = (
        audio[audio["loud_speech"]]
        .groupby(["trip_id","segment_id"])
        .agg(
            start_time=("timestamp","min"),
            end_time=("timestamp","max"),
            mean_db=("estimated_cabin_db","mean")
        )
        .reset_index()
    )

    segments["duration_sec"] = (
        segments["end_time"] - segments["start_time"]
    ).dt.total_seconds()

    return segments