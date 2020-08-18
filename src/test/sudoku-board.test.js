import SudokuBoard from '../core/sudoku-board';

describe('SudokuBoard', () => {
    it('can create an empty grid of the given dimension', () => {
        const sudoku = SudokuBoard.createEmpty(4);
        expect(sudoku.size).toEqual(4);
        sudoku.forEachRow(row => {
            row.forEach(cell => {
                expect(cell.value).toBe(0);
                expect(cell.userValue).toBe(0);
                expect(cell.cornerMarks).toEqual([]);
                expect(cell.centerMarks).toEqual([]);
            });
        });
        expect(sudoku.topSelectedRowIndex).toEqual(-1);
        expect(sudoku.topSelectedColIndex).toEqual(-1);
        expect(sudoku.hasSelection).toEqual(false);
    });

    describe('currentValueCounts', () => {
        it('initializes with an accurate count of each number\'s usage in the board', () => {
            const sudoku = SudokuBoard([
                [2, 1, 0, 3],
                [4, 0, 2, 1],
                [0, 2, 0, 0],
                [1, 0, 3, 2]
            ]);
            expect(sudoku.currentValueCounts.length).toBe(5);
            expect(sudoku.currentValueCounts).toEqual([6, 3, 4, 2, 1])
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

        it('updates the currently-selected cell pointers', () => {
            const sudoku = SudokuBoard.createEmpty(9).selectCell(3, 4);
            expect(sudoku.topSelectedRowIndex).toEqual(3);
            expect(sudoku.topSelectedColIndex).toEqual(4);
        });

        it('updates the hasSelection flag', () => {
            const sudoku = SudokuBoard.createEmpty(9).selectCell(3, 4);
            expect(sudoku.hasSelection).toEqual(true);
        });

        it('adds one to the selected count', () => {
            const sudoku = SudokuBoard.createEmpty(9).selectCell(3, 4);
            expect(sudoku.selectedCount).toEqual(1);
        });

        it('does nothing if the cell does not exist', () => {
            const sudoku = SudokuBoard.createEmpty(4);
            expect(sudoku).toEqual(sudoku.selectCell(13, 45));
        });
    });

    describe('selectAllCells', () => {
        it('selects every cell in the board', () => {
            const sudoku = SudokuBoard.createEmpty(4).selectAllCells();
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    expect(sudoku[i][j].isSelected).toEqual(true);
                }
            }
        });

        it('does nothing if all cells are already selected', () => {
            const sudoku = SudokuBoard.createEmpty(4).selectAllCells();
            expect(sudoku.selectAllCells()).toEqual(sudoku);
        });

        it('updates the currently-selected cell pointers to 0', () => {
            const sudoku = SudokuBoard.createEmpty(4).selectAllCells();
            expect(sudoku.topSelectedRowIndex).toEqual(0);
            expect(sudoku.topSelectedColIndex).toEqual(0);
        });

        it('updates the hasSelection flag', () => {
            const sudoku = SudokuBoard.createEmpty(4).selectAllCells();
            expect(sudoku.hasSelection).toEqual(true);
        });

        it('sets the selected count to the total number of cells in the grid', () => {
            const sudoku = SudokuBoard.createEmpty(4).selectAllCells();
            expect(sudoku.selectedCount).toEqual(16);
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

        it('sets the selected count to 0', () => {
            const sudoku = SudokuBoard.createEmpty(9).selectCell(3, 4).clearAllSelections();
            expect(sudoku.selectedCount).toEqual(0);
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

        it('increments the usage count for the updated value', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .updateSelectedValues(3);
            expect(sudoku.currentValueCounts[3]).toBe(3);
        });

        it('decrements the usage count for the previous cell value(s)', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .updateSelectedValues(3);
            expect(sudoku.currentValueCounts[0]).toBe(78);
        });
    });

    describe('updateSelectedUserValues', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.updateSelectedValues(3));
        });
        
        it('updates the user value of all selected cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .updateSelectedUserValues(3);
            expect(sudoku[0][0].userValue).toEqual(3);
            expect(sudoku[1][4].userValue).toEqual(3);
            expect(sudoku[3][1].userValue).toEqual(3);
        });
        
        it('does not update user values of cells with existing given values', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .updateSelectedValues(2)
                                        .updateSelectedUserValues(3);
            expect(sudoku[0][0].userValue).toEqual(0);
        });

        it('removes any intersecting corner marks with the same value as the newly-entered number', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(4, 1)
                                        .selectCell(1, 8)
                                        .toggleSelectedCornerMarks(7)
                                        .clearAllSelections()
                                        .selectCell(1, 1)
                                        .updateSelectedUserValues(7);
            expect(sudoku[0][0].cornerMarks.length).toEqual(0);
            expect(sudoku[4][1].cornerMarks.length).toEqual(0);
            expect(sudoku[1][8].cornerMarks.length).toEqual(0);
        });

        it('removes any intersecting center marks with the same value as the newly-entered number', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(4, 1)
                                        .selectCell(1, 8)
                                        .toggleSelectedCenterMarks(7)
                                        .clearAllSelections()
                                        .selectCell(1, 1)
                                        .updateSelectedUserValues(7);
            expect(sudoku[0][0].centerMarks.length).toEqual(0);
            expect(sudoku[4][1].centerMarks.length).toEqual(0);
            expect(sudoku[1][8].centerMarks.length).toEqual(0);
        });

        it('increments the usage count for the updated value', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .updateSelectedUserValues(3);
            expect(sudoku.currentValueCounts[3]).toBe(3);
        });

        it('decrements the usage count for the previous cell value(s)', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .updateSelectedUserValues(3);
            expect(sudoku.currentValueCounts[0]).toBe(78);
        });
    });

    describe('toggleSelectedCornerMarks', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.toggleSelectedCornerMarks(3));
        });

        it('removes the mark if the cell already has the mark', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .toggleSelectedCornerMarks(3);
            expect(sudoku.toggleSelectedCornerMarks(3)[0][0].cornerMarks).toEqual([]);
        });
        
        it('adds the new corner mark to all selected cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .toggleSelectedCornerMarks(3);
            expect(sudoku[0][0].cornerMarks).toContain(3);
            expect(sudoku[1][4].cornerMarks).toContain(3);
            expect(sudoku[3][1].cornerMarks).toContain(3);
        });

        it('keeps the corner marks in sorted order', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .toggleSelectedCornerMarks(3)
                                        .toggleSelectedCornerMarks(1)
                                        .toggleSelectedCornerMarks(9);
            expect(sudoku[0][0].cornerMarks).toEqual([1, 3, 9]);
        });
    });

    describe('toggleSelectedCenterMarks', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.toggleSelectedCenterMarks(3));
        });

        it('removes the mark if the cell already has the mark', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .toggleSelectedCenterMarks(3);
            expect(sudoku.toggleSelectedCenterMarks(3)[0][0].centerMarks).toEqual([]);
        });
        
        it('adds the new center mark to all selected cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .toggleSelectedCenterMarks(3);
            expect(sudoku[0][0].centerMarks).toContain(3);
            expect(sudoku[1][4].centerMarks).toContain(3);
            expect(sudoku[3][1].centerMarks).toContain(3);
        });

        it('keeps the center marks in sorted order', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .toggleSelectedCenterMarks(3)
                                        .toggleSelectedCenterMarks(1)
                                        .toggleSelectedCenterMarks(9);
            expect(sudoku[0][0].centerMarks).toEqual([1, 3, 9]);
        });
    });

    describe('deleteFromSelectedCells', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.deleteFromSelectedCells());
        });
        
        it('only removes user values (not pencil marks) from cells with user values', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .toggleSelectedCenterMarks(7)
                                        .toggleSelectedCornerMarks(2)
                                        .updateSelectedUserValues(3)
                                        .deleteFromSelectedCells();
            expect(sudoku[0][0].centerMarks).toContain(7);
            expect(sudoku[0][0].cornerMarks).toContain(2);
            expect(sudoku[0][0].userValue).toEqual(0);
        });

        it('removes pencil marks from cells without user values', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .toggleSelectedCenterMarks(7)
                                        .toggleSelectedCornerMarks(2)
                                        .toggleSelectedCornerMarks(3)
                                        .deleteFromSelectedCells();
            expect(sudoku[0][0].centerMarks).not.toContain(7);
            expect(sudoku[0][0].cornerMarks).not.toContain(2);
            expect(sudoku[0][0].cornerMarks).not.toContain(3);
        });

        it('decrements value counts for any deleted user values', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .toggleSelectedCenterMarks(7)
                                        .toggleSelectedCornerMarks(2)
                                        .updateSelectedUserValues(3)
                                        .deleteFromSelectedCells();
            expect(sudoku.currentValueCounts[3]).toBe(0);
            expect(sudoku.currentValueCounts[0]).toBe(81);
        });
    });

    describe('solutions', () => {
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
            expect(sudoku.solutions).toEqual([solution]);
        });
    });

    describe('getIncorrectCells', () => {
        it('returns an empty array if the board is completely solved', () => {
            const sudoku = SudokuBoard([
                [2, 1, 4, 3],
                [4, 3, 2, 1],
                [0, 2, 1, 4],
                [1, 0, 3, 2]
            ]).selectCell(2, 0).updateSelectedUserValues(3).clearAllSelections()
              .selectCell(3, 1).updateSelectedUserValues(4);
            expect(sudoku.getIncorrectCells()).toEqual({});
        });

        it('returns an empty array if the board has no solution', () => {
            const sudoku = SudokuBoard([
                [2, 1, 4, 3],
                [4, 3, 3, 1],
                [0, 2, 3, 4],
                [1, 0, 3, 2]
            ]);
            expect(sudoku.getIncorrectCells()).toEqual({});
        });

        it('returns an array of objects detailing the coordinates, expected value, and current value of incorrect cells', () => {
            const sudoku = SudokuBoard([
                [2, 1, 4, 3],
                [4, 3, 2, 1],
                [0, 2, 1, 4],
                [1, 0, 3, 0]
            ]).selectCell(2, 0).updateSelectedUserValues(2).clearAllSelections()
              .selectCell(3, 1).updateSelectedUserValues(1);
            expect(sudoku.getIncorrectCells()).toEqual({
                2: [0],
                3: [1, 3]
            });
        });
    });

    describe('highlightCellsWithValue', () => {
        it('does nothing if no cells have the given value', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.highlightCellsWithValue(1));
        });

        it('highlights all cells with a matching value', () => {
            const sudoku = SudokuBoard.createEmpty()
                                      .selectCell(0, 0)
                                      .selectCell(2, 3)
                                      .updateSelectedValues(2)
                                      .highlightCellsWithValue(2);
            expect(sudoku[0][0].isHighlighted).toBe(true);
            expect(sudoku[2][3].isHighlighted).toBe(true);
        });

        it('highlights all cells with a matching user value', () => {
            const sudoku = SudokuBoard.createEmpty()
                                      .selectCell(0, 0)
                                      .selectCell(2, 3)
                                      .updateSelectedUserValues(2)
                                      .highlightCellsWithValue(2);
            expect(sudoku[0][0].isHighlighted).toBe(true);
            expect(sudoku[2][3].isHighlighted).toBe(true);
        });

        it('highlights all cells with a matching corner mark', () => {
            const sudoku = SudokuBoard.createEmpty()
                                      .selectCell(0, 0)
                                      .selectCell(2, 3)
                                      .toggleSelectedCornerMarks(2)
                                      .highlightCellsWithValue(2);
            expect(sudoku[0][0].isHighlighted).toBe(true);
            expect(sudoku[2][3].isHighlighted).toBe(true);
        });

        it('highlights all cells with a matching center mark', () => {
            const sudoku = SudokuBoard.createEmpty()
                                      .selectCell(0, 0)
                                      .selectCell(2, 3)
                                      .toggleSelectedCenterMarks(2)
                                      .highlightCellsWithValue(2);
            expect(sudoku[0][0].isHighlighted).toBe(true);
            expect(sudoku[2][3].isHighlighted).toBe(true);
        });

        it('does not highlight cells where the matching value is present but not visible', () => {
            const sudoku = SudokuBoard.createEmpty()
                                      .selectCell(0, 0)
                                      .toggleSelectedCenterMarks(2).updateSelectedUserValues(3).clearAllSelections()
                                      .selectCell(2, 3)
                                      .toggleSelectedCornerMarks(2).updateSelectedUserValues(3).clearAllSelections()
                                      .selectCell(3, 7)
                                      .updateSelectedUserValues(2).updateSelectedValues(3).clearAllSelections()
                                      .highlightCellsWithValue(2);
            expect(sudoku[0][0].isHighlighted).toBe(false);
            expect(sudoku[2][3].isHighlighted).toBe(false);
            expect(sudoku[3][7].isHighlighted).toBe(false);
        });
    });

    describe('unhighlightAllCells', () => {
        it('does nothing if no cells are highlighted', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.unhighlightAllCells());
        });

        it('unhighlights all highlighted cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                      .selectCell(0, 0)
                                      .selectCell(2, 3)
                                      .updateSelectedValues(2)
                                      .highlightCellsWithValue(2)
                                      .unhighlightAllCells();
            expect(sudoku[0][0].isHighlighted).toBe(false);
            expect(sudoku[2][3].isHighlighted).toBe(false);
        });
    });
});

