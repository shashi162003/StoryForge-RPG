import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            return alert('Password must be at least 6 characters long.');
        }
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
                { username, email, password }
            );
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            alert('Registration failed. The email or username may already be in use.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_#000]">
            <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">Register</Button>
            </form>
            <div className="text-center mt-4">
                <p>
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;