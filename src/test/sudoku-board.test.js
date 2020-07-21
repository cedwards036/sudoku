import SudokuBoard from '../sudoku-board';
import SudokuCell from '../sudoku-cell';

describe('SudokuBoard', () => {
    it('can create an empty grid of the given dimension', () => {
        const sudoku = SudokuBoard.createEmpty(4);
        expect(sudoku.size).toEqual(4);
        sudoku.forEachRow(row => {
            row.forEach(cell => {
                expect(cell.value).toEqual(0);
            });
        });
        expect(sudoku.topSelectedRowIndex).toEqual(-1);
        expect(sudoku.topSelectedColIndex).toEqual(-1);
        expect(sudoku.hasSelection).toEqual(false);
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

        it('updates the currently-selected cell pointers', () => {
            const sudoku = SudokuBoard.createEmpty(9).selectCell(3, 4);
            expect(sudoku.topSelectedRowIndex).toEqual(3);
            expect(sudoku.topSelectedColIndex).toEqual(4);
        });

        it('updates the hasSelection flag', () => {
            const sudoku = SudokuBoard.createEmpty(9).selectCell(3, 4);
            expect(sudoku.hasSelection).toEqual(true);
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

        it('updates the currently-selected cell pointers to -1', () => {
            const sudoku = SudokuBoard.createEmpty(4).selectCell(3, 4).clearAllSelections();
            expect(sudoku.topSelectedRowIndex).toEqual(-1);
            expect(sudoku.topSelectedColIndex).toEqual(-1);
        });

        it('updates the hasSelection flag', () => {
            const sudoku = SudokuBoard.createEmpty(9).selectCell(3, 4).clearAllSelections();
            expect(sudoku.hasSelection).toEqual(false);
        });
    });

    describe('updateSelectedValues', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.updateSelectedValues(3));
        });
        
        it('updates the value of all selected cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .updateSelectedValues(3);
            expect(sudoku[0][0].value).toEqual(3);
            expect(sudoku[1][4].value).toEqual(3);
            expect(sudoku[3][1].value).toEqual(3);
        });
    });

    describe('getSolutions', () => {
        it('returns an array of the first 2 (or fewer) solutions to the puzzle', () => {
            const sudoku = SudokuBoard([
                [6, 0, 0, 7, 0, 8, 0, 0, 4],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 2, 0, 1, 0, 3, 0, 0],
                [7, 0, 0, 0, 0, 0, 0, 0, 6],
                [0, 0, 3, 0, 9, 0, 2, 0, 0],
                [8, 0, 0, 0, 0, 0, 0, 0, 7],
                [0, 0, 8, 0, 5, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 0, 1, 0, 9, 0, 0, 5],
            ]);
            const solution = [
                [6, 3, 5, 7, 2, 8, 9, 1, 4],
                [1, 8, 4, 9, 6, 3, 7, 5, 2],
                [9, 7, 2, 5, 1, 4, 3, 6, 8],
                [7, 1, 9, 2, 8, 5, 4, 3, 6],
                [5, 4, 3, 6, 9, 7, 2, 8, 1],
                [8, 2, 6, 3, 4, 1, 5, 9, 7],
                [2, 9, 8, 4, 5, 6, 1, 7, 3],
                [3, 5, 1, 8, 7, 2, 6, 4, 9],
                [4, 6, 7, 1, 3, 9, 8, 2, 5],
            ];
            expect(sudoku.getSolutions()).toEqual([solution]);
        });
    });
});

