import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(form);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted rounded-sm p-6 max-w-lg mx-auto"
    >
      <h3 className="text-2xl font-bold text-primary dark:text-primary-dark mb-6 border-l-4 border-primary dark:border-primary-dark pl-4">Contact Me</h3>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-muted dark:text-muted-dark text-sm mb-2">
          Name
        </label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-bg dark:bg-bg-dark text-text dark:text-text-dark border border-borderMuted dark:border-borderMuted rounded-sm focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-muted dark:text-muted-dark text-sm mb-2">
          Email
        </label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-bg dark:bg-bg-dark text-text dark:text-text-dark border border-borderMuted dark:border-borderMuted rounded-sm focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="message" className="block text-muted dark:text-muted-dark text-sm mb-2">
          Message
        </label>
        <motion.textarea
          whileFocus={{ scale: 1.01 }}
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 bg-bg dark:bg-bg-dark text-text dark:text-text-dark border border-borderMuted dark:border-borderMuted rounded-sm focus:outline-none focus:border-primary dark:focus:border-primary transition-colors resize-none"
        />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-3 bg-gradient-primary dark:bg-gradient-primary-dark text-white dark:text-bg-dark text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
      >
        Send
      </motion.button>
    </motion.form>
  );
};

export default ContactForm;
