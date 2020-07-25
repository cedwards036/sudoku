import React from 'react';
import ControlButton from './ControlButton';
import SolveButton from './SolveButton';

export default function ControlBoard(props) {
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
                <ControlButton handleClick={props.handleDeleteClick}>Delete</ControlButton>
                <ControlButton handleClick={props.handleUndoClick}>Undo</ControlButton>
                <ControlButton handleClick={props.handleRedoClick}>Redo</ControlButton>
                <SolveButton solveURL={props.solveURL} solutionCount={props.solutionCount}>Solve</SolveButton>
            </div>
        </div>
    )
}