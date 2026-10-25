import express from 'express';
import { createBook, getBooks, getBookById, editBookById, deleteBookById } from './controller.js';
const router = express.Router();
router.post('/books', createBook);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.put('/books/:id', editBookById);
router.delete('/books/:id', deleteBookById);
export default router;
