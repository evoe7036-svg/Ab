const fs = require("fs");
const { loadImage, createCanvas } = require("canvas");

/* =========================
   🔒 AUTHOR LOCK (DO NOT EDIT)
========================= */
const ORIGINAL_AUTHOR = "MR_FARHAN";
const LOCK_KEY = "TTT_v3.0_LOCK";

/* Prevent accidental modification */
if (module.exports?.config && module.exports.config?.author && module.exports.config.author !== ORIGINAL_AUTHOR) {
  throw new Error("❌ Author Lock Triggered: Unauthorized author change detected!");
}

/* =========================
   GAME STATE
========================= */
const AIMove = { current: null };

function startBoard(isX) {
  return {
    board: Array.from({ length: 3 }, () => Array(3).fill(0)),
    isX,
    gameOn: true,
    gameOver: false,
    lock: LOCK_KEY
  };
}

/* =========================
   BOARD RENDER
========================= */
async function displayBoard(data) {
  const path = `${__dirname}/cache/ttt-${Date.now()}.png`;
  const canvas = createCanvas(1200, 1200);
  const ctx = canvas.getContext("2d");

  const bg = await loadImage("https://i.postimg.cc/nhDWmj1h/background.png");
  const O = await loadImage("https://i.postimg.cc/rFP6xLXQ/O.png");
  const X = await loadImage("https://i.postimg.cc/HLbFqcJh/X.png");

  ctx.drawImage(bg, 0, 0, 1200, 1200);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const piece = data.board[i][j];
      const x = 54 + 366 * j;
      const y = 54 + 366 * i;

      if (piece === 1) ctx.drawImage(data.isX ? O : X, x, y, 360, 360);
      if (piece === 2) ctx.drawImage(data.isX ? X : O, x, y, 360, 360);
    }
  }

  fs.writeFileSync(path, canvas.toBuffer("image/png"));
  return fs.createReadStream(path);
}

/* =========================
   GAME LOGIC
========================= */
function getAvailable(data) {
  const moves = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (!data.board[i][j]) moves.push([i, j]);
  return moves;
}

function placeMove(point, player, data) {
  data.board[point[0]][point[1]] = player;
}

function checkWin(board, player) {
  for (let i = 0; i < 3; i++) {
    if (board[i].every(v => v === player)) return true;
    if (board.every(row => row[i] === player)) return true;
  }
  if ([0, 1, 2].every(i => board[i][i] === player)) return true;
  if ([0, 1, 2].every(i => board[i][2 - i] === player)) return true;
  return false;
}

/* =========================
   AI (MINIMAX)
========================= */
function solveAIMove(depth, turn, data) {
  if (checkWin(data.board, 1)) return 1;
  if (checkWin(data.board, 2)) return -1;

  const moves = getAvailable(data);
  if (!moves.length) return 0;

  let max = -Infinity;
  let min = Infinity;

  for (const move of moves) {
    placeMove(move, turn, data);
    const score = solveAIMove(depth + 1, turn === 1 ? 2 : 1, data);

    if (turn === 1) {
      if (score > max) {
        max = score;
        if (depth === 0) AIMove.current = move;
      }
    } else {
      min = Math.min(min, score);
    }

    placeMove(move, 0, data);
  }

  return turn === 1 ? max : min;
}

function movePlayer(x, y, data) {
  if (data.board[x][y] !== 0) return "This box is already taken!";
  placeMove([x, y], 2, data);
  solveAIMove(0, 1, data);
  if (AIMove.current) placeMove(AIMove.current, 1, data);
}

function checkDraw(data) {
  return getAvailable(data).length === 0 &&
    !checkWin(data.board, 1) &&
    !checkWin(data.board, 2);
}

function AIStart(data) {
  const move = [
    Math.floor(Math.random() * 3),
    Math.floor(Math.random() * 3)
  ];
  placeMove(move, 1, data);
}

/* =========================
   EXPORT MODULE
========================= */
module.exports = {
  config: {
    name: "ttt",
    version: "3.0",
    author: ORIGINAL_AUTHOR,
    role: 0,
    shortDescription: "Tic Tac Toe (vs AI or Friend)",
    longDescription: "Play Tic Tac Toe with AI or users",
    category: "game",
    guide: `{pn} x|o → Play vs AI
{pn} --mode 2 @user → Challenge user
{pn} delete → Delete game`
  },

  onStart: async function ({ message, args, event, usersData }) {
    const { threadID, senderID, mentions } = event;

    global.GoatBot.tictactoe ??= new Map();
    global.GoatBot.tictactoeMultiplayer ??= new Map();

    if (args[0] === "delete") {
      global.GoatBot.tictactoe.delete(threadID);
      global.GoatBot.tictactoeMultiplayer.delete(threadID);
      return message.reply("🗑️ Game deleted.");
    }

    if (args[0] === "--mode" && args[1] === "2") {
      const mentionID = Object.keys(mentions)[0];
      if (!mentionID || mentionID === senderID)
        return message.reply("Mention a valid user!");

      const data = {
        board: Array.from({ length: 3 }, () => Array(3).fill(0)),
        player1: senderID,
        player2: mentionID,
        currentTurn: senderID,
        gameOn: true
      };

      global.GoatBot.tictactoeMultiplayer.set(threadID, data);

      return message.reply(
        "🎮 Multiplayer game started!",
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "ttt",
            multiplayer: true,
            author: senderID
          });
        }
      );
    }

    if (global.GoatBot.tictactoe.get(threadID)?.gameOn)
      return message.reply("Game already running!");

    const isX = args[0] === "x";
    const data = startBoard(isX);

    if (!isX) AIStart(data);

    global.GoatBot.tictactoe.set(threadID, data);

    const img = await displayBoard(data);

    return message.reply(
      { body: "🎮 Game started vs AI!", attachment: img },
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "ttt",
          multiplayer: false,
          author: senderID
        });
      }
    );
  },

  onReply: async function ({ message, event, Reply, usersData }) {
    const { threadID, senderID, body } = event;

    const num = parseInt(body);
    if (isNaN(num) || num < 1 || num > 9)
      return message.reply("Choose 1-9!");

    const row = Math.floor((num - 1) / 3);
    const col = (num - 1) % 3;

    /* ================= AI MODE ================= */
    if (!Reply.multiplayer) {
      const data = global.GoatBot.tictactoe.get(threadID);
      if (!data) return;

      const res = movePlayer(row, col, data);

      if (checkWin(data.board, 2))
        global.GoatBot.tictactoe.delete(threadID);

      if (checkWin(data.board, 1))
        global.GoatBot.tictactoe.delete(threadID);

      if (checkDraw(data))
        global.GoatBot.tictactoe.delete(threadID);

      const img = await displayBoard(data);

      return message.reply({ body: res || "Your move!", attachment: img });
    }

    /* ================= MULTIPLAYER ================= */
    const data = global.GoatBot.tictactoeMultiplayer.get(threadID);
    if (!data) return;

    if (data.board[row][col] !== 0)
      return message.reply("Taken!");

    data.board[row][col] = data.currentTurn === data.player1 ? 1 : 2;

    data.currentTurn =
      data.currentTurn === data.player1 ? data.player2 : data.player1;

    const img = await displayBoard(data);

    return message.reply({ body: "Next turn!", attachment: img });
  }
};
