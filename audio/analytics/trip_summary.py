import numpy as np

def trip_summary(audio,clusters):

    summary = audio.groupby("trip_id").agg(

        avg_total_db=("audio_level_db","mean"),
        avg_cabin_db=("estimated_cabin_db","mean"),
        avg_external_db=("external_noise_db","mean"),
        avg_cdi=("cabin_disturbance_index","mean")

    ).reset_index()

    cluster_counts = clusters.groupby("trip_id").size().reset_index(name="disturbance_clusters")

    summary = summary.merge(cluster_counts,on="trip_id",how="left")

    summary = summary.fillna(0)

    summary["noise_level"] = np.where(
        summary["avg_cdi"]>6,
        "high",
        np.where(summary["avg_cdi"]>3,"medium","low")
    )

    return summary