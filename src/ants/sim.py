from __future__ import annotations
import random
from typing import TYPE_CHECKING

from .config import GRID_HEIGHT, GRID_WIDTH

if TYPE_CHECKING:
    from .world import World

FOOD_SENSE_RADIUS = 5
NEIGHBOR_SENSE_RADIUS = 15
MAX_HUNGER_THRESHOLD = -10
QUEEN_EGG_INTERVAL = 20
RETURN_TO_QUEEN_THRESHOLD = 5
SHARE_WITH_NEIGHBOR_THRESHOLD = 5

class Ant:
    MAX_FOOD_CARRY = 20
    FORAGING = 0
    RETURNING = 1

    def __init__(self, y, x, direction=0):
        self.y = y
        self.x = x
        self.direction = direction  # 0=N, 1=E, 2=S, 3=W

        self.food = 0
        self.is_hungry = True
        self.alive = True
        self.intent = Ant.FORAGING

        self.food_sense_radius = FOOD_SENSE_RADIUS
        self.neighbor_sense_radius = 1
        self.step_count = 0

        self.commit_dir = None
        self.commit_timer = 0

    # ---------- Life & hunger ----------

    def update_hunger(self):
        self.food -= 0.1
        self.is_hungry = self.food <= 0

        if self.food <= MAX_HUNGER_THRESHOLD:
            self.alive = False


    # ---------- Movement primitives ----------

    def turn_right(self):
        self.direction = (self.direction + 1) % 4

    def turn_left(self):
        self.direction = (self.direction - 1) % 4

    def move_forward(self):
        self.y, self.x = self.forward_coordinates()

    def forward_coordinates(self):
        if self.direction == 0:      # N
            return (self.y - 1) % GRID_HEIGHT, self.x
        elif self.direction == 1:    # E
            return self.y, (self.x + 1) % GRID_WIDTH
        elif self.direction == 2:    # S
            return (self.y + 1) % GRID_HEIGHT, self.x
        else:                        # W
            return self.y, (self.x - 1) % GRID_WIDTH
        
    def move_toward_adjacent_to(self, target_y, target_x, world):
        # Find all adjacent cells to target that are free
        print('trying to get to queen')

        candidates = []
        for dy in [-1, 0, 1]:
            for dx in [-1, 0, 1]:
                if dy == 0 and dx == 0:
                    continue
                ny = (target_y + dy) % GRID_HEIGHT
                nx = (target_x + dx) % GRID_WIDTH
                if not world.is_occupied(ny, nx):
                    candidates.append((ny, nx))

        # Pick candidate closest to self
        if candidates:
            candidates.sort(key=lambda pos: wrapped_manhattan_distance(self.y, self.x, pos[0], pos[1]))
            ny, nx = candidates[0]
            self.move_toward(ny, nx, world)

    def start_commit(self, direction, steps=10):
        self.commit_dir = direction
        self.commit_timer = steps

    # ---------- Perception ----------

    def sense_neighbors(self, world: World) -> list["Ant"]:
        neighbors = []

        for dy in [-1, 0, 1]:
            for dx in [-1, 0, 1]:
                if dy == 0 and dx == 0:
                    continue

                ny, nx = world.wrap(self.y + dy, self.x + dx)
                ant = world.occupancy[ny, nx]
                if ant:
                    neighbors.append(ant)

        return neighbors

    def immediate_neighbors(self, neighbors: list["Ant"]) -> list["Ant"]:
        immediate = []

        for ant in neighbors:
            dy = min(abs(ant.y - self.y), GRID_HEIGHT - abs(ant.y - self.y))
            dx = min(abs(ant.x - self.x), GRID_WIDTH - abs(ant.x - self.x))

            if max(dy, dx) == 1:
                immediate.append(ant)

        return immediate

    def sense_closest_food(self, world: World):
        closest = None
        best_score = self.food_sense_radius + 1

        for dy in range(-self.food_sense_radius, self.food_sense_radius + 1):
            for dx in range(-self.food_sense_radius, self.food_sense_radius + 1):
                if dy == 0 and dx == 0:
                    continue

                ny = (self.y + dy) % GRID_HEIGHT
                nx = (self.x + dx) % GRID_WIDTH

                if world.food[ny, nx] <= 0:
                    continue

                dist = abs(dy) + abs(dx)
                facing_penalty = int(
                    self.direction != direction_toward(self.y, self.x, ny, nx)
                )

                score = dist + facing_penalty
                if score < best_score:
                    best_score = score
                    closest = (ny, nx)

        return closest

    # ---------- Actions ----------

    def needs_to_tend_queen(self, queen: QueenAnt):
        return queen and queen.is_hungry


    def try_eat(self, world: World):
        if self.food >= self.MAX_FOOD_CARRY:
            return

        fy, fx = self._forward_from_dir(self.direction)
        if world.food[fy, fx] > 0:
            eaten = world.eat_food(fy, fx, amount=1)
            self.food += eaten

    def move_toward(self, y, x, world):
        self.last_direction = self.direction
        desired = direction_toward(self.y, self.x, y, x)
        opposite = (self.direction + 2) % 4

        # All 4 directions
        candidates = [
            desired,
            (desired + 1) % 4,
            (desired + 2) % 4,
            (desired + 3) % 4
        ]

        def can_move(d):
            fy, fx = self._forward_from_dir(d)
            return not world.is_occupied(fy, fx)
        

        def score(d):
            fy, fx = self._forward_from_dir(d)
            dist = wrapped_manhattan_distance(fy, fx, y, x)

            return (
                dist,
                d == opposite,
                d == self.last_direction,   # ← THIS breaks oscillation
                d != self.direction
            )
        
        # Sort once, with all heuristics baked in
        candidates.sort(key=score)

        for d in candidates:
            if not can_move(d):
                continue

            old_y, old_x = self.y, self.x
            old_dir = self.direction

            self.direction = d
            self.move_forward()

            # Only commit direction if movement succeeded
            if (self.y, self.x) != (old_y, old_x):
                return
            else:
                self.direction = old_dir

        # Fallback: eat forward if blocked
        fy, fx = self._forward_from_dir(self.direction)
        if world.food[fy, fx] > 0:
            eaten = world.eat_food(fy, fx, amount=1)
            self.food += eaten

    def adjacent_free_cell_to_queen(self, world, queen):
        for dy in [-1, 0, 1]:
            for dx in [-1, 0, 1]:
                if dy == 0 and dx == 0:
                    continue
                ny = (queen.y + dy) % GRID_HEIGHT
                nx = (queen.x + dx) % GRID_WIDTH
                if not world.is_occupied(ny, nx):
                    return True
        return False



    def _forward_from_dir(self, direction):
        if direction == 0:
            return (self.y - 1) % GRID_HEIGHT, self.x
        elif direction == 1:
            return self.y, (self.x + 1) % GRID_WIDTH
        elif direction == 2:
            return (self.y + 1) % GRID_HEIGHT, self.x
        else:
            return self.y, (self.x - 1) % GRID_WIDTH

    def share_food(self, other: "Ant", max_share=5):
        """
        Share food with another ant.
        - Giver must not be hungry
        - Share up to `max_share`, but keep at least 1 food
        """

        if isinstance(other, QueenAnt):
            print('feeding queen)')

        if self.food <= 1:
            return False

        available = self.food - 1
        amount = min(max_share, available)

        if amount <= 0:
            return False

        self.food -= amount
        other.food += amount
        other.update_hunger()

        return True

    def wander(self, world):
        if self.commit_timer == 0:
            d = random.randint(0, 3)
            self.start_commit(d, steps=random.randint(6, 15))

    def deposit_home_pheromone(self, world: World):
        world.home_pheromone[self.y, self.x] += 1.0

    def deposit_food_pheromone(self, world: World):
        world.food_pheromone[self.y, self.x] += 0.3

    # ---------- Main step ----------

    def step(self, world: World):
        if self.commit_timer > 0:
            fy, fx = self._forward_from_dir(self.commit_dir)
            if not world.is_occupied(fy, fx):
                self.direction = self.commit_dir
                self.move_forward()
                self.commit_timer -= 1
                return
            else:
                self.commit_timer = 0

        if hasattr(world, "queen"):
            print(f"Worker food={self.food:.2f} | Queen food={world.queen.food:.2f} | Queen hungry={world.queen.is_hungry}")


        if not self.alive:
            return

        self.step_count += 1
        self.try_eat(world)
        self.update_hunger()

        if not self.alive:
            return

        queen = world.queen
        neighbors = self.sense_neighbors(world)
        food_pos = self.sense_closest_food(world)

        if self.needs_to_tend_queen(queen) and self.food >= RETURN_TO_QUEEN_THRESHOLD:
            self.intent = Ant.RETURNING
        elif self.intent == Ant.RETURNING and self.food <= 0:
            self.intent = Ant.FORAGING

        

        # Behavior based on intent
        if self.intent == Ant.RETURNING:
            d = self.strongest_pheromone_direction(world.home_pheromone, world)
            if d is not None:
                fy, fx = self._forward_from_dir(d)
                if not world.is_occupied(fy, fx):
                    self.direction = d
                    self.move_forward()
                    return

            # fallback: move adjacent to queen and share food
            dy = min(abs(self.y - queen.y), GRID_HEIGHT - abs(self.y - queen.y))
            dx = min(abs(self.x - queen.x), GRID_WIDTH - abs(self.x - queen.x))
            if max(dy, dx) == 1:
                self.share_food(queen)
                return
            else:
                self.move_toward_adjacent_to(queen.y, queen.x, world)
                return

        elif self.intent == Ant.FORAGING:
            d = self.strongest_pheromone_direction(world.food_pheromone, world)
            if d is not None:
                fy, fx = self._forward_from_dir(d)
                if not world.is_occupied(fy, fx):
                    self.direction = d
                    self.move_forward()
                    return

            if food_pos:
                self.move_toward(*food_pos, world)
                return

            full_neighbors = [a for a in neighbors if not a.is_hungry and a.alive and a.intent != Ant.RETURNING]
            if full_neighbors:
                target = full_neighbors[0]
                self.move_toward(target.y, target.x, world)
                return

            hungry_neighbors = [a for a in neighbors if a.is_hungry and a.alive]
            immediate = self.immediate_neighbors(hungry_neighbors)
            if immediate and self.food >= SHARE_WITH_NEIGHBOR_THRESHOLD:
                other = immediate[0]
                self.move_toward(other.y, other.x, world)
                other.move_toward(self.y, self.x, world)
                self.share_food(other)
                return

            self.wander(world)
            
        

    def strongest_pheromone_direction(self, pheromone_field, world):
        best = None
        best_value = 0

        for d in range(4):
            fy, fx = self._forward_from_dir(d)
            if world.is_occupied(fy, fx):
                continue

            value = pheromone_field[fy, fx]
            if value > best_value:
                best_value = value
                best = d

        return best

    def deposit_pheromone(self, world):
        if self.step_count % 3 != 0:
            return  # deposit pheromone only every 3 steps
        if self.intent == Ant.FORAGING:
            amount = 0.3
            pheromone_field = world.food_pheromone
        elif self.intent == Ant.RETURNING:
            amount = 1.0
            pheromone_field = world.home_pheromone
        else:
            return  # No pheromone to deposit

        pheromone_field[self.y, self.x] += amount


