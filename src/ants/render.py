import pygame

from .sim import MAX_HUNGER_THRESHOLD, QueenAnt
from .world import World
from .config import CELL_SIZE, MAX_FOOD_VALUE
from .colors import DEAD_COLOR, EMPTY_FOOD_COLOR, FULL_FOOD_COLOR, ALIVE_ANT_COLOR, DEAD_ANT_COLOR, QUEEN_COLOR, QUEEN_SIZE_MULTIPLIER

class Renderer:
    def __init__(self, screen: pygame.Surface):
        self.screen = screen

    def draw(self, world: World) -> None:
        self.screen.fill(DEAD_COLOR)

        height, width = world.grid.shape

        for y in range(height):
            for x in range(width):
                food_amount = world.food[y, x]
                self._draw_food(x, y, food_amount)

        for ant in world.ants:
            self._draw_ant(ant)

        pygame.display.flip()

    def _draw_food(self, x, y, food_amount):
        if food_amount > 0:
            ratio = food_amount / MAX_FOOD_VALUE
            color = tuple(
                int(EMPTY_FOOD_COLOR[i] + (FULL_FOOD_COLOR[i] - EMPTY_FOOD_COLOR[i]) * ratio)
                for i in range(3)
            )
            pygame.draw.rect(
                self.screen,
                color,
                (x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE),
            )

    def _draw_ant(self, ant):
        if isinstance(ant, QueenAnt):
            self._draw_queen(ant)
            return

        ratio = ant.food / (ant.MAX_FOOD_CARRY - MAX_HUNGER_THRESHOLD)
        ratio = max(0, min(1, ratio))

        color = tuple(
            int(DEAD_ANT_COLOR[i] + (ALIVE_ANT_COLOR[i] - DEAD_ANT_COLOR[i]) * ratio)
            for i in range(3)
        )

        pygame.draw.rect(
            self.screen,
            color,
            (ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE),
        )

    def _draw_queen(self, queen):
        size = int(CELL_SIZE * QUEEN_SIZE_MULTIPLIER)
        offset = (CELL_SIZE - size) // 2

        ratio = max(0, min(1, queen.food / 5))
        color = tuple(int(c * ratio) for c in QUEEN_COLOR)

        pygame.draw.rect(
            self.screen,
            color,
            (
                queen.x * CELL_SIZE + offset,
                queen.y * CELL_SIZE + offset,
                size,
                size,
            ),
        )