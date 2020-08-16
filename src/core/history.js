import {produce, immerable} from 'immer';

export default function History(initialState) {
    const history = Object.create(History.prototype);
    history.currentState = initialState;
    history.past = [];
    history.future = [];
    return history;
}

History.prototype = {
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

    getCurrentState() {
        return this.past[this.past.length - 1];
    }
}