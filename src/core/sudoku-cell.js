import { immerable } from "immer";
import CellValueTypes from './cell-value-types';

export default function SudokuCell(value = 0, userValue = 0) {
    const cell = Object.create(SudokuCell.prototype);
    cell.value = value;
    cell.userValue = userValue;
    cell.isSelected = false;
    cell.cornerMarks = [];
    cell.centerMarks = [];
    return cell;
}

SudokuCell.prototype = {
    [immerable]: true,
    addCornerMark(newMark) {
        insertIntoUniqueSortedArray(this.cornerMarks, newMark);
    },

    addCenterMark(newMark) {
        insertIntoUniqueSortedArray(this.centerMarks, newMark);
    },

    removeCenterMark(mark) {
        removeFromArray(this.centerMarks, mark);
    },

    removeCornerMark(mark) {
        removeFromArray(this.cornerMarks, mark);
    },

    getDisplayedValues() {
        if (this.value !== 0) {
            return {
                type: CellValueTypes.value,
                value: this.value
            }
        } else if (this.userValue !== 0) {
            return {
                type: CellValueTypes.userValue,
                userValue: this.userValue
            }
        } else {
            return {
                type: CellValueTypes.inProgress,
                cornerMarks: this.cornerMarks,
                centerMarks: this.centerMarks
            }
        }
    },
}

function insertIntoUniqueSortedArray(arr, item) {
    if (!arr.includes(item)) {
        arr.push(item);
        arr.sort();
    }
}

function removeFromArray(arr, item) {
    const itemIndex = arr.indexOf(item);
    if (itemIndex !== -1) {
        arr.splice(itemIndex, 1);
    }
}