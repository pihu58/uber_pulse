from ingestion.load_audio import load_audio
from preprocessing.time_alignment import compute_elapsed_time
from feature_engg.cabin_audio_features import (
    estimate_cabin_db,
    separate_noise,
    speech_dominance
)
from visualization.trip_plots import visualize_trip
from detection.loud_speech_detection import detect_loud_segments
from detection.disturbance_clustering import temporal_clustering
from analytics.disturbance_index import compute_cdi
from analytics.trip_summary import trip_summary


def run_pipeline(audio_file):

    audio = load_audio(audio_file)

    audio = compute_elapsed_time(audio)

    audio = estimate_cabin_db(audio)

    audio = separate_noise(audio)

    audio = speech_dominance(audio)

    segments = detect_loud_segments(audio)

    clusters = temporal_clustering(segments)

    audio = compute_cdi(audio)

    summary = trip_summary(audio,clusters)

    return audio,segments,clusters,summary


if __name__ == "__main__":

    audio,segments,clusters,summary = run_pipeline("audio_intensity_data.csv")
    visualize_trip(audio, clusters, trip_id=audio["trip_id"].iloc[0])

    print(summary.head())