import {produce, immerable} from "immer"
import {solveClassicSudoku} from "@cedwards036/sudoku-solver";

import SudokuCell from './sudoku-cell';
import CellValueTypes from './cell-value-types';
import Cell from "../components/Cell";

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

    getDisplayedCellValues(rowIndex, colIndex) {
        const cell = this[rowIndex][colIndex];
        if (cell.value !== 0) {
            return {
                type: CellValueTypes.value,
                userValue: cell.value
            }
        } else if (cell.userValue !== 0) {
            return {
                type: CellValueTypes.userValue,
                userValue: cell.userValue
            }
        } else {
            return {
                type: CellValueTypes.inProgress,
                cornerMarks: cell.cornerMarks,
                centerMarks: cell.centerMarks
            }
        }
    },

    getSolutions() {
        return solveClassicSudoku(this.toValuesArray());
    },

    toValuesArray() {
        return this.mapRows(row => row.map(cell => cell.value));
    },

    cellExists(rowIndex, colIndex) {
        return this[rowIndex] != null && this[rowIndex][colIndex] != null;
    }
}

function range(n) {
    return [...Array(n).keys()];
}