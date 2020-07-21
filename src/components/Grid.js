import React from 'react';
import Row from './Row';

export default function Grid(props) {
    return (
      <div className="grid">
        {props.board.mapRows((row, index) => 
          <Row 
            key={index} 
            cells={row} 
            rowIndex={index}
            handleSelection={props.handleSelection}
            handleCellMouseEnter={props.handleCellMouseEnter}
            setIsSelecting={props.setIsSelecting}
          />
        )}
      </div>
    )
  }