"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api-client';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchCurrentUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCurrentUser = async (authToken) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                // Token invalid, clear it
                logout();
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (email, password, displayName) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, displayName })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }

            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const updateUsername = async (newUsername) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/update-username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username: newUsername })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.error || 'Failed to update username' };
            }
        } catch (error) {
            console.error('Error updating username:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const loginWithGoogle = async (credential) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: credential })
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.error || 'Google authentication failed' };
            }
        } catch (error) {
            console.error('Error with Google auth:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUsername,
        loginWithGoogle,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isEditor: user?.role === 'EDITOR' || user?.role === 'ADMIN',
        isReviewer: user?.role === 'REVIEWER', // Fixed: ADMIN should NOT be treated as reviewer
        isUser: user?.role === 'USER',

        // Permission helpers
        canEditPost: () => user?.role === 'ADMIN' || user?.role === 'EDITOR',
        canDeletePost: () => user?.role === 'ADMIN',
        canPublishPost: () => user?.role === 'ADMIN' || user?.role === 'EDITOR',
        canViewAnalytics: () => user?.role === 'ADMIN',
        canManageUsers: () => user?.role === 'ADMIN',
        canReviewPost: () => user?.role === 'ADMIN' || user?.role === 'REVIEWER',
        canCreatePost: () => user?.role === 'ADMIN' || user?.role === 'EDITOR',
        canManageCategories: () => user?.role === 'ADMIN' || user?.role === 'EDITOR',
        canViewUserList: () => user?.role === 'ADMIN' || user?.role === 'EDITOR',
        hasDashboardAccess: () => user?.role === 'ADMIN' || user?.role === 'EDITOR' || user?.role === 'REVIEWER',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
