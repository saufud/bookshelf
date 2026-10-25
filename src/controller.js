import { nanoid } from 'nanoid';
import books from '../src/books.js';
export const createBook = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    });
  }

  return res.status(500).json({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
};
export const getBooks = (req, res) => {
  const { name, reading, finished } = req.query;
  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  return res.json({
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
      })),
    },
  });
};
export const getBookById = (req, res) => {
  const { id } = req.params;
  const book = books.find((n) => n.id === id);
  if (book) {
    return res.json({
      status: 'success',
      data: { book },
    });
  }
  return res.status(404).json({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
};
export const editBookById = (req, res) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }
  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }
  const index = books.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  if (index !== -1) {
    books[index] = {
      ...books[index],
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    return res.json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
};
export const deleteBookById = (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((n) => n.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    return res.json({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
};
