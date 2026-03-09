from ingestion.load import load
from ingestion.clean import handle_duplicates, handle_missing, validate_time, remove_outliers

from analysis.normalise import turn_severity, brake_severity, impact_severity
from analysis.features import brake_type, turn_type, detect_impact

from outputs.motion_score import motion_score


def run_pipeline(file):
    # Load data
    df=load(file)

    # Clean data
    df=handle_duplicates(df)
    df=handle_missing(df)
    # df=validate_time(df)
    df=remove_outliers(df)

    # Normalise data
    df=turn_severity(df)
    df=brake_severity(df)
    df=impact_severity(df)

    # Assign severity
    df=brake_type(df)
    df=turn_type(df)
    df=detect_impact(df)

    # Compute motion score
    df=motion_score(df)

    return df