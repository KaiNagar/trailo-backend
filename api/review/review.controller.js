const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
// const socketService = require('../../services/socket.service')
const reviewService = require('./review.service')
const boardService = require('../board/board.service')

async function getReviews(req, res) {
  try {
    const reviews = await reviewService.query(req.query)
    res.send(reviews)
  } catch (err) {
    logger.error('Cannot get reviews', err)
    res.status(500).send({ err: 'Failed to get reviews' })
  }
}

async function deleteReview(req, res) {
  try {
    // const deletedCount = await reviewService.remove(req.params.id)
    await reviewService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
    // if (deletedCount === 1) {
    //   res.send({ msg: 'Deleted successfully' })
    // } else {
    //   res.status(400).send({ err: 'Cannot remove review' })
    // }
  } catch (err) {
    logger.error('Failed to delete review', err)
    res.status(500).send({ err: 'Failed to delete review' })
  }
}

async function addReview(req, res) {
  console.log('made it to backend')

  var loggedinUser = authService.validateToken(req.cookies.loginToken)

  try {
    var review = req.body
    // review.userId = loggedinUser._id
    review = await reviewService.add(review)

    // prepare the updated review for sending out
    review.board = await boardService.getById(review.boardId)
    review.board = {
      _id: review.board._id,
      name: review.board.name,
      price: review.board.price,
    }

    // Give the user credit for adding a review
    // var user = await userService.getById(review.byUserId)
    // user.score += 10

    loggedinUser = await userService.update(loggedinUser)
    review.user = loggedinUser
    review.user = {
      _id: review.userId,
      nickname: review.user.fullname,
    }

    // User info is saved also in the login-token, update it
    const loginToken = authService.getLoginToken(loggedinUser)
    res.cookie('loginToken', loginToken)

    review = {
      _id: review._id,
      content: review.content,
      board: review.board,
      user: review.user,
    }

    // socketService.broadcast({type: 'review-added', data: review, userId: review.byUserId})
    // socketService.emitToUser({type: 'review-about-you', data: review, userId: review.aboutUserId})

    // const fullUser = await userService.getById(loggedinUser._id)
    // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

    res.send(review)
  } catch (err) {
    logger.error('Failed to add review', err)
    res.status(500).send({ err: 'Failed to add review' })
  }
}

module.exports = {
  getReviews,
  deleteReview,
  addReview,
}
