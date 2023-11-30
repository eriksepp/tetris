import { BOX_ROWS, BOX_COLUMNS, TILE_SIZE } from "./initData.js";
import { gamebox } from "./gameBox.js";

class TetrominoModel {
    constructor(initialData) {
        this.rows = initialData.rows;
        this.columns = initialData.columns;
        this.offsetFromGridLine = 0;

        this.addressOnGrid = { row: 0, col: Math.floor((BOX_COLUMNS - this.columns) / 2) };
        this.placement = Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            this.placement[i] = [...initialData.placement[i]];
        }
    }

    /*----------------------------------------------------------------------------------------*/
    toString() {
        if (Object.keys(this).length === 0) return '';
        return `rows: ${this.rows}
        columns: ${this.columns} 
        offset from grid line: ${this.offsetFromGridLine}
        address on grid: 
            row: ${this.addressOnGrid.row}
            col: ${this.addressOnGrid.col}
        placement: ${this.placement}`;
    }

    /*----------------------------------------------------------------------------------------*/
    getBottomEdgeCells() {
        let tilesOnEdge = [];
        const additionRow = this.offsetFromGridLine === 0 ? 0 : 1
        for (let col = 0; col < this.columns; col++) {
            let row = this.rows - 1;
            while (!this.placement[row][col]) row--;
            tilesOnEdge.push({ row: this.addressOnGrid.row + row + additionRow, col: this.addressOnGrid.col + col });
        }
        return tilesOnEdge;
    }

    /*----------------------------------------------------------------------------------------*/
    getRightEdgeCells() {
        const tilesOnEdge = this.placement.reduce((tilesOnEdge, rowVector, rowNumber) => {
            tilesOnEdge.push({ row: this.addressOnGrid.row + rowNumber, col: this.addressOnGrid.col + rowVector.lastIndexOf(true) });
            return tilesOnEdge;
        }, []);


        // if the tetromino is shifted from the grid,
        // add to the list of tiles on edge those that are under ledges:
        // XX    or    XX    or   X
        // X^         XX^         X
        // X           ^          XX
        // ^                       ^
        if (this.offsetFromGridLine > 0) {
            // add the cells under the bottom tile  
            let tilesOnEdgeLength = tilesOnEdge.length;
            for (let i = 0; i < tilesOnEdgeLength; i++) {
                tilesOnEdge.push({ row: tilesOnEdge.at(i).row + 1, col: tilesOnEdge.at(i).col });

            }
        }
        return tilesOnEdge;
    }


    /*----------------------------------------------------------------------------------------*/
    getLeftEdgeCells() {
        const tilesOnEdge = this.placement.reduce((tilesOnEdge, rowVector, rowNumber) => {
            tilesOnEdge.push({ row: this.addressOnGrid.row + rowNumber, col: this.addressOnGrid.col + rowVector.indexOf(true) })
            return tilesOnEdge;
        }, []);

        // if the tetromino is shifted from the grid,
        // add to the list of tiles on edge those that are under ledges:
        //  XX    or    XX       or  X
        //  ^X          ^XX          X
        //   X           ^          XX
        //   ^                      ^
        if (this.offsetFromGridLine > 0) {
            // add the cells under the bottom tile  
            let tilesOnEdgeLength = tilesOnEdge.length;
            for (let i = 0; i < tilesOnEdgeLength; i++) {
                tilesOnEdge.push({ row: tilesOnEdge.at(i).row + 1, col: tilesOnEdge.at(i).col });

            }

        }

        return tilesOnEdge;
    }

    /*----------------------------------------------------------------------------------------*/
    getOccupiedCells() {
        let tilesAddresses = [];
        for (let row = 0; row < this.rows; row++) {
            this.placement[row].reduce((allTiles, mark, col) => {
                if (mark) {
                    allTiles.push({ row: this.addressOnGrid.row + row, col: this.addressOnGrid.col + col })
                    if (this.offsetFromGridLine) {
                        allTiles.push({ row: this.addressOnGrid.row + row + 1, col: this.addressOnGrid.col + col })
                    }
                }
                return allTiles;
            }, tilesAddresses);
        }
        return tilesAddresses;
    }
}


export class Tetromino {
    constructor(initialData) {
        this.shape = initialData.shape;

        this.model = new TetrominoModel(initialData);

        this.view = {
            colorCodes: initialData.colorCodes,
            rotationCounter: 0,
            translateOffsetX: 0,
            translateOffsetY: 0,
        }

        if (!gamebox.isCellsFree(this.model.getOccupiedCells())) {
            this.model.rows = 1;
            this.model.placement = [this.model.placement[1]];
            this.view.element = createTetrominoElm((BOX_COLUMNS / 2 - Math.ceil(this.model.columns / 2)) * TILE_SIZE, this.model.rows * TILE_SIZE, this.model.columns * TILE_SIZE, this.model.placement, this.view.colorCodes);
            delete this.shape;
            delete this.model;
            delete this.view;
            return;
        }

        this.view.element = createTetrominoElm((BOX_COLUMNS / 2 - Math.ceil(this.model.columns / 2)) * TILE_SIZE, this.model.rows * TILE_SIZE, this.model.columns * TILE_SIZE, this.model.placement, this.view.colorCodes);
    }

