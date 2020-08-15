import React from 'react';
import '../styles/KeyboardShortcutTable.css';
import CommonKeyboardShortcuts from './CommonKeyboardShortcuts';

export default function KeyboardShortcutTable(props) {
    return (
        <div className="keyboard-shortcut-modal">
            <h2>Keyboard Shortcuts</h2>
            <table>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Shortcut</th>
                    </tr>
                </thead>
                <tbody>
                    <CommonKeyboardShortcuts/>
                    {props.children}
                </tbody>
            </table>
        </div>
    )
}