class QueenAnt(Ant):
    MAX_FOOD_CARRY = 100

    def __init__(self, y, x):
        super().__init__(y, x, direction=0)

        self.food = 5
        self.is_hungry = False
        self.egg_timer = 0
        self.eggs_laid = 0

    def step(self, world):
        if not self.alive:
            return

        self.update_hunger()
        if not self.alive:
            return

        self.egg_timer += 1

        if self.can_lay_egg():
            self.lay_egg(world)

    def update_hunger(self):
        self.food -= 0.2
        self.is_hungry = self.food <= 1

        if self.food <= MAX_HUNGER_THRESHOLD:
            self.alive = False

    def can_lay_egg(self):
        return (
            self.food >= 2
            and self.egg_timer >= QUEEN_EGG_INTERVAL
        )

    def lay_egg(self, world):
        spawn_y, spawn_x = self.find_open_adjacent(world)
        if spawn_y is None:
            return

        worker = Ant(spawn_y, spawn_x)
        world.add_ant(worker)

        self.food -= 1
        self.egg_timer = 0
        self.eggs_laid += 1

    def find_open_adjacent(self, world):
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = world.wrap(self.y + dy, self.x + dx)
            if not world.is_occupied(ny, nx):
                return ny, nx
        return None, None

    def wander(self, world):
        pass  # Queen does not wander



def direction_toward(y1, x1, y2, x2):
    # Returns direction 0=N,1=E,2=S,3=W for ant at (y1,x1) to move toward (y2,x2)
    dy = (y2 - y1) % 1000  # large mod to handle wrap, or just direct diff
    dx = (x2 - x1) % 1000

    # Decide vertical or horizontal priority (simple)
    if abs(dy) > abs(dx):
        if (y2 - y1) % 1000 > 0:
            return 2  # South
        else:
            return 0  # North
    else:
        if (x2 - x1) % 1000 > 0:
            return 1  # East
        else:
            return 3  # West
        
def wrapped_manhattan_distance(y1, x1, y2, x2):
    dy = min(abs(y1 - y2), GRID_HEIGHT - abs(y1 - y2))
    dx = min(abs(x1 - x2), GRID_WIDTH - abs(x1 - x2))
    return dy + dx