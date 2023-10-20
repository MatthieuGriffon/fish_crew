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
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 p-2 shadow-2xl rounded text-xs">
      <label htmlFor="email" className="text-white-700 font-medium text-xs">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="text-xs shadow appearance-none border rounded w-40 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <label htmlFor="password" className="text-white-700 font-medium text-xs">
        Mot de passe
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="text-xs shadow appearance-none border rounded w-40 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded focus:outline-none focus:shadow-outline"
      >
        Connexion
      </button>
      {error && <div className="text-red-500 bg-white p-1">{error}</div>}
    </form>
  );
};

export default SigninForm;