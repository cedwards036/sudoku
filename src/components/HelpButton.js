import React from 'react';

export default function HelpButton(props) {
    return (
        <button className="help-button" onClick={props.handleClick}>?</button>
    )
}