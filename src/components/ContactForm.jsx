// src/components/ContactForm.jsx
import React, { useState } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send to an API or email service
    console.log(form);
    // Reset form
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>Contact Me</h3>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Message:
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
      </label>
      <button type="submit">Send</button>
    </form>
  );
};

export default ContactForm;
