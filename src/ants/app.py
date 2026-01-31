import time
import pygame

from .config import (
    CELL_SIZE,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    FPS,
    SIM_HZ,
)
from .sim import Ant, QueenAnt
from .world import World
from .render import Renderer

class App:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Ants")

        self.clock = pygame.time.Clock()
        self.renderer = Renderer(self.screen)

        grid_height = SCREEN_HEIGHT // CELL_SIZE
        grid_width = SCREEN_WIDTH // CELL_SIZE

        # Create World and initialize grids inside
        self.world = World(height=grid_height, width=grid_width)

        mid_y, mid_x = grid_height // 2, grid_width // 2
        queen = QueenAnt(mid_y, mid_x)
        self.world.add_ant(queen)

        # Optionally spawn a few initial workers
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            y, x = self.world.wrap(mid_y + dy, mid_x + dx)
            self.world.add_ant(Ant(y, x))

        self.last_sim_time = time.time()
        self.running = True

    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False

            elif event.type == pygame.MOUSEBUTTONDOWN:
                if not any(isinstance(a, QueenAnt) for a in self.world.ants):
                    mx, my = pygame.mouse.get_pos()
                    x, y = mx // CELL_SIZE, my // CELL_SIZE
                    ant = Ant(y, x, direction=0)
                    self.world.add_ant(ant)

    def update(self):
        # Advance simulation step inside world
        self.world.step()
        self.last_sim_time = time.time()

    def draw(self):
        # Pass the entire world to the renderer for drawing
        self.renderer.draw(self.world)

    def run(self):
        dt = 1 / SIM_HZ

        while self.running:
            self.clock.tick(FPS)
            self.handle_events()

            now = time.time()
            elapsed = now - self.last_sim_time

            if elapsed >= dt:
                self.last_sim_time += dt
                self.update()
                self.draw()

        pygame.quit()
