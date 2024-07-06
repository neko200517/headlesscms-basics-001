'use client';

import { FormEvent, useState } from 'react';
import SubmissionAlert from './SubmissionAlert';

export default function ContactForm() {
  const [responseMessage, setResponseMessage] = useState('');
  const [alertColor, setAlertColor] = useState('bg-green-500');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const response = await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setResponseMessage(result.message);
    setAlertColor(response.ok ? 'bg-green-500' : 'bg-red-500');
  };

  return (
    <section>
      <div className='container mx-auto lg:max-w-4xl'>
        <h1 className='text-4xl text-center text-slate-700 py-8'>Contact Us</h1>

        <form className='contact-form' onSubmit={handleSubmit}>
          <label htmlFor='firstName'>First Name:</label>
          <input type='text' id='firstName' name='firstName' />

          <label htmlFor='email'>Email:</label>
          <input type='email' id='email' name='email' />

          <label htmlFor='message'>Message:</label>
          <textarea name='message' id='message' cols={30} rows={10}></textarea>

          <button type='submit'>Submit</button>
        </form>

        {responseMessage && (
          <div className='mt-4'>
            <SubmissionAlert alertColor={alertColor}>
              {responseMessage}
            </SubmissionAlert>
          </div>
        )}
      </div>
    </section>
  );
}
