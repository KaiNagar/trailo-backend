const dbService = require("../../services/db.service");
const logger = require("../../services/logger.service");
const ObjectId = require("mongodb").ObjectId;

async function query(filterBy) {
  try {
    // const filterCriteria = _buildFilterCriteria(filterBy);
    // const sortCriteria = _buildSortCriteria(filterBy);

    const collection = await dbService.getCollection('board')
    const boards = await collection.find().toArray()
    return boards
  } catch (err) {
    logger.error("cannot find boards", err);
    throw err;
  }

  
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    const board = await collection.findOne({ _id: ObjectId(boardId) });
    return board;
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err);
    throw err;
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    await collection.deleteOne({ _id: ObjectId(boardId) });
    return boardId;
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err);
    throw err;
  }
}

async function add(board) {
  try {
    const collection = await dbService.getCollection("board");
    const addedBoard = await collection.insertOne(board);
    return board;
  } catch (err) {
    logger.error("cannot insert board", err);
    throw err;
  }
}
async function update(board) {
  try {
    var id = ObjectId(board._id);
    delete board._id;
    const collection = await dbService.getCollection("board");
    await collection.updateOne({ _id: id }, { $set: { ...board } });
    board._id = id;
    return board;
  } catch (err) {
    logger.error(`cannot update board ${boardId}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};

function _buildFilterCriteria(
  filterBy = { txt: "", status: null, byLabel: "" }
) {
  const { txt, status, byLabel } = filterBy;
  const criteria = {};
  if (txt) criteria.name = { $regex: txt, $options: "i" };
  if (status) criteria.inStock = status === "In stock" ? true : false;
  if (byLabel) criteria.labels = { $in: byLabel };
  return criteria;
}

function _buildSortCriteria({ bySort = "" }) {
  let sort = bySort.split(" - ");
  let criteria = {};
  switch (sort[0]) {
    case "Name":
      criteria.name = sort[1] === "Increasing" ? 1 : -1;
      break;
    case "price":
      criteria.price = sort[1] === "Increasing" ? 1 : -1;
      break;
    case "Created":
      criteria.createdAt = sort[1] === "Increasing" ? 1 : -1;
      break;
  }
  return criteria;
}
