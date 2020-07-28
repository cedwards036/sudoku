import SudokuCell from '../core/sudoku-cell';
import CellValueTypes from '../core/cell-value-types';


describe('getDisplayedValues', () => {
    describe('when the cell has no value or user value', () => {
        it('returns an object with center and corner pencil marks', () => {
            const cell = SudokuCell();
            expect(cell.getDisplayedValues()).toEqual({
                type: CellValueTypes.inProgress,
                cornerMarks: [],
                centerMarks: []
            });
            cell.addCenterMark(1);
            cell.addCenterMark(2);
            cell.addCornerMark(3);
            expect(cell.getDisplayedValues()).toEqual({
                type: CellValueTypes.inProgress,
                cornerMarks: [3],
                centerMarks: [1, 2]
            });
        });
    });

    describe('when the cell has a user value', () => {
        it('returns an object with the user value', () => {
            const cell = SudokuCell();
            cell.userValue = 3;
            expect(cell.getDisplayedValues()).toEqual({
                type: CellValueTypes.userValue,
                userValue: 3
            });
        });

        it('supercedes corner/center pencil marks', () => {
            const cell = SudokuCell();
            cell.addCenterMark(1);
            cell.addCenterMark(2);
            cell.addCornerMark(3);
            cell.userValue = 4;
            expect(cell.getDisplayedValues()).toEqual({
                type: CellValueTypes.userValue,
                userValue: 4
            });
        });
    });

    describe('when the cell has a value', () => {
        it('returns an object with the value', () => {
            const cell = SudokuCell();
            cell.value = 3;
            expect(cell.getDisplayedValues()).toEqual({
                type: CellValueTypes.value,
                value: 3
            });
        });
        
        it('supercedes corner/center pencil marks and user values', () => {
            const cell = SudokuCell();
            cell.addCenterMark(1);
            cell.addCenterMark(2);
            cell.addCornerMark(3);
            cell.userValue = 4;
            cell.value = 5;
            expect(cell.getDisplayedValues()).toEqual({
                type: CellValueTypes.value,
                value: 5
            });
        });
    });
});