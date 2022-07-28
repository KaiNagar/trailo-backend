const boardService = require("./board.service.js");
const logger = require("../../services/logger.service");
const { broadcast } = require('../../services/socket.service.js')

// GET LIST
async function getBoards(req, res) {
  try {
    logger.debug("Getting Boards");
    const queryParams = req.query;
    const boards = await boardService.query(queryParams);
    res.json(boards);
  } catch (err) {
    logger.error("Failed to get boards", err);
    res.status(500).send({ err: "Failed to get boards" });
  }
}

// GET BY ID
async function getBoardById(req, res) {
  try {
    const boardId = req.params.id;
    const board = await boardService.getById(boardId);
    res.json(board);
  } catch (err) {
    logger.error("Failed to get board", err);
    res.status(500).send({ err: "Failed to get board" });
  }
}

// POST (add board)
async function addBoard(req, res) {
  try {
    const board = req.body;
    const addedBoard = await boardService.add(board);
    // broadcast({ type: 'something-changed', boardId: board._id })
    console.log(addedBoard);
    return res.json(addedBoard);
  } catch (err) {
    logger.error("Failed to add board", err);
    res.status(500).send({ err: "Failed to add board" });
  }
}

// PUT (Update board)
async function updateBoard(req, res) {
  try {
    const board = req.body;
    const updatedBoard = await boardService.update(board);
    res.json(updatedBoard);
  } catch (err) {
    logger.error("Failed to update board", err);
    res.status(500).send({ err: "Failed to update board" });
  }
}

// DELETE (Remove board)
async function removeBoard(req, res) {
  try {
    const boardId = req.params.id;
    await boardService.remove(boardId);
    res.send("Removed");
  } catch (err) {
    logger.error("Failed to remove board", err);
    res.status(500).send({ err: "Failed to remove board" });
  }
}

async function  addReview(req,res){
  console.log(req);
}

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addReview
};
