import numpy as np

def db_to_power(db):
    return 10 ** (db / 10)

def power_to_db(power):
    return 10 * np.log10(power)