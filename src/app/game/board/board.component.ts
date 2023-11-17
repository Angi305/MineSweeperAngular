import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription, interval } from 'rxjs';

enum GridItemState {
  Unrevealed = 'unrevealed',
  Flag = 'flag',
  Mine = 'mine',
  BlownMine = 'blown-mine',
  Number = 'number',
  Empty = 'empty',
}

interface GridItem {
  state: GridItemState;
  value: number;
  mine: boolean;
}

interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  grid: GridItem[][] = [];
  dimX = 15;
  dimY = 10;
  minesCount = 20;
  private timerSubscription!: Subscription;
  public timer = 0;
  formattedTimer = '00';

  @Output() gameOver = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.prepareBoard();
  }

  neighbors(x: number, y: number): Coordinates[] {
    const addNeighbor = (y: number, x: number): Coordinates | null => {
      const isValid = (y: number, x: number): boolean =>
        y >= 0 && y < this.dimY && x >= 0 && x < this.dimX;

      return isValid(y, x) ? { y, x } : null;
    };

    return [
      addNeighbor(y - 1, x - 1),
      addNeighbor(y, x - 1),
      addNeighbor(y - 1, x),
      addNeighbor(y + 1, x - 1),
      addNeighbor(y - 1, x + 1),
      addNeighbor(y + 1, x),
      addNeighbor(y, x + 1),
      addNeighbor(y + 1, x + 1)
    ].filter((neighbor): neighbor is Coordinates => neighbor !== null);
  }

  prepareBoard(): void {
    this.grid = Array.from({ length: this.dimY }, () =>
      Array.from({ length: this.dimX }, () => ({ state: GridItemState.Unrevealed, value: 0, mine: false }))
    );

    this.placeMines();
  }

  placeMines(): void {
    for (let i = 0; i < this.minesCount; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * this.dimX);
        y = Math.floor(Math.random() * this.dimY);
      } while (this.grid[y][x].mine);

      this.grid[y][x].mine = true;
      this.updateNeighborValues(x, y);
    }
  }

  updateNeighborValues(x: number, y: number): void {
    const neighbors = this.neighbors(x, y);
    neighbors.forEach((nb) => this.grid[nb.y][nb.x].value++);
  }

  unrevealAll(): void {
    this.grid.forEach((row, y) => row.forEach((_, x) => this.unreveal(x, y)));
  }

  isEmpty(x: number, y: number): boolean {
    return !this.grid[y][x].mine && this.grid[y][x].value === 0;
  }

  isUnrevealed(x: number, y: number): boolean {
    const state = this.grid[y][x].state;
    return state === GridItemState.Unrevealed || state === GridItemState.Flag;
  }

  mark(x: number, y: number): void {
    const currentState = this.grid[y][x].state;
    this.grid[y][x].state = currentState === GridItemState.Unrevealed ? GridItemState.Flag : GridItemState.Unrevealed;
  }

  unreveal(x: number, y: number, isManual: boolean = false): void {
    const cell = this.grid[y][x];

    if (cell.state !== GridItemState.Unrevealed) {
      return;
    }

    if (cell.mine) {
      this.handleMineClick(isManual);
    } else if (cell.value > 0) {
      cell.state = GridItemState.Number;
    } else {
      cell.state = GridItemState.Empty;
    }

    if (this.isEmpty(x, y)) {
      this.unrevealNeighbors(x, y);
    } else {
      this.checkGameOver(cell.state);
    }
  }

  unrevealNeighbors(x: number, y: number): void {
    const stack: Coordinates[] = [{ x, y }];
    while (stack.length > 0) {
      const { x, y } = stack.pop()!;

      if (this.isEmpty(x, y)) {
        this.unreveal(x, y);

        const neighbors = this.neighbors(x, y);
        neighbors.forEach((nb) => {
          if (this.isUnrevealed(nb.x, nb.y) && !stack.some((crd) => crd.x === nb.x && crd.y === nb.y)) {
            stack.push(nb);
          }
        });
      } else if (this.grid[y][x].value > 0) {
        this.unreveal(x, y);
      }
    }
  }

  checkGameOver(newState?: GridItemState): void {
    if (newState === GridItemState.BlownMine) {
      this.handleGameLost();
    } else {
      const unrevealedCount = this.grid.flat().filter(
        (cell) => cell.state === GridItemState.Unrevealed || cell.state === GridItemState.Flag
      ).length;

      if (this.minesCount === unrevealedCount) {
        this.handleGameWon();
      }
    }
  }

  zeroPad(number: number, width: number): string {
    const numberString = number.toString();
    width -= numberString.length;
    return width > 0 ? '0'.repeat(width + (/\./.test(numberString) ? 2 : 1)) + numberString : numberString;
  }

  restartGame(): void {
    this.grid = [];
    this.timer = 0;
    this.formattedTimer = '000';

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.prepareBoard();
  }

  onCellClick(): void {
    if (!this.timerSubscription) {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.timer++;
        this.formattedTimer = this.zeroPad(this.timer, 2);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onFieldClick($event: Coordinates): void {
    this.unrevealNeighbors($event.x, $event.y);
  }

  onFieldRBClick($event: Coordinates): void {
    this.mark($event.x, $event.y);
  }

  private handleMineClick(isManual: boolean): void {
    const gameLost = !isManual;
    this.grid.forEach((row) => row.forEach((cell) => {
      if (cell.mine) {
        cell.state = gameLost ? GridItemState.BlownMine : GridItemState.Mine;
      }
    }));

    this.unrevealAll();
    this.gameOver.emit(gameLost);
    alert('Game Over! You clicked on a bomb.');
  }

  private handleGameLost(): void {
    this.unrevealAll();
    this.gameOver.emit(false);
  }

  private handleGameWon(): void {
    this.unrevealAll();
    this.gameOver.emit(true);
  }
}
