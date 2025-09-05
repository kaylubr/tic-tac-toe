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

  const playRound = (row, column) => {
    board.addMark(row, column, activePlayer.getMark());
    switchActivePlayer();
    board.printBoard();
  }
  
  // Initial board 
  board.printBoard();

  return { playRound }
})();

const game = GameController;
