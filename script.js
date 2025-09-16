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

  return { getName, getMark }
}

const GameController = (function() {
  const P1 = Player('Kyle', 'X');
  const P2 = Player('Cece', 'O');

  const board = Gameboard;

  let activePlayer = P1;

  const switchActivePlayer = () => {
    activePlayer = activePlayer === P1 ? P2 : P1;
  }

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
        console.log(`${activePlayer.getName()} WON!!`);
        return;
      } 
    }

    if (!mappedBoard.includes('')) {
      console.log('TIE');
      return;
    }
  }

  const playRound = (row, column) => {
    board.addMark(row, column, activePlayer.getMark());
    checkWin(activePlayer);
    switchActivePlayer();
    board.printBoard();
  }
  
  // Initial board 
  board.printBoard();

  return { playRound }
})();


const ScreenController = (function() {
  const dialog = document.querySelector('#startDialog');
  const startBtn = document.querySelector('#startDialog button');
  const P1 = document.querySelector('#player1');
  const P2 = document.querySelector('#player2');

  dialog.showModal();

  startBtn.addEventListener('click', () => {
    dialog.close();
  })
})();
