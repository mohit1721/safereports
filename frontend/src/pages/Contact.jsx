'use client'
import React, { useState } from 'react';
import axios from 'axios';
import {toast} from "react-hot-toast"
const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://safereports.onrender.com/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting , setIsSubmitting] = useState(false)
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
        setIsSubmitting(true)
        const response = await axios.post(`${BASE_URL}/contact`, formData,{
          headers: { 'Content-Type': 'application/json' },
        });
        setIsSubmitting(false)
        setSuccessMessage(response.data.message);
        toast.success(response.data.message)
        setFormData({ name: '', email: '', message: '' });
      } catch (error) {
        console.log('Error sending contact form:', error);
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
  disabled={isSubmitting}
  aria-live="assertive"
  className="w-full cursor-pointer relative group overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 
           px-4 py-3.5 text-sm font-medium text-white shadow-lg
           transition-all duration-200 hover:from-sky-400 hover:to-blue-500
           disabled:opacity-50 disabled:cursor-not-allowed"
>
  <div className="relative flex items-center justify-center gap-2">
    {isSubmitting ? (
      <>
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Submitting...</span>
      </>
    ) : (
      <>
        <span>Submit Report</span>
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </>
    )}
  </div>
</button>

        </form>
      </div>
    </div>
  );
};

export default Contact;
