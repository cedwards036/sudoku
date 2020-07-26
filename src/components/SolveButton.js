import React from 'react';

export default function SolveButton(props) {
    if (props.solutionCount === 1) {
        return (
            <a href={props.solveURL} target="_blank" rel="noopener noreferrer" className="control-button button">
                {props.children}
            </a>
        )
    } else {
        return (
            <div className="control-button button disabled">
                {props.children}
            </div>
        )
    }    
}