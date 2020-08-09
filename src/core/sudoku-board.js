import {produce, immerable} from "immer"
import {solveClassicSudoku} from "@cedwards036/sudoku-solver";

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
    board.solutions = getSolutions(board);
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

    forEachSelected(callback) {
        this.forEachRow(row => row.forEach((cell, index) => {
            if (cell.isSelected) {
                callback(cell, index);
            }
        }));
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

    selectAllCells() {
        return produce(this, draft => {
            draft.forEachRow(row => row.map(cell => cell.isSelected = true));
            draft.topSelectedRowIndex = 0;
            draft.topSelectedColIndex = 0;
            draft.hasSelection = true;
        });
    },

    clearAllSelections() {
        return produce(this, draft => {
            draft.forEachRow(row => row.map(cell => cell.isSelected = false));
            draft.topSelectedRowIndex = -1;
            draft.topSelectedColIndex = -1;
            draft.hasSelection = false;
        });
    },

    updateSelectedValues(newValue) {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                cell.value = newValue;
            });
            draft.solutions = getSolutions(draft);
        });
    },

    updateSelectedUserValues(newUserValue) {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                cell.userValue = newUserValue;
            });
        });
    },

    addToSelectedCornerMarks(newMark) {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                cell.addCornerMark(newMark);
            });
        });
    },

    removeFromSelectedCornerMarks(newMark) {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                cell.removeCornerMark(newMark);
            });
        });
    },

    addToSelectedCenterMarks(newMark) {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                cell.addCenterMark(newMark);
            });
        });
    },

    removeFromSelectedCenterMarks(newMark) {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                cell.removeCenterMark(newMark);
            });
        });
    },

    deleteSelectedInProgressMarks() {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                cell.deleteInProgressMarks();
            });
        });
    },

    getSolutions() {
        return this.solutions;
    },

    toValuesArray() {
        return this.mapRows(row => row.map(cell => cell.value));
    },

    cellExists(rowIndex, colIndex) {
        return this[rowIndex] != null && this[rowIndex][colIndex] != null;
    },

    getIncorrectCells() {
        const result = {};
        if (this.solutions.length > 0) {
            const solution = this.solutions[0];
            this.forEachRow((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell.value === 0 && cell.userValue !== solution[rowIndex][colIndex]) {
                        if (!result.hasOwnProperty(rowIndex)) {
                            result[rowIndex] = [];
                        }
                        result[rowIndex].push(colIndex);
                    }
                });
            });
        }
        return result;
    }
}


function getSolutions(board) {
    return solveClassicSudoku(board.toValuesArray());
}

function range(n) {
    return [...Array(n).keys()];
}