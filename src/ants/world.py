import numpy as np

from .config import MAX_FOOD_VALUE, PHEROMONE_DECAY
from .utils import random_bool_grid, random_int_grid
from .sim import Ant, QueenAnt

class World:
    def __init__(self, height: int, width: int):
        self.height = height
        self.width = width

        self.occupancy: np.ndarray = np.zeros((height, width), dtype=object)
        self.food_pheromone = np.zeros((height, width), dtype=float)
        self.home_pheromone = np.zeros((height, width), dtype=float)

        self.grid = random_bool_grid(height, width)
        self.food = random_int_grid(height, width, max=MAX_FOOD_VALUE) * random_bool_grid(height, width, p=0.2)
        self.ants: list[Ant] = []
        self.queen = None

    def update_occupancy(self):
        self.occupancy.fill(None)
        for ant in self.ants:
            self.occupancy[ant.y, ant.x] = ant

    def add_ant(self, ant):
        self.ants.append(ant)
        self.occupancy[ant.y, ant.x] = ant

        if isinstance(ant, QueenAnt):
            self.queen = ant

    def evaporate_pheromones(self):
        self.food_pheromone *= PHEROMONE_DECAY
        self.home_pheromone *= PHEROMONE_DECAY

    def step(self):
        dead_ants = []

        for ant in self.ants:
            ant.step(self)
            if not ant.alive:
                dead_ants.append(ant)

        for ant in dead_ants:
            self.ants.remove(ant)
            self.place_food(ant.y, ant.x, 5)

        self.update_occupancy()

    def wrap(self, y: int, x: int) -> tuple[int, int]:
        return y % self.height, x % self.width

    def is_occupied(self, y: int, x: int) -> bool:

        return self.occupancy[y, x] or self.food[y, x]
    
    def place_food(self, y: int, x: int, value):
        self.food[y, x] = value

    def eat_food(self, y: int, x: int, amount: int) -> int:
        """Returns amount actually eaten"""
        eaten = min(amount, self.food[y, x])
        self.food[y, x] -= eaten
        return eaten

    def place_ant(self, ant: Ant) -> None:
        self.occupancy[ant.y, ant.x] = ant

    def move_ant(self, ant: Ant, new_y: int, new_x: int) -> None:
        self.occupancy[ant.y, ant.x] = None
        ant.y, ant.x = self.wrap(new_y, new_x)
        self.occupancy[ant.y, ant.x] = ant