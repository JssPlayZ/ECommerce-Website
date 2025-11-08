import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { API_URL } from '../utils/helpers';
import { Spinner } from '../components/UI';

const ProfilePage = () => {
    const { user, showToast, updateUser } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [loading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePicture') || null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
             const fetchProfile = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get(`${API_URL}/user/profile`, config);
                    setName(data.name);
                    setEmail(data.email);
                    setCreatedAt(data.createdAt);
                } catch (error) { console.error("Failed to fetch profile", error); } 
                finally { setLoading(false); }
            };
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                localStorage.setItem('profilePicture', base64String);
                setProfilePic(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`${API_URL}/user/profile`, { name, password }, config);
            updateUser(data);
            showToast('Profile Updated Successfully!', 'success');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to update profile', 'error');
        }
    };


    if (loading) return <div className="py-20"><Spinner /></div>;
    if (!user) return <div className="text-center container mx-auto p-4 md:p-8">Please log in to view your profile.</div>

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center border dark:border-slate-700">
                        <div className="flex justify-center mb-4 relative w-32 h-32 mx-auto">
                            <img src={profilePic || `https://placehold.co/128x128/e2e8f0/4a5568?text=${name.charAt(0)}`} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-amber-500" />
                            <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-slate-800 dark:bg-amber-500 text-white rounded-full p-2 hover:bg-slate-700 dark:hover:bg-amber-600 transition" aria-label="Change profile picture">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h2>
                        <p className="text-slate-600 dark:text-slate-400">{email}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Joined on {new Date(createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border dark:border-slate-700">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Update Profile</h2>
                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                            </div>
                             <div>
                                <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">New Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep the same" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                            </div>
                             <div>
                                <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-zinc-50 dark:bg-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                            </div>
                            <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-600 transition font-bold active:scale-95">Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;