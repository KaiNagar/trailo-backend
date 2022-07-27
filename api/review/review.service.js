const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('review')
    // const reviews = await collection.find(criteria).toArray()
    // var reviews = await collection.find().toArray()
    var reviews = await collection
      .aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: 'user',
            foreignField: '_id',
            localField: 'userId',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'board',
            foreignField: '_id',
            localField: 'boardId',
            as: 'board',
          },
        },
        {
          $unwind: '$board',
        },
        {
          $project: {
            _id: 1,
            content: 1,
            rate: 1,
            user: { _id: 1, fullname: 1 },
            board: { _id: 1, name: 1, price: 1 },
          },
        },
      ])
      .toArray()
    return reviews
  } catch (err) {
    logger.error('cannot find reviews', err)
    throw err
  }
}

async function remove(reviewId) {
  try {
    // const store = asyncLocalStorage.getStore()
    // const { loggedinUser } = store
    const collection = await dbService.getCollection('review')
    // remove only if user is owner/admin
    const criteria = { _id: ObjectId(reviewId) }
    // if (!loggedinUser.isAdmin) criteria.userId = ObjectId(loggedinUser._id)
    // const { deletedCount } = await collection.deleteOne(criteria)
    await collection.deleteOne(criteria)
    // return deletedCount
  } catch (err) {
    logger.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}

async function add(review) {
  try {
    const reviewToAdd = {
      userId: ObjectId(review.userId),
      boardId: ObjectId(review.boardId),
      content: review.content,
      rate: review.rate,
    }
    const collection = await dbService.getCollection('review')
    await collection.insertOne(reviewToAdd)
    return reviewToAdd
  } catch (err) {
    logger.error('cannot insert review', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.userId) criteria.userId = ObjectId(filterBy.userId)
  else if (filterBy.boardId) criteria.boardId = ObjectId(filterBy.boardId)
  return criteria
}

module.exports = {
  query,
  remove,
  add,
}
