import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { PortfolioConfig } from '../config/portfolio';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

const socialLinks: SocialLink[] = [
  { label: 'GitHub', url: `https://github.com/${PortfolioConfig.social.github}`, icon: 'GH' },
  { label: 'LinkedIn', url: `https://linkedin.com/in/${PortfolioConfig.social.linkedin}`, icon: 'LI' },
  { label: 'Email', url: `mailto:${PortfolioConfig.social.email}`, icon: '@' },
];

const ContactForm = () => {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-bg2 dark:bg-bg2-dark border border-borderMuted dark:border-borderMuted p-6"
    >
      <h3 className="text-2xl font-bold text-primary dark:text-primary-dark mb-6 border-l-4 border-primary dark:border-primary-dark pl-4">Contact</h3>
      
      <div className="flex justify-center gap-4 mb-8">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-bg dark:bg-bg-dark border border-borderMuted dark:border-borderMuted text-text dark:text-text-dark text-sm font-mono hover:border-primary dark:hover:border-primary-dark transition-colors"
          >
            <span className="text-primary dark:text-primary-dark">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
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
            className="w-full px-4 py-3 bg-bg dark:bg-bg-dark text-text dark:text-text-dark border border-borderMuted dark:border-borderMuted focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
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
            className="w-full px-4 py-3 bg-bg dark:bg-bg-dark text-text dark:text-text-dark border border-borderMuted dark:border-borderMuted focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
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
            className="w-full px-4 py-3 bg-bg dark:bg-bg-dark text-text dark:text-text-dark border border-borderMuted dark:border-borderMuted focus:outline-none focus:border-primary dark:focus:border-primary transition-colors resize-none"
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 bg-gradient-primary dark:bg-gradient-primary-dark text-white dark:text-bg-dark text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {submitted ? 'Sent!' : 'Send Message'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
