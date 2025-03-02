'use client'
import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://safereports.onrender.com/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (!value) {
      newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      delete newErrors[name];
    }

    if (name === 'email' && value) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(value)) {
        newErrors.email = 'Invalid email address';
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(`${BASE_URL}/contact`, formData);
        setSuccessMessage(response.data.message);
        setFormData({ name: '', email: '', message: '' });
      } catch (error) {
        console.error('Error sending contact form:', error);
        setErrors({ general: 'Failed to send message. Try again later.' });
      }
    }
  };

  return (
    <div className="bg-black-900 mt-12 mx-auto w-[50%] h-fit text-white">
      <div className="container p-11 mx-auto py-16 px-6">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errors.general && <p className="text-red-500">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {['name', 'email', 'message'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium" htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field !== 'message' ? (
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  placeholder={`Enter your ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-2 block p-2 h-12 bg-black/50 backdrop-blur-xl w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              ) : (
                <textarea
                  id={field}
                  name={field}
                  placeholder="Write your message here"
                  rows={4}
                  value={formData[field]}
                  onChange={handleChange}
                  className="mt-2 p-2 bg-black/50 backdrop-blur-xl block w-full border border-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
              {errors[field] && <p className="text-red-500">{errors[field]}</p>}
            </div>
          ))}

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
