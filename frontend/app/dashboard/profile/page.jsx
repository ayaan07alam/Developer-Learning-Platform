"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Upload, Save } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState({
        displayName: '',
        email: '',
        bio: '',
        profilePhoto: '',
        role: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else {
                setMessage('Failed to load profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage('Error loading profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setMessage('Image too large. Maximum size is 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile({ ...profile, profilePhoto: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            console.log('Updating profile with token:', token ? 'Present' : 'Missing');
            console.log('Profile data:', { username: profile.username, bio: profile.bio, hasPhoto: !!profile.profilePhoto });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    displayName: profile.displayName,
                    bio: profile.bio,
                    profilePhoto: profile.profilePhoto
                })
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                setMessage('Profile updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.log('Profile update error:', errorData);
                setMessage(errorData.error || errorData.message || `Failed to update profile (${response.status})`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage(`Error updating profile: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Photo */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                                {profile.profilePhoto ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                                        <Image
                                            src={profile.profilePhoto}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-12 h-12 text-primary" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-sm text-muted-foreground mt-2">
                                    JPG, PNG or GIF. Max size 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    <span>{profile.email}</span>
                                    <span className="ml-auto text-xs">(Cannot be changed)</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Username</label>
                                <input
                                    type="text"
                                    value={profile.displayName || ''}
                                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <div className="px-4 py-2 bg-muted rounded-lg text-muted-foreground">
                                    {profile.role}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">About Me</h2>
                        <textarea
                            value={profile.bio || ''}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Write a short bio about yourself..."
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            This will be displayed on your blog posts.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
