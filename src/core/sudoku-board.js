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
    board.selectedCount = 0;
    board.userValueSuccessfullyWritten = false;
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
                draft.selectedCount += 1;
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
            draft.selectedCount = draft.size ** 2;
        });
    },

    clearAllSelections() {
        return produce(this, draft => {
            draft.forEachRow(row => row.map(cell => cell.isSelected = false));
            draft.topSelectedRowIndex = -1;
            draft.topSelectedColIndex = -1;
            draft.hasSelection = false;
            draft.selectedCount = 0;
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
            let updatedCount = 0;
            draft.forEachSelected(cell => {
                if (cell.value === 0) {
                    cell.userValue = newUserValue;
                    updatedCount += 1;
                }
            });
            draft.userValueSuccessfullyWritten = updatedCount > 0;
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

    deleteFromSelectedCells() {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                if (cell.userValue !== 0) {
                    cell.userValue = 0;
                } else {
                    cell.deleteInProgressMarks();
                }
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
    },

    highlightCellsWithValue(value) {
        return produce(this, draft => {
            draft.forEachRow(row => row.forEach(cell => {
                if (cell.hasVisibleValue(value)) {
                    cell.isHighlighted = true;
                }
            }));
        });
    },

    unhighlightAllCells() {
        return produce(this, draft => {
            draft.forEachRow(row => row.forEach(cell => {
                cell.isHighlighted = false;
            }));
        });
    },
}


function getSolutions(board) {
    return solveClassicSudoku(board.toValuesArray());
}

function range(n) {
    return [...Array(n).keys()];
}