import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            setUser(data.user);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
    };

    const handleGitHubLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/github`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_#000]">
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">Login</Button>
            </form>
            <div className="text-center mt-4">
                <p>
                    No account?{' '}
                    <Link to="/register" className="text-primary font-bold hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-black"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-lg">Or</span>
                </div>
            </div>
            <div className="space-y-3">
                <Button onClick={handleGoogleLogin}>Login with Google</Button>
                <Button onClick={handleGitHubLogin}>Login with GitHub</Button>
            </div>
        </div>
    );
};

export default LoginPage;