import React from 'react';

export default function SolveKeyboardShortcuts() {
    return (
        <React.Fragment>
            <tr>
                <td>Switch to big number entry</td>
                <td><kbd>z</kbd></td>
            </tr>
            <tr>
                <td>Switch to corner mark entry</td>
                <td><kbd>x</kbd></td>
            </tr>
            <tr>
                <td>Switch to center mark entry</td>
                <td><kbd>c</kbd></td>
            </tr>
        </React.Fragment>
    )
}