import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al registrar usuario');
      onRegister(data.token, data.user);
      setSuccess('Registro exitoso. Redirigiendo...');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h2>Crear cuenta</h2>
      <p className="small-text">Crea tu usuario y comienza a comprar en nuestra tienda en línea.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nombre completo
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Registrarme</button>
        {error && <div className="alert">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
      <p className="extra-line">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}

export default RegisterPage;
