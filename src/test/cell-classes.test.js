import {getCellClasses} from '../cell-classes';

describe('getCellClasses', () => {
    describe('upper border', () => {
        it('adds upper border class for top row cells', () => {
            const classes = getCellClasses({rowIndex: 0, colIndex: 0, puzzleSize: 9});
            expect(classes).toEqual(expect.stringContaining('cell-thick-upper-border'));
        });

        it('does not add upper border class to cells that are not in the top row of the puzzle', () => {
            const classes1 = getCellClasses({rowIndex: 2, colIndex: 7, puzzleSize: 9});
            expect(classes1).toEqual(expect.not.stringContaining('cell-thick-upper-border'));

            const classes2 = getCellClasses({rowIndex: 3, colIndex: 6, puzzleSize: 9});
            expect(classes2).toEqual(expect.not.stringContaining('cell-thick-upper-border'));
        });
    });

    describe('lower border', () => {
        it('adds lower border class for cells in every sqrt(puzzleSize) row', () => {
            const classes = getCellClasses({rowIndex: 2, colIndex: 6, puzzleSize: 9});
            expect(classes).toEqual(expect.stringContaining('cell-thick-lower-border'));
        });

        it('does not add lower border class to cells that are not in sqrt(puzzleSize)-th row', () => {
            const classes = getCellClasses({rowIndex: 2, colIndex: 0, puzzleSize: 4});
            expect(classes).toEqual(expect.not.stringContaining('cell-thick-lower-border'));
        });
    });

    describe('left border', () => {
        it('adds left border class for first column cells', () => {
            const classes = getCellClasses({rowIndex: 5, colIndex: 0, puzzleSize: 9});
            expect(classes).toEqual(expect.stringContaining('cell-thick-left-border'));
        });

        it('does not add lower border class to cells that are not in sqrt(puzzleSize)-th row', () => {
            const classes = getCellClasses({rowIndex: 2, colIndex: 1, puzzleSize: 4});
            expect(classes).toEqual(expect.not.stringContaining('cell-thick-left-border'));
        });
    });

    describe('right border', () => {
        it('adds right border class for cells in every sqrt(puzzleSize) column', () => {
            const classes = getCellClasses({rowIndex: 7, colIndex: 5, puzzleSize: 9});
            expect(classes).toEqual(expect.stringContaining('cell-thick-right-border'));
        });

        it('does not add right border class to cells that are not in sqrt(puzzleSize)-th column', () => {
            const classes = getCellClasses({rowIndex: 2, colIndex: 2, puzzleSize: 4});
            expect(classes).toEqual(expect.not.stringContaining('cell-thick-right-border'));
        });
    });
});
