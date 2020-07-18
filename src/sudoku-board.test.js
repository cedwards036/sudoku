import SudokuBoard from './sudoku-board';
import SudokuCell from './sudoku-cell';

describe('SudokuBoard', () => {
    it('can create an empty grid of the given dimension', () => {
        const sudoku = SudokuBoard.createEmpty(4);
        expect(sudoku.size).toEqual(4);
        sudoku.forEachRow(row => {
            row.forEach(cell => {
                expect(cell.value).toEqual(0);
            });
        });
    });

    describe('forEachRow', () => {
        it('iterates over the rows of the board, applying the given function', () => {
            let nums = [];
            const addToNums = (value) => nums.push(value);
            const sudoku = SudokuBoard.createEmpty(4);
            sudoku.forEachRow((row, index) => {
                addToNums(row[0].value);
                addToNums(index);
            });
            expect(nums).toEqual([0, 0, 0, 1, 0, 2, 0, 3])
        });
    });

    describe('mapRows', () => {
        it('maps the array of rows to a new array after applying the given function transformation', () => {
            const toCellValues = (row) => row.map(cell => cell.value);
            const sudoku = SudokuBoard.createEmpty(4);
            expect(sudoku.mapRows(toCellValues)[0]).toEqual([0, 0, 0, 0])
        });
    });

    describe('selectCell', () => {
        it('selects the given cell if the cell is unselected', () => {
            const sudoku = SudokuBoard.createEmpty(4).selectCell(0, 0);
            expect(sudoku[0][0].isSelected).toEqual(true);
        });

        it('does nothing if the cell is already selected', () => {
            const sudoku = SudokuBoard.createEmpty(4).selectCell(0, 0).selectCell(0, 0);
            expect(sudoku[0][0].isSelected).toEqual(true);
        });

        it('does nothing if the cell does not exist', () => {
            const sudoku = SudokuBoard.createEmpty(4);
            expect(sudoku).toEqual(sudoku.selectCell(13, 45));
        });
    });

    describe('clearAllSelections', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.clearAllSelections());
        });

        it('de-selects all selected cells', () => {
            const unselectedSudoku = SudokuBoard.createEmpty(9);
            const selectedSudoku = unselectedSudoku
                                    .selectCell(0, 0)
                                    .selectCell(1, 4)
                                    .selectCell(3, 1);
            expect(selectedSudoku.clearAllSelections()).toEqual(unselectedSudoku);
        });
    });
});

