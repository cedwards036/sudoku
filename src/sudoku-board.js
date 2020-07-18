import {produce, immerable} from "immer"

import SudokuCell from './sudoku-cell';

export default function SudokuBoard(boardArray) {
    const board = Object.create(SudokuBoard.prototype);
    boardArray.forEach((row, index) => {
        board[index] = row.map(value => SudokuCell(value));
    });
    board.size = boardArray.length;
    board.topSelectedRowIndex = -1;
    board.topSelectedColIndex = -1;
    board.hasSelection = false;
    return board;
}

SudokuBoard.createEmpty = (size = 9) => {
    const emptyPuzzle = new Array(size).fill().map(() => new Array(size).fill(0));
    return SudokuBoard(emptyPuzzle);
}

SudokuBoard.prototype = {
    [immerable]: true,

    forEachRow(callback) {
        range(this.size).forEach(index => {
            callback(this[index], index);
        });
    },

    mapRows(callback) {
        return range(this.size).map(rowIndex => {
            return callback(this[rowIndex], rowIndex);
        });
    },

    selectCell(rowIndex, colIndex) {
        if (this.cellExists(rowIndex, colIndex)) {
            return produce(this, draft => {
                draft[rowIndex][colIndex].isSelected = true;
                draft.topSelectedRowIndex = rowIndex;
                draft.topSelectedColIndex = colIndex;
                draft.hasSelection = true;
            });
        } else {
            return this;
        }
    },

    clearAllSelections() {
        return produce(this, draft => {
            draft.forEachRow(row => row.map(cell => cell.isSelected = false));
            draft.topSelectedRowIndex = -1;
            draft.topSelectedColIndex = -1;
            draft.hasSelection = false;
        });
    },

    cellExists(rowIndex, colIndex) {
        return this[rowIndex] != null && this[rowIndex][colIndex] != null;
    }
}

function range(n) {
    return [...Array(n).keys()];
}