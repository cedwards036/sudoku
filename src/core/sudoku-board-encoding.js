import SudokuBoard from './sudoku-board';

const BaseDigits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const base = 62n;

export function encodeBoard(sudokuBoard) {
    const boardNum = BigInt(sudokuBoard.toValuesArray().flat().join(''));
    const encodedBoardString = encodeBigIntToBase62String(boardNum);
    return `${sudokuBoard.size}${encodedBoardString}`;
}

function encodeBigIntToBase62String(bigInt) {
    const encodedDigits = [];
    let n = bigInt;
    while (n > 0) {
        encodedDigits.push(BaseDigits[n % base]);
        n = n / base;
    }
    return encodedDigits.reverse().join('');
} 

export function decodeBoard(encodedString) {
    const encodedBoardNumString = encodedString.slice(1);
    const boardNumString = base62StringToDecimalString(encodedBoardNumString);
    const boardSize = parseInt(encodedString.slice(0, 1));
    const paddingZerosCount = boardSize ** 2 - boardNumString.length;
    const boardNumArray = buildPaddedNumArrayFromNumString(boardNumString, paddingZerosCount);
    return SudokuBoard(splitIntoNSubarrays(boardNumArray, boardSize));
}

function base62StringToDecimalString(encodedString) {
    let result = BigInt(0);
    let digitValue;
    const encodedDigits = encodedString.split('').reverse();
    encodedDigits.forEach((digit, index) => {
        digitValue = BigInt(BaseDigits.indexOf(digit));
        result += (base ** BigInt(index)) * digitValue; 
    });
    return result.toString();
}

function buildPaddedNumArrayFromNumString(numString, paddingN) {
    const numArray = numString.split('').map(n => parseInt(n));
    return padFrontWithNZeros(numArray, paddingN);
}

function padFrontWithNZeros(array, n) {
    return Array(n).fill(0).concat(array);
}

function splitIntoNSubarrays(array, n) {
    const result = Array(n).fill().map(() => Array());
    array.forEach((value, index) => {
        result[Math.floor(index / n)].push(value);
    });
    return result;
}