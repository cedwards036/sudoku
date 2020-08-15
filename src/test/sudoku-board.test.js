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
    });

    describe('addToSelectedCornerMarks', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.addToSelectedCornerMarks(3));
        });

        it('does nothing if the cell already has the mark', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .addToSelectedCornerMarks(3);
            expect(sudoku.addToSelectedCornerMarks(3)[0][0].cornerMarks).toEqual([3]);
        });
        
        it('adds the new corner mark to all selected cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .addToSelectedCornerMarks(3);
            expect(sudoku[0][0].cornerMarks).toContain(3);
            expect(sudoku[1][4].cornerMarks).toContain(3);
            expect(sudoku[3][1].cornerMarks).toContain(3);
        });

        it('keeps the corner marks in sorted order', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .addToSelectedCornerMarks(3)
                                        .addToSelectedCornerMarks(1)
                                        .addToSelectedCornerMarks(9);
            expect(sudoku[0][0].cornerMarks).toEqual([1, 3, 9]);
        });
    });

    describe('removeFromSelectedCornerMarks', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.removeFromSelectedCornerMarks(3));
        });

        it('does nothing if the selected cell does not contain the mark', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .addToSelectedCornerMarks(3);
            expect(sudoku.removeFromSelectedCornerMarks(6)[0][0].cornerMarks).toEqual([3]);
        });
        
        it('removes the given corner mark from all selected cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .addToSelectedCornerMarks(7)
                                        .removeFromSelectedCornerMarks(7);
            expect(sudoku[0][0].cornerMarks).not.toContain(7);
            expect(sudoku[1][4].cornerMarks).not.toContain(7);
            expect(sudoku[3][1].cornerMarks).not.toContain(7);
        });
    });

    describe('addToSelectedCenterMarks', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.addToSelectedCenterMarks(3));
        });
        
        it('does nothing if the cell already has the mark', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .addToSelectedCenterMarks(3);
            expect(sudoku.addToSelectedCenterMarks(3)[0][0].centerMarks).toEqual([3]);
        });

        it('adds the new center mark to all selected cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .addToSelectedCenterMarks(7);
            expect(sudoku[0][0].centerMarks).toContain(7);
            expect(sudoku[1][4].centerMarks).toContain(7);
            expect(sudoku[3][1].centerMarks).toContain(7);
        });

        it('keeps the center marks in sorted order', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .addToSelectedCenterMarks(7)
                                        .addToSelectedCenterMarks(6)
                                        .addToSelectedCenterMarks(5);
            expect(sudoku[0][0].centerMarks).toEqual([5, 6, 7]);
        });
    });

    describe('removeFromSelectedCenterMarks', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.removeFromSelectedCenterMarks(3));
        });

        it('does nothing if the selected cell does not contain the mark', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .addToSelectedCenterMarks(3);
            expect(sudoku.removeFromSelectedCenterMarks(6)[0][0].centerMarks).toEqual([3]);
        });
        
        it('removes the given center mark from all selected cells', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .selectCell(1, 4)
                                        .selectCell(3, 1)
                                        .addToSelectedCenterMarks(7)
                                        .removeFromSelectedCenterMarks(7);
            expect(sudoku[0][0].centerMarks).not.toContain(7);
            expect(sudoku[1][4].centerMarks).not.toContain(7);
            expect(sudoku[3][1].centerMarks).not.toContain(7);
        });
    });

    describe('deleteFromSelectedCells', () => {
        it('does nothing if no cells are selected', () => {
            const sudoku = SudokuBoard.createEmpty();
            expect(sudoku).toEqual(sudoku.deleteFromSelectedCells());
        });
        
        it('only removes user values from cells with user values', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .addToSelectedCenterMarks(7)
                                        .addToSelectedCornerMarks(2)
                                        .updateSelectedUserValues(3)
                                        .deleteFromSelectedCells();
            expect(sudoku[0][0].centerMarks).toContain(7);
            expect(sudoku[0][0].cornerMarks).toContain(2);
            expect(sudoku[0][0].userValue).toEqual(0);
        });

        it('removes pencil marks from cells without user values', () => {
            const sudoku = SudokuBoard.createEmpty()
                                        .selectCell(0, 0)
                                        .addToSelectedCenterMarks(7)
                                        .addToSelectedCornerMarks(2)
                                        .addToSelectedCornerMarks(3)
                                        .deleteFromSelectedCells();
            expect(sudoku[0][0].centerMarks).not.toContain(7);
            expect(sudoku[0][0].cornerMarks).not.toContain(2);
            expect(sudoku[0][0].cornerMarks).not.toContain(3);
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
});

