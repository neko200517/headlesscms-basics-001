'use client';

import { FormEvent, useState } from 'react';
import SubmissionAlert from './SubmissionAlert';
import { mutate } from 'swr';

export default function CommentForm({
  postId,
  slug,
}: {
  postId: number;
  slug: string;
}) {
  const [auther, setAutor] = useState('');
  const [authourEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');

  const [responseMessage, setResponseMessage] = useState('');
  const [alertColor, setAlertColor] = useState('bg-green-500');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setResponseMessage('Your comment is being submitted...');
    setAlertColor('bg-yellow-500');

    let data = {
      author: auther,
      authorEmail: authourEmail,
      content: content.replace(/\n/g, '\\n'),
      postId,
    };

    const response = await fetch(`/api/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setResponseMessage(result.message);

    if (response.ok) {
      setAlertColor('bg-green-500');
      setAutor('');
      setAuthorEmail('');
      setContent('');
      mutate(slug); // cache refresh
    } else {
      setAlertColor('bg-red-500');
    }
  };

  return (
    <>
      <h3 className='text-2xl pb-4 mb-4 border-b'>Add your thoughts:</h3>

      <form className='comment-form' onSubmit={handleSubmit}>
        <label htmlFor='author'>First Name:</label>
        <input
          type='text'
          id='author'
          name='author'
          onChange={(e) => setAutor(e.target.value)}
          value={auther}
          required
        />

        <label htmlFor='authorEmail'>Email:</label>
        <input
          type='email'
          id='authorEmail'
          name='authorEmail'
          onChange={(e) => setAuthorEmail(e.target.value)}
          value={authourEmail}
          required
        />

        <label htmlFor='content'>Message:</label>
        <textarea
          name='content'
          id='content'
          cols={30}
          rows={10}
          onChange={(e) => setContent(e.target.value)}
          value={content}
          required
        ></textarea>

        <button type='submit'>submit</button>

        {responseMessage && (
          <SubmissionAlert alertColor={alertColor}>
            {responseMessage}
          </SubmissionAlert>
        )}
      </form>
    </>
  );
}
