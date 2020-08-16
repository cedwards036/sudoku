import {produce} from 'immer';
import BoardState from '../core/board-state';

describe('BoardState', () => {
    it('initializes with an initial state', () => {
        expect(BoardState({a: 1}).currentState).toEqual({a: 1});
    });

    describe('addNewCurrentState', () => {
        it('sets the boardState\'s current state to the given value', () => {
            const boardState = BoardState({a: 1});
            expect(boardState.addNewCurrentState({b: 2}).currentState).toEqual({b: 2});
        }); 

        it('clears the boardState\'s future', () => {
            let boardState = BoardState({a: 1});
            boardState = produce(boardState, draft => {draft.future.push({c: 3})});
            boardState = boardState.addNewCurrentState({b: 2});
            expect(boardState.future.length).toEqual(0);
        }); 

        it('pushes the previous "current state" onto the boardState\'s past', () => {
            const boardState = BoardState({a: 1});
            expect(boardState.addNewCurrentState({b: 2}).past[0]).toEqual({a: 1});
        });
    });

    describe('updateCurrentState', () => {
        it('sets the boardState\'s current state to the given value', () => {
            const boardState = BoardState({a: 1});
            expect(boardState.updateCurrentState({b: 2}).currentState).toEqual({b: 2});
        }); 

        it('does not clear the boardState\'s future', () => {
            let boardState = BoardState({a: 1});
            boardState = produce(boardState, draft => {draft.future.push({c: 3})});
            boardState = boardState.updateCurrentState({b: 2});
            expect(boardState.future.length).toEqual(1);
        }); 

        it('does not push the previous "current state" onto the boardState\'s past', () => {
            const boardState = BoardState({a: 1});
            expect(boardState.updateCurrentState({b: 2}).past.length).toEqual(0);
        });
    });

    describe('undo', () => {
        it('removes the top item from the boardState\'s past', () => {
            const boardState = BoardState({a: 1}).addNewCurrentState({b: 2}).undo();
            expect(boardState.past.length).toEqual(0);
        });

        it('sets the current state to the previous top boardState item', () => {
            const boardState = BoardState({a: 1}).addNewCurrentState({b: 2}).undo();
            expect(boardState.currentState).toEqual({a: 1});
        });

        it('pushes the previous current state onto the boardState\'s future', () => {
            const boardState = BoardState({a: 1}).addNewCurrentState({b: 2}).addNewCurrentState({c: 3}).undo().undo();
            expect(boardState.future[1]).toEqual({b: 2});
        });

        it('does nothing if there is nothing in the past', () => {
            const emptyHistory = BoardState({a: 1});
            expect(emptyHistory.undo()).toEqual(emptyHistory);
        });
    });

    describe('redo', () => {
        it('removes the top item from the boardState\'s future', () => {
            const boardState = BoardState({a: 1}).addNewCurrentState({b: 2}).undo().redo();
            expect(boardState.future.length).toEqual(0);
        });

        it('sets the current state to the previous top future item', () => {
            const boardState = BoardState({a: 1}).addNewCurrentState({b: 2}).redo();
            expect(boardState.currentState).toEqual({b: 2});
        });

        it('pushes the previous current state onto the boardState\'s past', () => {
            const boardState = BoardState({a: 1}).addNewCurrentState({b: 2}).addNewCurrentState({c: 3}).undo().redo();
            expect(boardState.past[1]).toEqual({b: 2});
        });

        it('does nothing if there is nothing in the future', () => {
            const emptyHistory = BoardState({a: 1});
            expect(emptyHistory.redo()).toEqual(emptyHistory);
        });
    });
});