    /*----------------------------------------------------------------------------------------*/
    isFinal() { return this.shape == undefined; }
    
    /*----------------------------------------------------------------------------------------*/
    isOnTop() { return this.model.addressOnGrid.row===0; }

    /*----------------------------------------------------------------------------------------*/
    toString() {
        if (Object.keys(this).length === 0) return '';
        return `shape: ${this.shape} 
        --model--
        ${this.model.toString()}
        --view-- 
        offset:
            x: ${this.view.translateOffsetX}
            y: ${this.view.translateOffsetX}
        rotation: ${this.view.rotationCounter}`
    }

    /*----------------------------------------------------------------------------------------*/
    moveDown(speed) {

        // check if the previose movment (right/left or rotation) put the tetromino on an obstacle
        if (this.model.offsetFromGridLine === 0 && gamebox.hasObstacleUnderOf(this.model.getBottomEdgeCells())) {
            return false;
        }

        let offset = this.model.offsetFromGridLine + speed;
        if (offset < TILE_SIZE) {
            this.model.offsetFromGridLine = offset;

            this.view.translateOffsetY += speed;
            this.moveElm();
            return true;
        } else {
            const hasObstacleUnder = gamebox.hasObstacleUnderOf(this.model.getBottomEdgeCells());
            this.model.addressOnGrid.row++;
            if (!hasObstacleUnder) {
                this.model.offsetFromGridLine = offset - TILE_SIZE; // offset supposed to be < 2*TILE_SIZE. In this case we need to do %TILE_SIZE, but -TILE_SIZE is faster

                this.view.translateOffsetY += speed;
            } else {
                // if there is an obstacle in the possible futere cell, 
                // move the tetromino by only the distance exactly needed to finish the movement in the current cell  
                this.view.translateOffsetY += TILE_SIZE - this.model.offsetFromGridLine;

                this.model.offsetFromGridLine = 0;
            }
            this.moveElm();
            return true;
        }
    }

    /*----------------------------------------------------------------------------------------*/
    moveRight() {
        if (!gamebox.hasObstacleRightOf(this.model.getRightEdgeCells())) {
            // move the model
            this.model.addressOnGrid.col++;

            // move the view
            this.view.translateOffsetX += TILE_SIZE;
            this.moveElm();

            return true;
        }
        return false;
    }

    /*----------------------------------------------------------------------------------------*/
    moveLeft() {
        if (!gamebox.hasObstacleLeftOf(this.model.getLeftEdgeCells())) {
            // move the model
            this.model.addressOnGrid.col--;

            // move the view
            this.view.translateOffsetX -= TILE_SIZE;
            this.moveElm();
            return true;
        }
        return false;
    }

    /*----------------------------------------------------------------------------------------*/
    moveElm() {
        this.view.element.style.transform =
            `translate(${this.view.translateOffsetX}px, ${this.view.translateOffsetY}px) rotate(${0.25 * this.view.rotationCounter}turn) `;

        for (let i = 0; i < this.view.element.children.length; i++) {
            this.view.element.children[i].style.transform =
                `rotate(${-0.25 * this.view.rotationCounter}turn)`;
        }
    }


    /*----------------------------------------------------------------------------------------*/
    rotate() {

        if (this.shape === 'O') return;

        if (this.model.offsetFromGridLine === 0 && gamebox.hasObstacleUnderOf(this.model.getBottomEdgeCells())) {
            return;
        }

        const tetrominoAfterRotate = {};
        calculateTetrominoContainerAfterRotate(this, tetrominoAfterRotate);
        UpdatePlacementAfterRotate(this, tetrominoAfterRotate);

        // check if there are any obstacles
        const cellsToBeFree = [];

        // add the cells ocupated by the new placement to cellsToBeFree
        cellsToBeFree.push(...tetrominoAfterRotate.model.getOccupiedCells());
        if (!gamebox.isCellsFree(cellsToBeFree)) return false;

        // if there were no obstacles make rotation
        [this.model.rows, this.model.columns] = [tetrominoAfterRotate.model.rows, tetrominoAfterRotate.model.columns];
        this.model.placement = tetrominoAfterRotate.model.placement;
        this.model.addressOnGrid.row = tetrominoAfterRotate.model.addressOnGrid.row;
        this.model.addressOnGrid.col = tetrominoAfterRotate.model.addressOnGrid.col;
        this.model.offsetFromGridLine = tetrominoAfterRotate.model.offsetFromGridLine;
        this.view.rotationCounter = (this.view.rotationCounter + 1) % 4;
        this.view.translateOffsetX = tetrominoAfterRotate.view.translateOffsetX;
        this.view.translateOffsetY = tetrominoAfterRotate.view.translateOffsetY;

        this.moveElm();

    }

