import React from 'react';

export default function Footer() {
    return (
        <footer>
            <small>&copy; Copyright {new Date().getFullYear()}, Christopher Edwards</small><br/>
            <small><a href="https://github.com/cedwards036/sudoku" target="_blank" rel="noopener noreferrer">Github</a></small>
        </footer>
    )
}