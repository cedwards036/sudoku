import React from 'react';
import '../styles/ControlBoard.css';
import ControlButton from './ControlButton';

export default function SolveControlBoard(props) {

    function copyBoardURL() {
        const temp = document.createElement('input');
        document.body.appendChild(temp);
        temp.value = window.location.href;
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
    }

    function handleShareButtonClick() {
        copyBoardURL();
        const button = document.getElementById("shareButton");
        const originalText = button.innerText;
        const originalFontSize = window.getComputedStyle(button).getPropertyValue('font-size');
        button.innerText = "Puzzle URL Copied!"
        button.style = "font-size:1em;"
        setTimeout(() => {
            button.innerText = originalText;
            button.style = originalFontSize;
        }, 1000);
    }

    const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
        const handleClick = (e) => {props.handleNumberClick(num)};
        return <ControlButton 
                    key={num} 
                    handleClick={handleClick}
                >
                    {num}
                </ControlButton>
    });
    return (
        <div className="control-board">
            <div className="control-row">
                {numberButtons}
            </div>
            <div className="control-row">
                <ControlButton handleClick={props.handleDeleteClick} disabled={false}>Delete</ControlButton>
                <ControlButton handleClick={props.handleUndoClick} disabled={!props.canUndo}>Undo</ControlButton>
                <ControlButton handleClick={props.handleRedoClick} disabled={!props.canRedo}>Redo</ControlButton>
                <ControlButton handleClick={handleShareButtonClick} disabled={false} id="shareButton">Share</ControlButton>
            </div>
        </div>
    )
}