    getOccupiedCells() {
        return this.model.getOccupiedCells();
    }

}

/*----------------------------------------------------------------------------------------*/
function createTetrominoElm(left, height, width, placement, colorCodes) {
    const newTetromino = document.createElement("div");
    newTetromino.classList.add("tetromino");
    for (let position of placement.flat()) {
        if (position) {
            createNewTile(newTetromino, colorCodes)
        } else {
            const emptyTile = document.createElement("div");
            emptyTile.classList.add("emptyTile");
            newTetromino.appendChild(emptyTile);
        }
    }
    newTetromino.style.width = width + "px";
    newTetromino.style.height = height + "px";
    newTetromino.style.left = left + "px";
    gamebox.element.appendChild(newTetromino);
    return newTetromino;
}

/*----------------------------------------------------------------------------------------*/
function createNewTile(tetromino, colorCodes) {
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgNode.setAttribute('width', `${TILE_SIZE}px`);
    svgNode.setAttribute('height', `${TILE_SIZE}px`);
    svgNode.setAttribute('viewBox', `0 0 ${TILE_SIZE} ${TILE_SIZE}`);
    svgNode.classList.add("tile");
    tetromino.appendChild(svgNode);

    const tileNodeMiddle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tileNodeMiddle.classList.add("tileMiddle");
    tileNodeMiddle.setAttributeNS(null, 'd', `M2.9 2.9h25v25h-25z`);
    tileNodeMiddle.setAttributeNS(null, 'style', 'fill:' + colorCodes[0] + ';fill-opacity:1;stroke-width:.17016');
    svgNode.appendChild(tileNodeMiddle);

    const tileNodeLeftSide = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tileNodeLeftSide.classList.add("tileLeft");
    tileNodeLeftSide.setAttributeNS(null, 'd', `M0 0v${TILE_SIZE}l3-3V3h24l3-3z`);
    tileNodeLeftSide.setAttributeNS(null, 'style', 'fill:' + colorCodes[1] + ';fill-opacity:1;stroke-width:.264583');
    svgNode.appendChild(tileNodeLeftSide);

    const tileNodeRightSide = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tileNodeRightSide.classList.add("tileRight");
    tileNodeRightSide.setAttributeNS(null, 'd', `M${TILE_SIZE} 0v${TILE_SIZE}H0l3-3h24V3Z`);
    tileNodeRightSide.setAttributeNS(null, 'style', 'fill:' + colorCodes[2] + ';fill-opacity:1;stroke-width:.264583');
    svgNode.appendChild(tileNodeRightSide);

    const tileNodeCorners = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tileNodeCorners.classList.add("tileCorners");
    tileNodeCorners.setAttributeNS(null, 'd', `M0 ${TILE_SIZE}v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z`);
    tileNodeCorners.setAttributeNS(null, 'style', 'fill:' + colorCodes[3] + ';fill-opacity:1;stroke-width:.264583');
    svgNode.appendChild(tileNodeCorners);
}

