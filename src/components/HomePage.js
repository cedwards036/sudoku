import React from 'react';
import {Link} from "react-router-dom";

export default function HomePage() {
    return (
        <div className="home-page">
            <div className="explanation">
                <Link to="/enter-puzzle" className="control-button">Enter a puzzle</Link>
                <h2>What is Sudoku?</h2>
                <p>
                    <q cite="https://en.wikipedia.org/wiki/Sudoku">
                        Sudoku is a logic-based, combinatorial number-placement puzzle. 
                        In classic sudoku, the objective is to fill a 9×9 grid with digits 
                        so that each column, each row, and each of the nine 3×3 subgrids 
                        that compose the grid (also called "boxes", "blocks", or "regions") 
                        contain all of the digits from 1 to 9. The puzzle setter provides 
                        a partially completed grid, which for a well-posed puzzle has a 
                        single solution.
                    </q>&mdash;<a href="https://en.wikipedia.org/wiki/Sudoku" target="_blank" rel="noopener noreferrer">Wikipedia</a>
                </p>
                <p>
                    There are a large number of resources available online that teach 
                    the basics of Sudoku (e.g. <a href="https://sudoku.com/how-to-play/sudoku-rules-for-complete-beginners/" target="_blank" rel="noopener noreferrer">this one</a>).
                    However, my favorite Sudoku resource is the <a href="https://www.youtube.com/c/CrackingTheCryptic/" target="_blank" rel="noopener noreferrer">Cracking the Cryptic</a> YouTube channel.
                    Hosted by UK puzzle champions Mark Goodliffe and Simon Anthony, this channel 
                    features over 1,000 videos that demonstrate how expert solvers
                    approach puzzles*. Watching Mark and Simon elucidate their thought 
                    process as they solve puzzles in real time has taught me more about
                    solving Sudoku puzzles than all other resources combined.
                </p>
                <h2>How does this app work?</h2>
                <p>
                    Click the button above to enter a puzzle into the app for solving.
                    This can be a puzzle you saw in a newspaper, puzzle book, or one that
                    you have set yourself and want to send to other people. 
                </p>
                <p>
                    Once you have entered your puzzle, click the "Solve" button to 
                    go to its Solve page. In keeping with Cracking the Cryptic's recommendations,
                    this app allows for both corner pencil marks for box candidates 
                    (Snyder notation) and center pencil marks for cell candidates. Other 
                    features, such as automatic number highlighting and error indication,
                    are optional and can be toggled on or off in the settings.
                </p>
                <p>
                    Because this app encodes puzzles as URLs, you can share a puzzle 
                    simply by copying the solve link and sending it to your friends. 
                    Just click the "Share" button to automatically copy the link to 
                    your clipboard, or manually copy the URL in your browser's address
                    bar.
                </p>
                <p className="footnote">
                    *Cracking the Cryptic actually covers a wide range of puzzles,
                    including many Sudoku variants and some non-Sudoku puzzles. This
                    app, for the time being, is only concerned with "Classic" Sudoku.
                </p>
            </div>
        </div>
    )
}