import SudokuBoard from '../sudoku-board';
import {encodeBoard, decodeBoard} from '../sudoku-board-encoding';

describe('encodeBoard', () => {
    it('encodes the board as a base-62 string representing the board\'s size and the board\'s cell values', () => {
        const fullBoard = SudokuBoard([
            [1, 2, 3, 4],
            [4, 0, 2, 1],
            [2, 4, 0, 3],
            [3, 0, 4, 2]
        ]);
        expect(encodeBoard(fullBoard)).toEqual('45Ewlbcysi');       
    });

    it('ignores any leading zeros in the board', () => {
        const partiallyFullBoard = SudokuBoard([
            [0, 0, 0, 0],
            [0, 0, 0, 4],
            [2, 4, 1, 3],
            [3, 1, 4, 2]
        ]);
        expect(encodeBoard(partiallyFullBoard)).toEqual('4sHCp8');       
    });

    it('represents an empty board solely by its size', () => {
        expect(encodeBoard(SudokuBoard.createEmpty(4))).toEqual('4');
    });
});

describe('decodeBoard', () => {
    it('constructs a board given a base-62 string encoding of that board', () => {
        const expected = SudokuBoard([
            [1, 2, 3, 4],
            [4, 0, 2, 1],
            [2, 4, 0, 3],
            [3, 0, 4, 2]
        ]);
        const encoding = '45Ewlbcysi';
        expect(decodeBoard(encoding)).toEqual(expected);      
    });

    it('ignores any leading zeros in the board', () => {
        const expected = SudokuBoard([
            [0, 0, 0, 0],
            [0, 0, 0, 4],
            [2, 4, 1, 3],
            [3, 1, 4, 2]
        ]);
        const encoding = '4sHCp8';
        expect(decodeBoard(encoding)).toEqual(expected);       
    });

    it('decodes a single number n into an empty board of size n', () => {
        expect(decodeBoard('4')).toEqual(SudokuBoard.createEmpty(4));
    });
});