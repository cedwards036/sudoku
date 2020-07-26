import React from 'react';
import '../styles/Cell.css';
import {getCellClasses} from '../core/cell-classes';

export default function Cell(props) {
    const borderClasses = getCellClasses({
      rowIndex: props.rowIndex, 
      colIndex: props.colIndex, 
      puzzleSize: props.puzzleSize
    });
  
    const selectedClass = props.cell.isSelected ? 'cell-selected' : '';
  
    function handleMouseDown(e) {
      props.handleSelection(props.rowIndex, props.colIndex, e);
      props.setIsSelecting(true);
    }
  
    function handleMouseEnter() {
      props.handleCellMouseEnter(props.rowIndex, props.colIndex);
    }
  
    function valueToString(value) {
      if (value === 0) {
        return '';
      } else {
        return value;
      }
    }
  
    return (
      <div 
        className={`cell ${borderClasses} ${selectedClass}`} 
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      >
        <span className="cell-value">{valueToString(props.cell.value)}</span>
      </div>
    );
  }