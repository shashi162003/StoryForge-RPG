import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/useStore';
import Input from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email;
    const setUser = useStore((state) => state.setUser);
    const [loading, setLoading] = useState(false);

    if (!email) {
        navigate('/register');
        return null;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`,
                { email, otp },
                { withCredentials: true }
            );

            setUser(data.user);
            navigate('/');
        } catch (error) {
            console.error('OTP verification failed:', error.response?.data?.message || error.message);
            alert('Invalid or expired OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border-2 border-black shadow-[8px_8px_0px_#000]">
            <h2 className="text-3xl font-bold text-center mb-6">Check Your Email</h2>
            <p className="text-center mb-4">We've sent a 6-digit OTP to <span className="font-bold">{email}</span>.</p>
            <form onSubmit={handleVerify} className="space-y-4">
                <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <Button type="submit" disabled={loading}>
                    {loading ? <Spinner /> : 'Verify OTP'}
                </Button>
            </form>
        </div>
    );
};

export default VerifyOtpPage;