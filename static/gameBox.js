import { BOX_ROWS, BOX_COLUMNS, TILE_SIZE } from "./initData.js";
import { gameStatus } from "./gameStatusHandler.js";

class Gamebox {

    constructor() {
        this.element = document.getElementById("gamebox");

        this.grid = Array(BOX_ROWS);
        for (let r = 0; r < BOX_ROWS; r++) {
            this.grid[r] = Array(BOX_COLUMNS);
            for (let c = 0; c < BOX_COLUMNS; c++) {
                this.grid[r][c] = null;
            }
        }
    }
    /*--------------------*/

    resetGrid() {
        for (let r = 0; r < BOX_ROWS; r++) {
            for (let c = 0; c < BOX_COLUMNS; c++) {
                this.grid[r][c] = null;
            }
        }
    }

    /*--------------------*/

    hasObstacleRightOf(cellsToCheck) {
        return cellsToCheck.some(({ row, col }) => {
            let colToRight = col + 1;
            return colToRight === BOX_COLUMNS || this.grid[row][colToRight] !== null;
        });

    }

    /*--------------------*/

    hasObstacleLeftOf(cellsToCheck) {
        return cellsToCheck.some(({ row, col }) => {
            let colToLeft = col - 1;
            return colToLeft < 0 || this.grid[row][colToLeft] !== null;
        });
    }

    /*--------------------*/

    hasObstacleUnderOf(cellsToCheck) {
        return cellsToCheck.some(({ row, col }) => {
            let rowUnder = row + 1;
            return rowUnder === BOX_ROWS || this.grid[rowUnder][col] !== null;
        });
    }

    /*--------------------*/

    freezeTilesInBox(cells) {
        cells.forEach(({ row, col }) => this.grid[row][col] = true);
        gameStatus.currentTetromino.freezeDelayTime = 0;
        gameStatus.currentTetromino.isBeingMovedDown = true;
    }

    /*--------------------*/

    checkForFinishedRows() {
        let completedRowIndexes = [];
        for (let rowIndex = 0; rowIndex < BOX_ROWS; rowIndex++) {
            if (this.grid[rowIndex].every(value => value === true)) {
                completedRowIndexes.push(rowIndex);
            }
        }
        return completedRowIndexes;
    }

    /*--------------------*/

    isCellsFree(cellsToCheck) {
        return cellsToCheck.every(({ row, col }) => !this.grid[row][col]);
    }

    /*--------------------*/

    removeRows(completedRowIndexes) {
        this.updateGridAfterRemovingRows(completedRowIndexes);
        const sortedTiles = this.findTilesToRemoveAndShift(completedRowIndexes);
        this.removeTiles(sortedTiles.tilesToRemove);
        //After animation has run remove empty tetromino div's and shift remaining tiles below
        setTimeout(() => //Wait once the animation is finished
            this.shiftTiles(sortedTiles.tilesToShift)
            , 200);
    }

    /*--------------------*/

    updateGridAfterRemovingRows(completedRowIndexes) {
        //Remove completed rows from grid
        for (let i = completedRowIndexes.length - 1; i >= 0; i--) {
            this.grid.splice(completedRowIndexes[i], 1);
        }

        //Add empty rows to the top of the grid
        let newEmptyRows = [];
        for (let i = 0; i < completedRowIndexes.length; i++) {
            newEmptyRows.push(new Array(BOX_COLUMNS).fill(null));
        }
        this.grid.unshift(...newEmptyRows);
    }

    /*--------------------*/

    findTilesToRemoveAndShift(completedRowIndexes) {
        const boxClientRect = this.element.getBoundingClientRect();
        const boxTop = boxClientRect.top + 3; //Box border width = 3
        const tiles = this.element.getElementsByClassName("tile");
        const tilesToRemove = [];
        const tilesToShift = [];
        let rowShifts = {};

        for (let i = 0; i < completedRowIndexes.length; i++) rowShifts[completedRowIndexes[i]] = 0;
        for (let i = 0; i < completedRowIndexes[0]; i++) rowShifts[i] = completedRowIndexes.length;
        for (let i = 0; i < completedRowIndexes.length-1; i++){
            for (let j = completedRowIndexes[i]+1; j <completedRowIndexes[i+1];j++) rowShifts[j] = completedRowIndexes.length-1-i;
        }

        //Sort tiles by which have to be removed and which have to move down
        for (let i = tiles.length - 1; i >= 0; i--) {
            let tileClientRect = tiles[i].getBoundingClientRect();
            const tileRow = Math.round((tileClientRect.top - boxTop) / TILE_SIZE); // Find in which row current tile is
            if (rowShifts[tileRow] === 0) {
                tilesToRemove.push(tiles[i]);
            } else if (rowShifts[tileRow] !== undefined) {
                tilesToShift.push({ tile: tiles[i], shift: rowShifts[tileRow] });
            }
        }

        return { tilesToRemove, tilesToShift };
    }

    /*--------------------*/

    removeTiles(tilesToRemove) {
        //Remove tiles by adding classes to them to start animation (first they go white, then fade away)
        tilesToRemove.forEach(tile => {
            tile.classList.remove("tile");
            tile.classList.add("emptyTile");
            tile.classList.add("dissapearingTile");
        })
    }

    /*--------------------*/

    shiftTiles(tilesToShift) {
        const tetrominoDivs = this.element.getElementsByClassName("tetromino");
        //Go over each tetromino div and delete it if all it's children are emptyTile
        for (let i = tetrominoDivs.length - 1; i >= 0; i--) {
            const tetrominoTiles = Array.from(tetrominoDivs[i].children)
            if (tetrominoTiles.every(tile => tile.classList.contains("emptyTile"))) {
                tetrominoDivs[i].remove();
            }
        }
        //Shift tiles by corresponding distance
        for (let i = 0; i < tilesToShift.length; i++) {
            tilesToShift[i].tile.classList.add("tileFall"); //Add transition class if tile doesn't have it yet
            const shiftInPixels = tilesToShift[i].shift * TILE_SIZE;
            tilesToShift[i].tile.style.transform += " translateY(" + shiftInPixels + "px)";
        }
    }
}

/*------------------------------------------------------*/

export const gamebox = new Gamebox;


