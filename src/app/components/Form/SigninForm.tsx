import { getCsrfToken } from 'next-auth/react';
import React, { useState } from 'react';

const SigninForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email et/ou mot de passe manquants.');
      return;
    }
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          csrfToken: csrfToken,
        }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        const { token } = responseData;
        localStorage.setItem('token', token);
        window.location.href = '/';
      } else {
        setError(responseData.message || responseData.error || 'Erreur lors de la connexion');
      }
    } catch (error) {
      setError('Une erreur est survenue.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center bg-white shadow-md rounded px-7 pt-1 pb-1 mb-1">
      <div className="mb-4">
        <label htmlFor="email" className="text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className=" text-gray-700 text-sm font-bold mb-2">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Se connecter
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </form>
  );
};

export default SigninForm;
