import {produce} from 'immer';
import History from './history';

describe('History', () => {
    it('initializes with an initial state', () => {
        expect(History({a: 1}).currentState).toEqual({a: 1});
    });

    describe('setCurrentState', () => {
        it('sets the history\'s current state to the given value', () => {
            const history = History({a: 1});
            expect(history.setCurrentState({b: 2}).currentState).toEqual({b: 2});
        }); 

        it('clears the history\'s future', () => {
            let history = History({a: 1});
            history = produce(history, draft => {draft.future.push({c: 3})});
            history = history.setCurrentState({b: 2});
            expect(history.future.length).toEqual(0);
        }); 

        it('pushes the previous "current state" onto the history\'s past', () => {
            const history = History({a: 1});
            expect(history.setCurrentState({b: 2}).past[0]).toEqual({a: 1});
        });
    });

    describe('undo', () => {
        it('removes the top item from the history\'s past', () => {
            const history = History({a: 1}).setCurrentState({b: 2}).undo();
            expect(history.past.length).toEqual(0);
        });

        it('sets the current state to the previous top history item', () => {
            const history = History({a: 1}).setCurrentState({b: 2}).undo();
            expect(history.currentState).toEqual({a: 1});
        });

        it('pushes the previous current state onto the history\'s future', () => {
            const history = History({a: 1}).setCurrentState({b: 2}).setCurrentState({c: 3}).undo().undo();
            expect(history.future[1]).toEqual({b: 2});
        });

        it('does nothing if there is nothing in the past', () => {
            const emptyHistory = History({a: 1});
            expect(emptyHistory.undo()).toEqual(emptyHistory);
        });
    });

    describe('redo', () => {
        it('removes the top item from the history\'s future', () => {
            const history = History({a: 1}).setCurrentState({b: 2}).undo().redo();
            expect(history.future.length).toEqual(0);
        });

        it('sets the current state to the previous top future item', () => {
            const history = History({a: 1}).setCurrentState({b: 2}).redo();
            expect(history.currentState).toEqual({b: 2});
        });

        it('pushes the previous current state onto the history\'s past', () => {
            const history = History({a: 1}).setCurrentState({b: 2}).setCurrentState({c: 3}).undo().redo();
            expect(history.past[1]).toEqual({b: 2});
        });

        it('does nothing if there is nothing in the future', () => {
            const emptyHistory = History({a: 1});
            expect(emptyHistory.redo()).toEqual(emptyHistory);
        });
    });
});