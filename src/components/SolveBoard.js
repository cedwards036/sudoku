import React, {useState, useEffect} from 'react';
import {useImmer} from 'use-immer';
import { useParams, useHistory} from 'react-router-dom';
import Modal from 'react-modal';
import '../styles/Modal.css';
import BoardState from '../core/board-state';
import {encodeBoard, decodeBoard} from '../core/sudoku-board-encoding'
import HelpButton from './HelpButton';
import SolvePuzzleFeedback from './SolvePuzzleFeedback';
import Grid from './Grid';
import SolveControlBoard from './SolveControlBoard';
import KeyboardShortcutTable from './KeyboardShortcutTable';
import SolveKeyboardShortcuts from './SolveKeyboardShortcuts';

const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

Modal.setAppElement('#root')

export default function EditBoard() {
  const {boardEncoding} = useParams();
  const history = useHistory();
  const [boardState, updateBoardState] = useImmer(BoardState(decodeBoard(boardEncoding).selectCell(0, 0)));
  const [isSelecting, setIsSelecting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [enterMode, setEnterMode] = useState('userValue');
  const stopSelecting = () => setIsSelecting(false);

  function startNewCellSelection(rowIndex, colIndex) {
    updateBoardState(draft => {
      const selectedValue = valueToHighlight(draft.currentState[rowIndex][colIndex]);
      draft.currentState = boardState.currentState.clearAllSelections()
                                             .unhighlightAllCells()
                                             .selectCell(rowIndex, colIndex)
      if (selectedValue !== 0) {
        draft.currentState = draft.currentState.highlightCellsWithValue(selectedValue);
      }
    });
  }

  function valueToHighlight(cell) {
    if (cell.value !== 0) {
      return cell.value;
    } else {
      return cell.userValue;
    }
  }

  function addCellToSelection(rowIndex, colIndex) {
    updateBoardState(draft => {
      draft.currentState = boardState.currentState.selectCell(rowIndex, colIndex)
                                             .unhighlightAllCells();
    });
  }

  function updateCellContents(value) {
    if (enterMode === 'userValue') {
      updateSelectedUserValues(value);
    } else if (enterMode === 'cornerMark') {
      updateSelectedCornerMarks(value);
    } else if (enterMode === 'centerMark') {
      updateSelectedCenterMarks(value);
    }
  }

  function switchToUserValues() {
    setEnterMode('userValue');
  }

  function updateSelectedUserValues(value) {
    updateBoardState(draft => {
      draft = draft.setCurrentState(draft.currentState.updateSelectedUserValues(value));
      if (draft.currentState.selectedCount === 1 && draft.currentState.userValueSuccessfullyWritten) {
        draft.currentState = draft.currentState.unhighlightAllCells().highlightCellsWithValue(value);
      }
      return draft;
    });
  }

  function switchToCornerMarks() {
    setEnterMode('cornerMark');
  }

  function updateSelectedCornerMarks(value) {
    updateBoardState(draft => {
      return draft.setCurrentState(draft.currentState.toggleSelectedCornerMarks(value));
    });
  }

  function switchToCenterMarks() {
    setEnterMode('centerMark');
  }

  function updateSelectedCenterMarks(value) {
    updateBoardState(draft => {
      return draft.setCurrentState(draft.currentState.toggleSelectedCenterMarks(value));
    });
  }  

  function deleteFromSelectedCells() {
    updateBoardState(draft => {
      return draft.setCurrentState(boardState.currentState.deleteFromSelectedCells().unhighlightAllCells());
    });
  }

  function undo() {
    updateBoardState(draft => draft.undo());
  }

  function redo() {
    updateBoardState(draft => draft.redo());
  }

  function selectAll() {
    updateBoardState(draft => {
      draft.currentState = draft.currentState.selectAllCells();
    });
  }

  function handleSelection(rowIndex, colIndex, e) {
    if (e.ctrlKey) {
      addCellToSelection(rowIndex, colIndex);
    } else {
      startNewCellSelection(rowIndex, colIndex);
    }
  }

  function handleCellMouseEnter(rowIndex, colIndex) {
    if (isSelecting && !boardState.currentState[rowIndex][colIndex].isSelected) {
      addCellToSelection(rowIndex, colIndex);
    }
  }
  
  function handleKeyDown(e) {
    if (boardState.currentState.hasSelection && !modalIsOpen) {
      const rowIndex = boardState.currentState.topSelectedRowIndex;
      const colIndex = boardState.currentState.topSelectedColIndex;
      if (isArrowKey(e.keyCode)) {
        handleArrowKeyDown(e, rowIndex, colIndex);
      } else if (isNumberKey(e.keyCode)) {
        handleNumberKeyDown(e);
      } else if (isBackspaceOrDelete(e.keyCode)) {
        handleCellDeletion();
      } else if (isUndoCommand(e)) {
        undo();
      } else if (isRedoCommand(e)) {
        redo();
      } else if (isSelectAllCommand(e)) {
        e.preventDefault();
        selectAll();
      } else if (isSwitchToUserValuesCommand(e)) {
        switchToUserValues();
      } else if (isSwitchToCornerMarksCommand(e)) {
        switchToCornerMarks();
      } else if (isSwitchToCenterMarksCommand(e)) {
        switchToCenterMarks();
      }
    }
  }

  function isArrowKey(keyCode) {
    return [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW].includes(keyCode);
  }

  function handleArrowKeyDown(e, rowIndex, colIndex) {
    switch(e.keyCode) {
      case LEFT_ARROW:
        handleSelection(rowIndex, decrementWithWraparound(colIndex), e);
        break;
      case UP_ARROW:
        handleSelection(decrementWithWraparound(rowIndex), colIndex, e);
        break;
      case RIGHT_ARROW:
        handleSelection(rowIndex, incrementWithWraparound(colIndex), e);
        break;
      case DOWN_ARROW:
        handleSelection(incrementWithWraparound(rowIndex), colIndex, e);
        break;
      default:
        break;
    }
  }

  function incrementWithWraparound(index) {
    return (index + boardState.currentState.size + 1) % boardState.currentState.size;
  }

  function decrementWithWraparound(index) {
    return (index + boardState.currentState.size - 1) % boardState.currentState.size;
  }

  function isNumberKey(keyCode) {
    return (keyCode >= 49 && keyCode <= 57) || (keyCode >= 97 && keyCode <= 105);
  }

  function convertToNumber(keyCode) {
    if (keyCode >= 49 && keyCode <= 57) {
      return keyCode - 48;
    } else {
      return keyCode - 96;
    }
  }

  function handleNumberKeyDown(e) {
    updateCellContents(convertToNumber(e.keyCode));
  }

  function isBackspaceOrDelete(keyCode) {
    return keyCode === 8 || keyCode === 46;
  }

  function handleCellDeletion() {
    deleteFromSelectedCells();
  }

  function isUndoCommand(e) {
    return e.keyCode === 90 && e.ctrlKey;
  }

  function isRedoCommand(e) {
    return e.keyCode === 89 && e.ctrlKey;
  }

  function isSelectAllCommand(e) {
    return e.keyCode === 65 && e.ctrlKey;
  }

  function isSwitchToUserValuesCommand(e) {
    return e.keyCode === 90 && !e.ctrlKey;
  }

  function isSwitchToCornerMarksCommand(e) {
    return e.keyCode === 88 && !e.ctrlKey;
  }

  function isSwitchToCenterMarksCommand(e) {
    return e.keyCode === 67 && !e.ctrlKey;
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  useEffect(() => {
    const currentEncoding = encodeBoard(boardState.currentState);
    if (boardEncoding !== currentEncoding) {
      history.replace(currentEncoding);
    }
  }, [history, boardState, boardEncoding]);

  useEffect(() => {
    if (window) {
      window.addEventListener('mouseup', stopSelecting);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('mouseup', stopSelecting);
      window.removeEventListener('keydown', handleKeyDown);
    }
  });

  function getSolutionsCount() {
    return boardState.currentState.solutions.length;
  }

  return (
    <div className="board">
      <HelpButton handleClick={openModal}/>
      <SolvePuzzleFeedback 
        solutionCount={boardState.currentState.solutions.length}
        incorrectCells={boardState.currentState.getIncorrectCells()}
      />
      <Grid 
        board={boardState.currentState}
        handleSelection={handleSelection}
        handleCellMouseEnter={handleCellMouseEnter}
        setIsSelecting={setIsSelecting}
        incorrectCells={boardState.currentState.getIncorrectCells()}
      />
      <SolveControlBoard 
        handleNumberClick={updateCellContents}
        handleDeleteClick={handleCellDeletion}
        handleUndoClick={undo}
        handleRedoClick={redo}
        enterMode={enterMode}
        handleNormalClick={switchToUserValues}
        handleCornerClick={switchToCornerMarks}
        handleCenterClick={switchToCenterMarks}
        solveURL={`/solve/${encodeBoard(boardState.currentState)}`}
        canUndo={boardState.past.length > 0}
        canRedo={boardState.future.length > 0}
        solutionCount={getSolutionsCount()}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Keyboard Shortcuts"
        className="modal"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <KeyboardShortcutTable>
          <SolveKeyboardShortcuts/>
        </KeyboardShortcutTable> 
      </Modal>
    </div>
  )
}
