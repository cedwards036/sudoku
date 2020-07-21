export function getCellClasses({rowIndex, colIndex, puzzleSize}) {
    const classes = [];
    if (rowIndex === 0) {
        classes.push('cell-thick-upper-border');
    } else if ((rowIndex + 1) % Math.sqrt(puzzleSize) === 0) {
        classes.push('cell-thick-lower-border');
    }
    if (colIndex === 0) {
        classes.push('cell-thick-left-border');
    } else if ((colIndex + 1) % Math.sqrt(puzzleSize) === 0) {
        classes.push('cell-thick-right-border');
    }
    return classes.join(' ');
}