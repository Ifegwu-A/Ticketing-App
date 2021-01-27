import { useState } from 'react';
import axios from 'axios';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    console.log(email, password);
    const response = await axios.post('/api/users/signup', { email, password });
    console.log(response);
  };

  console.log('we are here-Index- pro');

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
}
