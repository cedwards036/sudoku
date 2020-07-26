import React from 'react';

export default function ControlButton(props) {
    return (
        <button className={`control-button button`} onClick={props.handleClick}>
            {props.children}
        </button>
    )
}