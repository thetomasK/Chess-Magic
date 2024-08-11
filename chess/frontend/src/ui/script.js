document.addEventListener("DOMContentLoaded", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // Example FEN string

    function parseFEN(fen) {
        const [position] = fen.split(' ');
        const ranks = position.split('/');
        const board = [];

        ranks.forEach((rank) => {
            const row = [];
            for (const char of rank) {
                if (isNaN(char)) {
                    row.push(char);
                } else {
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
    const rows = document.querySelectorAll(".chess-board tr");

    for (let i = 1; i <= 8; i++) {
        const cells = rows[i].querySelectorAll("td");
        for (let j = 0; j < 8; j++) {
            const cell = cells[j];
            const piece = board[i - 1][j];

            cell.innerHTML = piece ? getPieceHTML(piece) : "";

            if (piece) {
                cell.querySelector(".piece").setAttribute("draggable", true);
            }
        }
    }

    addDragAndDropListeners();
}

function getPieceHTML(piece) {
    const pieceMap = {
        'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
        'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
    };

    return `<span class="piece">${pieceMap[piece]}</span>`;
}

function addDragAndDropListeners() {
    const pieces = document.querySelectorAll(".piece");
    const cells = document.querySelectorAll("td");

    pieces.forEach(piece => {
        piece.addEventListener("dragstart", handleDragStart);
    });

    cells.forEach(cell => {
        cell.addEventListener("dragover", handleDragOver);
        cell.addEventListener("drop", handleDrop);
    });
}

function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.parentElement.dataset.position);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const startPos = event.dataTransfer.getData("text/plain");
    const endPos = event.target.closest("td").dataset.position;

    movePiece(startPos, endPos);
}

function movePiece(startPos, endPos) {
    const startCell = document.querySelector(`[data-position='${startPos}']`);
    const endCell = document.querySelector(`[data-position='${endPos}']`);

    const piece = startCell.querySelector(".piece");

    if (piece) {
        endCell.innerHTML = "";
        endCell.appendChild(piece);
    }
}