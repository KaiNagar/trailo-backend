const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addReview,
} = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBoards)
router.get('/:id', getBoardById)
router.post('/', addBoard)
// router.post('/', requireAuth, requireAdmin, addBoard)
router.put('/:id', updateBoard)
// router.put('/:id', requireAuth, requireAdmin, updateBoard)
router.delete('/:id', removeBoard)
// router.delete('/:id', requireAuth, requireAdmin, removeBoard)

module.exports = router
