import React from 'react';

export default function ControlButton(props) {
    return (
        <button className={`control-button ${props.sizeClass}`} onClick={props.handleClick}>
            {props.children}
        </button>
    )
}