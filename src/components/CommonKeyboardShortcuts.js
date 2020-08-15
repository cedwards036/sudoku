import React from 'react';

export default function CommonKeyboardShortcuts() {
    return (
        <React.Fragment>
            <tr>
                <td>Enter number</td>
                <td><kbd>0</kbd> - <kbd>9</kbd></td>
            </tr>
            <tr>
                <td>Go up</td>
                <td><kbd>&uarr;</kbd></td>
            </tr>
            <tr>
                <td>Go right</td>
                <td><kbd>&rarr;</kbd></td>
            </tr>
            <tr>
                <td>Go down</td>
                <td><kbd>&darr;</kbd></td>
            </tr>
            <tr>
                <td>Go left</td>
                <td><kbd>&larr;</kbd></td>
            </tr>
            <tr>
                <td>Undo</td>
                <td><kbd>ctrl</kbd> + <kbd>z</kbd></td>
            </tr>
            <tr>
                <td>Redo</td>
                <td><kbd>ctrl</kbd> + <kbd>y</kbd></td>
            </tr>
            <tr>
                <td>Delete selected cell values</td>
                <td><kbd>delete</kbd>, <kbd>backspace</kbd></td>
            </tr>
            <tr>
                <td>Select all cells</td>
                <td><kbd>ctrl</kbd> + <kbd>a</kbd></td>
            </tr>
            <tr>
                <td>Add to selection</td>
                <td><kbd>ctrl</kbd> + <kbd>click</kbd>, <kbd>&uarr;</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, <kbd>&larr;</kbd></td>
            </tr>
        </React.Fragment>
    )
}