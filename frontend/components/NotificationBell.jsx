"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/notifications`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setNotifications(response.data);
            const unread = response.data.filter((n) => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            // Poll for new notifications every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id, isRead) => {
        if (isRead) return;
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/notifications/${id}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Update local state
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary relative"
                onClick={handleToggle}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-background" />
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                                <Bell className="w-8 h-8 opacity-20" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => markAsRead(notification.id, notification.isRead)}
                                        className={cn(
                                            "p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 items-start",
                                            !notification.isRead ? "bg-primary/5" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-2 h-2 mt-1.5 rounded-full shrink-0",
                                            !notification.isRead ? "bg-primary" : "bg-transparent"
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <p className={cn("text-sm leading-snug", !notification.isRead ? "font-medium" : "text-muted-foreground")}>
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
