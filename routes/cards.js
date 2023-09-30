const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateUpdateCard,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.put('/:cardId/likes', validateUpdateCard, likeCard);
router.delete('/:cardId', validateUpdateCard, deleteCard);
router.delete('/:cardId/likes', validateUpdateCard, dislikeCard);

module.exports = router;
