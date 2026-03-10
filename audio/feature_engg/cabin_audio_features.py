import numpy as np
from audio.preprocessing.signal_conversion import db_to_power, power_to_db


def estimate_cabin_db(audio):

    speech_db_map = {
        "quiet":35,
        "normal":55,
        "conversation":60,
        "loud":70,
        "very_loud":85,
        "argument":90
    }

    audio["estimated_cabin_db"] = audio["audio_classification"].map(speech_db_map)

    audio["estimated_cabin_db"] = audio["estimated_cabin_db"].fillna(55)

    return audio


def separate_noise(audio):

    P_total = db_to_power(audio["audio_level_db"])
    P_cabin = db_to_power(audio["estimated_cabin_db"])

    noise_floor_db = 20
    noise_floor_power = db_to_power(noise_floor_db)

    P_external = np.maximum(P_total - P_cabin, noise_floor_power)

    audio["external_noise_db"] = power_to_db(P_external)

    audio["cabin_power"] = P_cabin
    audio["external_power"] = P_external

    return audio


def speech_dominance(audio):

    audio["speech_dominance_ratio"] = (
        audio["cabin_power"] /
        (audio["cabin_power"] + audio["external_power"])
    )

    return audio