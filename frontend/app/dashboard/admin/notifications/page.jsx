"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Shield, Send, Users, CheckCircle, AlertTriangle } from "lucide-react";
import RoleGuard from "@/components/RoleGuard";

const AdminNotificationPage = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [role, setRole] = useState("ALL");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        if (role === "SPECIFIC" && !email.trim()) return;

        setStatus({ type: "", message: "" });
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/notifications/broadcast`,
                {
                    message,
                    role,
                    email: role === "SPECIFIC" ? email : undefined,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setStatus({ type: "success", message: "Broadcast sent successfully!" });
            setMessage("");
        } catch (error) {
            console.error("Broadcast failed", error);
            setStatus({
                type: "error",
                message: error.response?.data?.error || "Failed to send broadcast"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleGuard allowedRoles={["ADMIN"]}>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-card border border-border rounded-xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                                Broadcast Notification
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Send a message to all users or specific roles.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleBroadcast} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                Target Audience
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {["ALL", "USER", "EDITOR", "ADMIN", "SPECIFIC"].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                            role === r
                                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
                                        )}
                                    >
                                        {r === "ALL" ? "All Users" : r === "SPECIFIC" ? "Specific User" : r.charAt(0) + r.slice(1).toLowerCase() + "s"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {role === "SPECIFIC" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium">User Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter user email..."
                                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your notification message here..."
                                rows={5}
                                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                required
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {message.length} characters
                            </p>
                        </div>

                        {status.message && (
                            <div
                                className={cn(
                                    "p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2",
                                    status.type === "success"
                                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                                )}
                            >
                                {status.type === "success" ? (
                                    <CheckCircle className="w-5 h-5 shrink-0" />
                                ) : (
                                    <AlertTriangle className="w-5 h-5 shrink-0" />
                                )}
                                {status.message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || !message.trim()}
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Send className="w-5 h-5" />
                                    Send Broadcast
                                </div>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </RoleGuard>
    );
};

export default AdminNotificationPage;
