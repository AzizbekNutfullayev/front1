import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddBooks() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    book_id: '',
    title: '',
    author_name: '',
    genre: '',
    published_year: '',
    available: false,
    image_url: '',
  });
  const [message, setMessage] = useState('');

  // GET: Kitoblar ro'yxatini olish
  const fetchBooks = async () => {
    try {
      const res = await axios.get('https://becend-1.onrender.com/bo');
      setBooks(res.data);
    } catch (error) {
      console.error('Kitoblarni olishda xatolik:', error);
      setMessage('Kitoblarni olishda xatolik yuz berdi.');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Input o'zgarishi
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // POST: Yangi kitob qo'shish
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      ...formData,
      book_id: Number(formData.book_id),
      published_year: formData.published_year ? Number(formData.published_year) : null,
      available: Boolean(formData.available),
    };

    try {
      await axios.post('https://becend-1.onrender.com/bo/book', postData);
      setMessage('Kitob muvaffaqiyatli qo\'shildi!');
      setFormData({
        book_id: '',
        title: '',
        author_name: '',
        genre: '',
        published_year: '',
        available: false,
        image_url: '',
      });
      fetchBooks();
    } catch (error) {
      console.error('Qo\'shishda xatolik:', error);
      setMessage(error.response?.data?.message || 'Xatolik yuz berdi.');
    }
  };

  return (
    <div className="home-container">
      <h1>Kitoblar ro'yxati</h1>
      {message && <div className="message">{message}</div>}

      <form className="book-form" onSubmit={handleSubmit}>
        <h2>Yangi kitob qo'shish</h2>

        <input
          type="number"
          name="book_id"
          placeholder="Kitob ID"
          value={formData.book_id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Sarlavha"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author_name"
          placeholder="Muallif"
          value={formData.author_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Janr"
          value={formData.genre}
          onChange={handleChange}
        />
        <input
          type="number"
          name="published_year"
          placeholder="Chop etilgan yil"
          value={formData.published_year}
          onChange={handleChange}
          min="1000"
          max={new Date().getFullYear()}
        />
          <input
            type="text"
            name="image_url"
            placeholder="Rasm URL"
            value={formData.image_url}
            onChange={handleChange}
          />
        <label>
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          Mavjud
        </label>
        <button type="submit">Qo'shish</button>
      </form>

      <div className="books-list">
        {books.length === 0 ? (
          <p>Kitoblar mavjud emas.</p>
        ) : (
          books.map((book) => (
            <div key={book.book_id} className="book-card" style={{
              border: '1px solid #ddd',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '8px',
              width: '250px'
            }}>
              {book.image_url && (
                <img
                  src={book.image_url}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '10px'
                  }}
                />
              )}
              <h3>{book.title}</h3>
              <p><strong>Muallif:</strong> {book.author_name}</p>
              <p><strong>Janr:</strong> {book.genre || 'Noma\'lum'}</p>
              <p><strong>Chop yili:</strong> {book.published_year || 'Noma\'lum'}</p>
              <p><strong>Mavjud:</strong> {book.available ? 'Ha' : 'Yo‘q'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
