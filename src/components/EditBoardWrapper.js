import React from 'react';
import { useParams } from 'react-router-dom';
import { decodeBoard } from '../core/sudoku-board-encoding';
import EditBoard from './EditBoard';

export default function EditBoardWrapper() {
    const { boardEncoding } = useParams();
    try {
        if (boardEncoding[0] === '4') {
            throw new Error();
        }
        const initialBoard = decodeBoard(boardEncoding).selectCell(0, 0);
        return <EditBoard initialBoard={initialBoard} boardEncoding={boardEncoding}/>
    } catch {
        return <h2>Uh-oh. This URL doesn't look right...</h2>
    }
}