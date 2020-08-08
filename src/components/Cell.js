import React from 'react';
import '../styles/Cell.css';
import InProgressCellContents from '../components/InProgressCellContents';
import {getCellClasses} from '../core/cell-classes';
import CellValueTypes from '../core/cell-value-types';

export default function Cell(props) {
    const borderClasses = getCellClasses({
      rowIndex: props.rowIndex, 
      colIndex: props.colIndex, 
      puzzleSize: props.puzzleSize
    });
  
    const selectedClass = props.cell.isSelected ? 'cell-selected' : '';
  
    const incorrectClass = props.isIncorrect && props.cell.userValue !== 0 ? 'cell-incorrect' : '';

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

    function cellContents(cellValueObj) {
      if (cellValueObj.type === CellValueTypes.value) {
        return <span className="cell-value">{valueToString(cellValueObj.value)}</span>
      } else if (cellValueObj.type === CellValueTypes.userValue) {
        return <span className="cell-user-value">{valueToString(cellValueObj.userValue)}</span>
      } else if (cellValueObj.type === CellValueTypes.inProgress) {
        return (
          <InProgressCellContents 
            cornerMarks={cellValueObj.cornerMarks}
            centerMarks={cellValueObj.centerMarks}
          />
        )
      }
    }
  
    return (
      <div 
        className={`cell ${borderClasses} ${selectedClass} ${incorrectClass}`} 
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      >
        {cellContents(props.cell.getDisplayedValues())}
      <div className={`cell-color-layer`}></div>
      </div>
    );
  }