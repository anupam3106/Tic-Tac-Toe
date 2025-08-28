const cells = document.querySelectorAll(".cell");
const turnPlayerEl = document.getElementById("turnPlayer");
const resetBtn = document.getElementById("resetBtn");
const modeToggle = document.getElementById("modeToggle"); // 🔹 CPU/Player toggle button

// 🎵 Sound effects
const clickSound = new Audio("sound/click.wav");
const winSound = new Audio("sound/win.wav");

let state = {
  board: Array(9).fill(null),
  current: "X",
  gameOver: false,
  cpuMode: false, // 🔹 CPU mode OFF by default
};

// 🔹 Save game state
function save() {
  localStorage.setItem("ticTacToe", JSON.stringify(state));
}

// 🔹 Load game state
function load() {
  const data = localStorage.getItem("ticTacToe");
  return data ? JSON.parse(data) : state;
}

// 🔹 Render UI
function render() {
  cells.forEach((cell, i) => {
    const v = state.board[i];
    cell.textContent = v || "";
    cell.disabled = !!(v || state.gameOver);
    cell.classList.remove("win-cell");
  });

  turnPlayerEl.textContent = state.current;
  save();
}

// 🔹 Check Winner
function checkWin() {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let line of wins) {
    const [a, b, c] = line;
    if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
      line.forEach(i => cells[i].classList.add("win-cell"));
      return state.board[a];
    }
  }
  if (state.board.every(cell => cell)) return "draw";
  return null;
}

// 🔹 CPU Move
function cpuMove() {
  if (state.gameOver) return;

  const emptyCells = state.board.map((v, i) => (v ? null : i)).filter(v => v !== null);
  if (emptyCells.length === 0) return;

  const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  state.board[choice] = state.current;
  clickSound.play();

  const result = checkWin();
  if (result) {
    state.gameOver = true;
    winSound.play();
    setTimeout(() => {
      alert(result === "draw" ? "It's a draw!" : `${result} wins!`);
    }, 200);
  } else {
    state.current = state.current === "X" ? "O" : "X";
  }

  render();
}

// 🔹 Cell Click Event
cells.forEach((cell, i) => {
  cell.addEventListener("click", () => {
    if (state.board[i] || state.gameOver) return;

    state.board[i] = state.current;
    clickSound.play();

    const result = checkWin();
    if (result) {
      state.gameOver = true;
      winSound.play();
      setTimeout(() => {
        alert(result === "draw" ? "It's a draw!" : `${result} wins!`);
      }, 200);
    } else {
      state.current = state.current === "X" ? "O" : "X";
    }

    render();

    // 🔹 If CPU mode is ON and it's CPU's turn
    if (!state.gameOver && state.cpuMode && state.current === "O") {
      setTimeout(cpuMove, 500); // CPU move after delay
    }
  });
});

// 🔹 Reset Game
resetBtn.addEventListener("click", () => {
  state = { board: Array(9).fill(null), current: "X", gameOver: false, cpuMode: state.cpuMode };
  render();
});

// 🔹 Toggle CPU Mode
modeToggle.addEventListener("click", () => {
  state.cpuMode = !state.cpuMode;
  modeToggle.textContent = state.cpuMode ? "CPU Mode: ON" : "CPU Mode: OFF";
  resetBtn.click(); // reset game when mode changes
});

// 🔹 Initialize
state = load();
render();
