import React from 'react';
import ControlButton from './ControlButton';

export default function ControlBoard(props) {
    const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
        const handleClick = (e) => {props.handleNumberClick(num)};
        return <ControlButton 
                    key={num} 
                    handleClick={handleClick}
                    sizeClass="one-square"
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
                <ControlButton handleClick={props.handleDeleteClick} sizeClass="three-squares">Delete</ControlButton>
                <ControlButton handleClick={props.handleUndoClick} sizeClass="three-squares">Undo</ControlButton>
                <ControlButton handleClick={props.handleRedoClick} sizeClass="three-squares">Redo</ControlButton>
            </div>
        </div>
    )
}