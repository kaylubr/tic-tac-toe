const Cell = () => {
  let mark = '';
  const getMark = () => mark;
  const setMark = (markParameter) => mark = markParameter;
  return { getMark, setMark }
};

const Gameboard = (function() {
  const ROWS = 3;
  const COLUMNS = 3;
  const board = [];

  for (let row = 0; row < ROWS; row++) {
    board[row] = []
    for (let column = 0; column < COLUMNS; column++) {
      board[row][column] = Cell();
    }
  }

  const addMark = (row, column, mark) => {
    const isCellAvailable = board[row][column].getMark() === '';
    if(!isCellAvailable) return;
    board[row][column].setMark(mark);
  }

  const getBoard = () => board;

  const printBoard = () => {
    const boardToPrint = board.map(row => row.map(cell => cell.getMark()))
    console.log(boardToPrint);
  }

  return { addMark, getBoard, printBoard }
})();

const Player = function(name, mark) {
  const getName = () => name;
  const getMark = () => mark;
  const setName = newName => name = newName

  return { getName, getMark, setName }
}

const GameController = (function() {
  const P1 = Player('John', 'X');
  const P2 = Player('Doe', 'O');
  let winner = null;

  const board = Gameboard;

  let activePlayer = P1;

  const getActivePlayer = () => activePlayer;

  const switchActivePlayer = () => {
    activePlayer = activePlayer === P1 ? P2 : P1;
  }

  const getWinner = () => winner;
  const resetWinner = () => winner = null;

  const checkWin = (activePlayer) => {
    const WIN_PATTERNS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    const mappedBoard = board.getBoard().map(row => row.map(cell => cell.getMark())).flat();

    for (let pattern of WIN_PATTERNS) {
      const pattern1 = pattern[0];
      const pattern2 = pattern[1];
      const pattern3 = pattern[2];
      
      if (mappedBoard[pattern1] !== '' && mappedBoard[pattern1] === mappedBoard[pattern2] && mappedBoard[pattern1] === mappedBoard[pattern3]) {
        winner = getActivePlayer().getName();
        return;
      } 
    }

    if (!mappedBoard.includes('')) {
      winner = 'TIE';
      return;
    }
  }

  const playRound = (row, column) => {
    board.addMark(row, column, getActivePlayer().getMark());
    checkWin();
    if (!winner) {
      switchActivePlayer();
    }
    board.printBoard();
  }

  return { 
    playRound,
    nameSetter: { p1: P1.setName, p2: P2.setName },
    board: Gameboard.getBoard(),
    getActivePlayer,
    getWinner,
    resetWinner
  }
})();


const ScreenController = (function() {
  const game = GameController;
  const boardDiv = document.querySelector('.board');
  const dialog = document.querySelector('#startDialog');
  const startBtn = document.querySelector('#startDialog button');
  const playerTurn = document.querySelector('#playerTurn');
  const P1 = document.querySelector('#player1');
  const P2 = document.querySelector('#player2');

  dialog.showModal();

  startBtn.addEventListener('click', () => {
    if (P1.value === '' || P2.value === '') return;
    game.nameSetter.p1(P1.value);
    game.nameSetter.p2(P2.value);
    playerTurn.textContent = `Player ${game.getActivePlayer().getName()}'s turn`;
    dialog.close();
  })

  const updateScreen = () => {
    boardDiv.textContent = '';

    const board = game.board;
    
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const button = document.createElement('button');
        button.classList.add('cells');
        button.dataset.row = rowIndex;
        button.dataset.column = colIndex;
        button.textContent = cell.getMark();
        boardDiv.append(button);
      })
    });
  }

  boardDiv.addEventListener('click', e => {
    // Change content of the cell that was clicked
    const cell = e.target;
    const row = cell.dataset.row;
    const col = cell.dataset.column;
    cell.textContent = game.getActivePlayer().getMark();

    // Play the round 
    game.playRound(row, col);
    playerTurn.textContent = `Player ${game.getActivePlayer().getName()}'s turn`;

    // Renders winner or tie screen if there is any
    if (game.getWinner() && game.getWinner() !== 'TIE') {
      renderWinner('win');
      return;
    } else if (game.getWinner() === 'TIE') {
      renderWinner('tie');
      return;
    }
    
    // Reset screen
    updateScreen();
  });

  const renderWinner = (mode) => {

    // Reset board
    boardDiv.textContent = '';
    const endDialog = document.querySelector('#endDialog');
    const endHeader = document.querySelector('#winnerPlayer');
    const gif = document.querySelector('#gif');

    if (mode === 'win') {
      endHeader.textContent = `${game.getActivePlayer().getName()} won the game!`;
      gif.src = './gif/cat-celebration.gif';
      endDialog.showModal();
    } else if (mode === 'tie') {
      endHeader.textContent = "It's a tie!";
      gif.src = './gif/james-doakes.gif';
      endDialog.showModal();
    }

  }

  updateScreen();
})();
