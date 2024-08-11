document.addEventListener("DOMContentLoaded", () => {
    // Example FEN string representing the initial chess position
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    // Parse the FEN string to generate the board representation
    function parseFEN(fen) {
        // Split the FEN string by space and take the first part which contains the board position
        const [position] = fen.split(' ');
        // Split the board position into ranks (rows)
        const ranks = position.split('/');
        const board = [];

        // Process each rank to build the board array
        ranks.forEach((rank) => {
            const row = [];
            for (const char of rank) {
                if (isNaN(char)) {
                    // If the character is a piece, add it to the row
                    row.push(char);
                } else {
                    // If the character is a number, add nulls to represent empty squares
                    for (let i = 0; i < parseInt(char); i++) {
                        row.push(null);
                    }
                }
            }
            board.push(row);
        });

        return board;
    }

    const board = parseFEN(fen);
    renderBoard(board);
});

function renderBoard(board) {
    // Select all table rows of the chessboard
    const rows = document.querySelectorAll(".chess-board tr");

    for (let i = 1; i <= 8; i++) {
        // For each row, get all cells (td elements)
        const cells = rows[i].querySelectorAll("td");
        for (let j = 0; j < 8; j++) {
            const cell = cells[j];
            const piece = board[i - 1][j];

            // Set the cell content based on the piece
            cell.innerHTML = piece ? getPieceHTML(piece) : "";

            if (piece) {
                // Set draggable attribute and position data for pieces
                cell.querySelector(".piece").setAttribute("draggable", true);
                cell.querySelector(".piece").dataset.position = `${String.fromCharCode(97 + j)}${8 - (i - 1)}`;
            }
        }
    }

    // Add drag and drop event listeners to pieces and cells
    addDragAndDropListeners();
}

function getPieceHTML(piece) {
    // Map piece characters to Unicode chess symbols
    const pieceMap = {
        'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
        'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
    };

    // Return HTML for the piece
    return `<span class="piece">${pieceMap[piece]}</span>`;
}

function addDragAndDropListeners() {
    // Select all piece elements and table cells
    const pieces = document.querySelectorAll(".piece");
    const cells = document.querySelectorAll("td");

    // Add drag start event listener to pieces
    pieces.forEach(piece => {
        piece.addEventListener("dragstart", handleDragStart);
    });

    // Add drag over and drop event listeners to cells
    cells.forEach(cell => {
        cell.addEventListener("dragover", handleDragOver);
        cell.addEventListener("drop", handleDrop);
    });
}

function handleDragStart(event) {
    // Store the initial position and piece data in the drag event
    event.dataTransfer.setData("text/plain", event.target.dataset.position);
    event.dataTransfer.setData("piece", event.target.textContent);
}

function handleDragOver(event) {
    // Allow dropping by preventing the default behavior
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    // Retrieve the start and end positions and the piece data from the drag event
    const startPos = event.dataTransfer.getData("text/plain");
    const piece = event.dataTransfer.getData("piece");
    const endPos = event.target.closest("td").dataset.position;

    // Validate the move and update the board if it's legal
    if (isMoveLegal(startPos, endPos, piece)) {
        movePiece(startPos, endPos);
    } else {
        alert("Illegal move!");
    }
}

function isMoveLegal(startPos, endPos, piece) {
    // Basic validation for legality (this needs to be expanded for complete chess rules)

    // Get start and end positions
    const [startCol, startRow] = [startPos[0], parseInt(startPos[1])];
    const [endCol, endRow] = [endPos[0], parseInt(endPos[1])];

    const colDiff = endCol.charCodeAt(0) - startCol.charCodeAt(0);
    const rowDiff = endRow - startRow;

    switch (piece) {
        case '♙': // White Pawn
            return (rowDiff === 1 && colDiff === 0) || (rowDiff === 1 && Math.abs(colDiff) === 1);
        case '♟': // Black Pawn
            return (rowDiff === -1 && colDiff === 0) || (rowDiff === -1 && Math.abs(colDiff) === 1);
        case '♖': // Rook
            return rowDiff === 0 || colDiff === 0;
        case '♗': // Bishop
            return Math.abs(rowDiff) === Math.abs(colDiff);
        case '♕': // Queen
            return rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);
        case '♔': // King
            return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
        case '♘': // Knight
            return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
        default:
            return false;
    }
}

function movePiece(startPos, endPos) {
    // Select start and end cells based on their positions
    const startCell = document.querySelector(`[data-position='${startPos}']`);
    const endCell = document.querySelector(`[data-position='${endPos}']`);

    // Move the piece from the start cell to the end cell
    const piece = startCell.querySelector(".piece");

    if (piece) {
        endCell.innerHTML = "";
        endCell.appendChild(piece);
        startCell.innerHTML = "";
    }
}
