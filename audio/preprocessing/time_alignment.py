def compute_elapsed_time(audio):

    audio["elapsed_seconds"] = (
        audio.groupby("trip_id")["timestamp"]
        .transform(lambda x: (x - x.min()).dt.total_seconds())
    )

    return audio