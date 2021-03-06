import {produce, immerable} from 'immer';

export default function BoardState(initialState) {
    const history = Object.create(BoardState.prototype);
    history.currentState = initialState;
    history.past = [];
    history.future = [];
    return history;
}

BoardState.prototype = {
    [immerable]: true,

    updateCurrentState(state) {
        return produce(this, draft => {
            draft.currentState = state;
        });
    },

    addNewCurrentState(state) {
        return produce(this, draft => {
            draft.past.push(draft.currentState);
            draft.currentState = state;
            draft.future = [];
        });
    },
    
    undo() {
        return produce(this, draft => {
            if (draft.past.length > 0) {
                draft.future.push(draft.currentState);
                draft.currentState = draft.past.pop();
            }
        });
    },

    redo() {
        return produce(this, draft => {
            if (draft.future.length > 0) {
                draft.past.push(draft.currentState);
                draft.currentState = draft.future.pop();
            }
        });
    },

    clearAllSelections() {
        return this.updateCurrentState(this.currentState.clearAllSelections());
    },

    selectCell(rowIndex, colIndex) {
        return this.updateCurrentState(this.currentState.selectCell(rowIndex, colIndex));
    },

    selectAllCells() {
        return this.updateCurrentState(this.currentState.selectAllCells());
    },

    highlightCellsWithValue(value) {
        return this.updateCurrentState(this.currentState.highlightCellsWithValue(value));
    },

    unhighlightAllCells() {
        return this.updateCurrentState(this.currentState.unhighlightAllCells());
    },

    updateSelectedValues(value) {
        return this.addNewCurrentState(this.currentState.updateSelectedValues(value));
    },

    updateSelectedUserValues(value) {
        return this.addNewCurrentState(this.currentState.updateSelectedUserValues(value));
    },

    toggleSelectedCornerMarks(value) {
        return this.addNewCurrentState(this.currentState.toggleSelectedCornerMarks(value));
    },

    toggleSelectedCenterMarks(value) {
        return this.addNewCurrentState(this.currentState.toggleSelectedCenterMarks(value));
    },

    deleteFromSelectedCells() {
        return this.addNewCurrentState(this.currentState.deleteFromSelectedCells());
    },
}