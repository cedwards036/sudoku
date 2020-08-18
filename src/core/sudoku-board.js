import {produce, immerable} from "immer"
import {solveClassicSudoku} from "@cedwards036/sudoku-solver";

import SudokuCell from './sudoku-cell';

export default function SudokuBoard(boardArray) {
    const board = Object.create(SudokuBoard.prototype);
    boardArray.forEach((row, index) => {
        board[index] = row.map(value => SudokuCell(value));
    });
    board.size = boardArray.length;
    board.boxSize = Math.sqrt(board.size);
    board.topSelectedRowIndex = -1;
    board.topSelectedColIndex = -1;
    board.hasSelection = false;
    board.solutions = getSolutions(board);
    board.selectedCount = 0;
    board.currentValueCounts = getValueCounts(board);
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

    forEachCellInCol(colIndex, callback) {
        range(this.size).forEach(rowIndex => {
            callback(this[rowIndex][colIndex], rowIndex, colIndex);
        });
    },

    forEachCellInBox(boxIndex, callback) {
        const startingRowIndex =  Math.floor(boxIndex / this.boxSize) * this.boxSize;
        const startingColIndex = (boxIndex % this.boxSize) * this.boxSize;
        for (let rowIndex = startingRowIndex; rowIndex < startingRowIndex + this.boxSize; rowIndex++) {
            for (let colIndex = startingColIndex; colIndex < startingColIndex + this.boxSize; colIndex++) {
                callback(this[rowIndex][colIndex], rowIndex, colIndex);
            }
        }
    },

    mapRows(callback) {
        return range(this.size).map(rowIndex => {
            return callback(this[rowIndex], rowIndex);
        });
    },

    forEachSelected(callback) {
        this.forEachRow((row, rowIndex) => row.forEach((cell, colIndex) => {
            if (cell.isSelected) {
                callback(cell, rowIndex, colIndex);
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
                draft.decrementValueCount(cell.userValue);
                cell.value = newValue;
                draft.incrementValueCount(newValue);
            });
            draft.solutions = getSolutions(draft);
        });
    },

    updateSelectedUserValues(newUserValue) {
        return produce(this, draft => {
            let updatedCount = 0;
            draft.forEachSelected((cell, rowIndex, colIndex) => {
                if (cell.value === 0) {
                    draft.decrementValueCount(cell.userValue);
                    cell.userValue = newUserValue;
                    updatedCount++;
                    draft.incrementValueCount(newUserValue);
                    removePencilMarksFromRow(draft, rowIndex, newUserValue);
                    removePencilMarksFromCol(draft, colIndex, newUserValue);
                    removePencilMarksFromBox(draft, rowIndex, colIndex, newUserValue);
                }
            });
            draft.userValueSuccessfullyWritten = updatedCount > 0;
        });
    },

    toggleSelectedCornerMarks(newMark) {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                if (cell.cornerMarks.includes(newMark)) {
                    cell.removeCornerMark(newMark);
                } else {
                    cell.addCornerMark(newMark);
                }
            });
        });
    },

    toggleSelectedCenterMarks(newMark) {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                if (cell.centerMarks.includes(newMark)) {
                    cell.removeCenterMark(newMark);
                } else {
                    cell.addCenterMark(newMark);
                }
            });
        });
    },

    deleteFromSelectedCells() {
        return produce(this, draft => {
            draft.forEachSelected(cell => {
                if (cell.userValue !== 0) {
                    draft.decrementValueCount(cell.userValue);
                    cell.userValue = 0;
                    draft.incrementValueCount(0);
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

    incrementValueCount(value) {
        this.currentValueCounts[value]++;
    },

    decrementValueCount(value) {
        this.currentValueCounts[value]--;
    },

    cellBoxIndex(rowIndex, colIndex) {
        const boxSize = Math.sqrt(this.size);
        return Math.floor(rowIndex / boxSize) * boxSize + Math.floor(colIndex / boxSize);
    },
}

function getValueCounts(board) {
    const counts = Array(board.size + 1).fill(0);
    board.forEachRow(row => row.forEach(cell => {
        if (cell.userValue !== 0) {
            counts[cell.userValue]++;
        } else {
            counts[cell.value]++;
        }
    }));
    return counts;
}

function getSolutions(board) {
    return solveClassicSudoku(board.toValuesArray());
}

function removePencilMarksFromRow(board, rowIndex, value) {
    board[rowIndex].forEach(cell => removePencilMarks(cell, value));
}

function removePencilMarksFromCol(board, colIndex, value) {
    board.forEachCellInCol(colIndex, cell => removePencilMarks(cell, value));
}

function removePencilMarksFromBox(board, rowIndex, colIndex, value) {
    const boxIndex = board.cellBoxIndex(rowIndex, colIndex);
    board.forEachCellInBox(boxIndex, cell => removePencilMarks(cell, value));
}

function removePencilMarks(cell, value) {
    cell.removeCornerMark(value);
    cell.removeCenterMark(value);
}

function range(n) {
    return [...Array(n).keys()];
}