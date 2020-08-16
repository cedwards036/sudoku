import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import '../styles/Modal.css';
import BoardState from '../core/board-state';
import { encodeBoard, decodeBoard } from '../core/sudoku-board-encoding'
import HelpButton from './HelpButton';
import CreationPuzzleFeedback from './CreationPuzzleFeedback';
import Grid from './Grid';
import EditControlBoard from './EditControlBoard';
import KeyboardShortcutTable from './KeyboardShortcutTable';

const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

Modal.setAppElement('#root')

export default function EditBoard(props) {
    const history = useHistory();
    const [boardState, setBoardState] = useState(BoardState(props.initialBoard));
    const [isSelecting, setIsSelecting] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const stopSelecting = () => setIsSelecting(false);

    function startNewCellSelection(rowIndex, colIndex) {
        setBoardState(boardState.clearAllSelections().selectCell(rowIndex, colIndex));
    }

    function addCellToSelection(rowIndex, colIndex) {
        setBoardState(boardState.selectCell(rowIndex, colIndex));
    }

    function updateSelectedValues(value) {
        setBoardState(boardState.updateSelectedValues(value));
    }

    function undo() {
        setBoardState(boardState.undo());
    }

    function redo() {
        setBoardState(boardState.redo());
    }

    function selectAll() {
        setBoardState(boardState.selectAllCells());
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
            setBoardState(boardState.selectCell(rowIndex, colIndex));
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
            }
        }
    }

    function isArrowKey(keyCode) {
        return [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW].includes(keyCode);
    }

    function handleArrowKeyDown(e, rowIndex, colIndex) {
        switch (e.keyCode) {
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
        updateSelectedValues(convertToNumber(e.keyCode));
    }

    function isBackspaceOrDelete(keyCode) {
        return keyCode === 8 || keyCode === 46;
    }

    function handleCellDeletion() {
        updateSelectedValues(0);
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

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    useEffect(() => {
        const currentEncoding = encodeBoard(boardState.currentState);
        if (props.boardEncoding !== currentEncoding) {
            history.replace(currentEncoding);
        }
    }, [history, boardState, props.boardEncoding]);

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
            <HelpButton handleClick={openModal} />
            <CreationPuzzleFeedback solutionCount={getSolutionsCount()} />
            <Grid
                board={boardState.currentState}
                handleSelection={handleSelection}
                handleCellMouseEnter={handleCellMouseEnter}
                setIsSelecting={setIsSelecting}
            />
            <EditControlBoard
                handleNumberClick={updateSelectedValues}
                handleDeleteClick={handleCellDeletion}
                handleUndoClick={undo}
                handleRedoClick={redo}
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
                <KeyboardShortcutTable />
            </Modal>
        </div>
    )
}
