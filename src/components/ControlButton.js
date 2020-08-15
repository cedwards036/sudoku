import React from 'react';

export default function ControlButton(props) {
    const highlightClass = props.highlighted ? "button-highlighted" : "";
    if (props.disabled) {
        return (
            <button className={`control-button button disabled ${highlightClass}`} id={props.id}>
                {props.children}
            </button>
        )
    } else {
        return (
            <button className={`control-button button ${highlightClass}`} onClick={props.handleClick} id={props.id}>
                {props.children}
            </button>
        )
    }
    
}