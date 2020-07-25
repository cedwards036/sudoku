import React from 'react';

export default function ControlButton(props) {
    return (
        <button className={`control-button ${props.className}`} onClick={props.handleClick}>
            {props.children}
        </button>
    )
}