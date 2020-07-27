import {immerable} from "immer"

export default function SudokuCell(value = 0) {
    const cell = Object.create(SudokuCell.prototype);
    cell.value = value;
    cell.isSelected = false;
    cell.cornerMarks = [];
    cell.centerMarks = [];
    return cell;
}

SudokuCell.prototype = {
    [immerable]: true
}