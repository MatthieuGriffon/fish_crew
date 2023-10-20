import React, { useState, useEffect } from 'react';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setSuccess('Inscription ,veuillez maintenant vous connecter !');
        setError(null);
    } else {
        const errorData = await response.json();
        console.log(errorData);
        setError(errorData.error);
        setSuccess(null);
    }
    
    } catch (error) {
      setError('Une erreur est survenue.');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 p-2 shadow-md rounded text-xs">
      <label htmlFor="username" className="text-white-700 font-medium text-xs">
        Nom d'utilisateur
      </label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
        className="text-xs shadow appearance-none border rounded w-40 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
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
        S'inscrire
      </button>
      {error && <div className="text-red-500 bg-white p-1">{error}</div>}
      {success && <div className="text-green-500 bg-white p-1">{success}</div>}
    </form>
    
  );
};

export default SignupForm;