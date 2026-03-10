import matplotlib.pyplot as plt


def visualize_trip(audio, clusters=None, escalations=None, trip_id=None):

    if trip_id is None:
        trip_id = audio["trip_id"].iloc[0]

    trip = audio[audio["trip_id"] == trip_id]

    fig, ax = plt.subplots(2, 1, figsize=(12, 8), sharex=True)

    fig.suptitle(f"Audio Analysis for Trip {trip_id}", fontsize=16)


    ax[0].scatter(
        trip["elapsed_seconds"],
        trip["audio_level_db"],
        label="Total Audio",
        color="blue",
        alpha=0.7
    )

    ax[0].scatter(
        trip["elapsed_seconds"],
        trip["external_noise_db"],
        label="External Noise",
        color="green",
        alpha=0.7
    )

    ax[0].set_ylabel("dB")
    ax[0].set_title("Total Audio vs External Noise")
    ax[0].legend()
    ax[0].grid(alpha=0.3)

   

    ax[1].plot(
        trip["elapsed_seconds"],
        trip["estimated_cabin_db"],
        label="Cabin Speech",
        color="orange"
    )

    ax[1].plot(
        trip["elapsed_seconds"],
        trip["cabin_disturbance_index"],
        label="Cabin Disturbance Index",
        color="red"
    )

   
    ax[1].axhline(60, linestyle="--", color="gray", alpha=0.6)
    ax[1].axhline(80, linestyle="--", color="gray", alpha=0.6)

    ax[1].set_xlabel("Elapsed Seconds")
    ax[1].set_ylabel("dB / CDI")
    ax[1].set_title("Cabin Speech and Disturbance Index")

  

    if clusters is not None:

        c = clusters[clusters["trip_id"] == trip_id]

        for _, row in c.iterrows():

            start = (
                row["start_time"] - trip["timestamp"].min()
            ).total_seconds()

            end = (
                row["end_time"] - trip["timestamp"].min()
            ).total_seconds()

            ax[1].axvspan(start, end, alpha=0.2, color="black")

   

    if escalations is not None:

        e = escalations[escalations["trip_id"] == trip_id]

        for _, row in e.iterrows():

            start = (
                row["start_time"] - trip["timestamp"].min()
            ).total_seconds()

            end = (
                row["end_time"] - trip["timestamp"].min()
            ).total_seconds()

            ax[1].axvspan(start, end, alpha=0.2, color="purple")

    ax[1].legend()
    ax[1].grid(alpha=0.3)

    plt.tight_layout(rect=[0, 0, 1, 0.96])

    plt.show()