const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (typeof name !== 'string') {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
      .code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
      .code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

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

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
      .code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  })
    .code(500);
};

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  let filteredBooks = books;

  console.log(name);

  if (reading === '1') {
    filteredBooks = filteredBooks.filter((book) => book.reading === true);
  }

  if (reading === '0') {
    filteredBooks = filteredBooks.filter((book) => book.reading === false);
  }

  if (finished === '1') {
    filteredBooks = filteredBooks.filter((book) => book.finished === true);
  }

  if (finished === '0') {
    filteredBooks = filteredBooks.filter((book) => book.finished === false);
  }

  if (name !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase()
      .includes(name.toLowerCase()));
  }

  const mappedBooks = filteredBooks.map((book) => Object({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: mappedBooks,
    },
  });
};

const getBookByIdhandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    });
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
    .code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (typeof name !== 'string') {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    })
      .code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    })
      .code(400);
  }

  const index = books.findIndex((b) => b.id === bookId);

  const updatedAt = new Date().toISOString();

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdhandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
