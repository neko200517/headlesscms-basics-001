import { FormEvent, useState } from 'react';

export default function CommentForm({ postId }: { postId: number }) {
  const [auther, setAutor] = useState('');
  const [authourEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [id, setId] = useState(postId);

  const [submitStatus, setSubmitStatus] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [alertColor, setAlertColor] = useState('bg-green-500');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitStatus(true);
    setResponseMessage('Your comment is being submitted...');
    setAlertColor('bg-yellow-500');

    let data = {
      author: auther,
      authorEmail: authourEmail,
      content: content.replace(/\n/g, '\\n'),
      postId: id,
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

        {submitStatus && (
          <div className={`${alertColor} py-2 px-4 text-slate-100 rounded-md`}>
            {responseMessage}
          </div>
        )}
      </form>
    </>
  );
}
