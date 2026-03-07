def temporal_clustering(segments, gap_threshold=60):

    clusters = []

    for trip_id, group in segments.groupby("trip_id"):

        group = group.sort_values("start_time").reset_index(drop=True)

        cluster_id = 0
        current_cluster = []

        for i,row in group.iterrows():

            if not current_cluster:
                current_cluster.append(row)
                continue

            prev = current_cluster[-1]

            gap = (row["start_time"] - prev["end_time"]).total_seconds()

            if gap <= gap_threshold:
                current_cluster.append(row)
            else:
                clusters.append((trip_id,cluster_id,current_cluster))
                cluster_id += 1
                current_cluster = [row]

        if current_cluster:
            clusters.append((trip_id,cluster_id,current_cluster))

    records = []

    for trip_id,cid,rows in clusters:

        start = rows[0]["start_time"]
        end = rows[-1]["end_time"]

        duration = (end-start).total_seconds()

        records.append({
            "trip_id":trip_id,
            "cluster_id":cid,
            "start_time":start,
            "end_time":end,
            "duration_sec":duration,
            "events":len(rows)
        })

    import pandas as pd
    return pd.DataFrame(records)