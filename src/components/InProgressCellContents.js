import React from 'react';
import '../styles/InProgressCellContents.css';

export default function InProgressCellContents(props) {
    const cornerClassNames = [
        'corner-mark-ul', 
        'corner-mark-ur', 
        'corner-mark-dl',
        'corner-mark-dr',
        'corner-mark-uc',
        'corner-mark-dc',
        'corner-mark-lc',
        'corner-mark-rc',
        'corner-mark-ul', 
    ]

    function cornerMarkDivs(cornerMarks) {
        return cornerMarks.map((mark, index) => {
            return <div key={index} className={`corner-mark ${cornerClassNames[index]}`}>{mark}</div>
        });
    }

    return (
        <div className='in-progress-cell-contents'>
            <div className='center-marks'>{props.centerMarks.join('')}</div>
            {cornerMarkDivs(props.cornerMarks)}
        </div>
    )
}