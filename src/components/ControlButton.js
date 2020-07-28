import React from 'react';

export default function ControlButton(props) {
    if (props.disabled) {
        return (
            <button className={`control-button button disabled`}>
                {props.children}
            </button>
        )
    } else {
        return (
            <button className={`control-button button`} onClick={props.handleClick}>
                {props.children}
            </button>
        )
    }
    
}