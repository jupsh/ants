import numpy as np


def random_bool_grid(height: int, width: int, p: float = 0.5) -> np.ndarray:
    return (np.random.rand(height, width) < p).astype(np.uint8)

def random_int_grid(height: int, width: int, max: float) -> np.ndarray:
    return np.random.randint(0, max, size=(height, width), dtype=np.uint8)