/*----------------------------------------------------------------------------------------*/
function calculateTetrominoContainerAfterRotate(tetromino, tetrominoAfterRotate) {
    tetrominoAfterRotate.correctPositionOnTopEdgeOfGamebox = correctPositionOnTopEdgeOfGamebox;
    tetrominoAfterRotate.correctPositionOnBottomEdgeOfGamebox = correctPositionOnBottomEdgeOfGamebox;
    tetrominoAfterRotate.correctPositionOnLeftEdgeOfGamebox = correctPositionOnLeftEdgeOfGamebox;
    tetrominoAfterRotate.correctPositionOnRightEdgeOfGamebox = correctPositionOnRightEdgeOfGamebox;

    const diff = tetromino.model.columns - tetromino.model.rows;
    const containerMeasureChange = Math.trunc(diff / 2);
    // in theory we can calculate the shift of the tetromino after the rotation ( (diff%2)*TILE_SIZE), but
    // for all tetrominos (except for "O" which doesn't need to rotate) 'diff%2' is equal  +/-0.5.
    // just simlify the calculation
    const containerHalfShift = Math.sign(diff) * 0.5 * TILE_SIZE;

    tetrominoAfterRotate.model = new TetrominoModel(tetromino.model); // tetromino.model is used for convinience, but it'd better not to use its data later, cause some of them are counted as for start position. So futher tetromino.<property> explicitly are uesed. 
    [tetrominoAfterRotate.model.rows, tetrominoAfterRotate.model.columns] = [tetromino.model.columns, tetromino.model.rows];

    tetrominoAfterRotate.view = {
        translateOffsetY: tetromino.view.translateOffsetY,
    }

    // -- Vertical positions
    let verticalOffset = tetromino.model.offsetFromGridLine - containerHalfShift;
    tetrominoAfterRotate.model.addressOnGrid.row = tetromino.model.addressOnGrid.row - (containerMeasureChange - Math.floor(verticalOffset / TILE_SIZE));
    tetrominoAfterRotate.model.offsetFromGridLine = (TILE_SIZE + verticalOffset) % TILE_SIZE; // (TILE_SIZE+verticalOffset) - correction for negative verticalOffset 

    tetrominoAfterRotate.correctPositionOnTopEdgeOfGamebox();
    tetrominoAfterRotate.correctPositionOnBottomEdgeOfGamebox();

    // -- Horizontal positions
    // --- correct horizontal position of the tetromino view after rotation, in the other case it would stay in the middle of the grid.
    tetrominoAfterRotate.view.translateOffsetX = tetromino.view.translateOffsetX - containerHalfShift;
    tetrominoAfterRotate.model.addressOnGrid.col = tetromino.model.addressOnGrid.col + containerMeasureChange;

    tetrominoAfterRotate.correctPositionOnLeftEdgeOfGamebox();
    tetrominoAfterRotate.correctPositionOnRightEdgeOfGamebox();

}

/*----------------------------------------------------------------------------------------*/
function UpdatePlacementAfterRotate(tetromino, tetrominoAfterRotate) {
    tetrominoAfterRotate.model.placement = Array(tetrominoAfterRotate.model.rows);

    for (let row = 0; row < tetrominoAfterRotate.model.rows; row++) {
        tetrominoAfterRotate.model.placement[row] = Array(tetrominoAfterRotate.model.columns);
        for (let col = 0; col < tetrominoAfterRotate.model.columns; col++) {
            tetrominoAfterRotate.model.placement[row][col] = tetromino.model.placement[col][row];
        }
    }

    if (tetromino.shape !== 'I') {

        for (let row = 0; row < tetrominoAfterRotate.model.rows; row++) {
            for (let col = 0; col < Math.trunc(tetrominoAfterRotate.model.columns / 2); col++) {
                [tetrominoAfterRotate.model.placement[row][col], tetrominoAfterRotate.model.placement[row][tetrominoAfterRotate.model.columns - 1 - col]] =
                    [tetrominoAfterRotate.model.placement[row][tetrominoAfterRotate.model.columns - 1 - col], tetrominoAfterRotate.model.placement[row][col]];
            }
        }
    }
}

/*----------------------------------------------------------------------------------------*/
function correctPositionOnLeftEdgeOfGamebox() {
    if (this.model.addressOnGrid.col < 0) {
        this.view.translateOffsetX += -this.model.addressOnGrid.col * TILE_SIZE;
        this.model.addressOnGrid.col = 0;
    }
}

/*----------------------------------------------------------------------------------------*/
function correctPositionOnRightEdgeOfGamebox() {
    const rightAllowdEdgeForAddress = BOX_COLUMNS - this.model.columns;
    if (this.model.addressOnGrid.col > rightAllowdEdgeForAddress) {
        this.view.translateOffsetX -= (this.model.addressOnGrid.col - rightAllowdEdgeForAddress) * TILE_SIZE;
        this.model.addressOnGrid.col = rightAllowdEdgeForAddress;
    }
}

/*----------------------------------------------------------------------------------------*/
function correctPositionOnTopEdgeOfGamebox() {
    if (this.model.addressOnGrid.row < 0) {
        this.view.translateOffsetY += -this.model.addressOnGrid.row * TILE_SIZE - this.model.offsetFromGridLine;
        this.model.addressOnGrid.row = 0;
        this.model.offsetFromGridLine = 0;
    }
}

/*----------------------------------------------------------------------------------------*/
function correctPositionOnBottomEdgeOfGamebox() {
    const bottomAllowdEdgeForAddress = BOX_ROWS - this.model.rows - (this.model.offsetFromGridLine !== 0 ? 1 : 0); // rows after rotation = columns before rotation
    if (this.model.addressOnGrid.row > bottomAllowdEdgeForAddress) {
        this.view.translateOffsetY -= (this.model.addressOnGrid.row - bottomAllowdEdgeForAddress) * TILE_SIZE;
        this.model.addressOnGrid.row = bottomAllowdEdgeForAddress;
    }
}