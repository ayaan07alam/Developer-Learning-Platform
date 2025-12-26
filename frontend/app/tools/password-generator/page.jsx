"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true
    });
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        let charset = '';
        if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (options.numbers) charset += '0123456789';
        if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!charset) {
            setPassword('Please select at least one option');
            return;
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(newPassword);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getStrength = () => {
        if (length < 8) return { text: 'Weak', color: 'text-red-500' };
        if (length < 12) return { text: 'Medium', color: 'text-yellow-500' };
        if (length < 16) return { text: 'Strong', color: 'text-green-500' };
        return { text: 'Very Strong', color: 'text-green-600' };
    };

    const strength = getStrength();

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Key className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Password Generator</h1>
                    <p className="text-muted-foreground text-lg">
                        Generate secure random passwords instantly
                    </p>
                </motion.div>

                {/* Password Display */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-6 rounded-xl bg-card border border-border"
                >
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-muted-foreground">Generated Password</label>
                        <span className={`text-sm font-semibold ${strength.color}`}>
                            {strength.text}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={password}
                            readOnly
                            placeholder="Click generate to create password"
                            className="flex-1 p-4 rounded-lg bg-background border border-border font-mono text-lg"
                        />
                        {password && (
                            <Button onClick={copyToClipboard} size="lg">
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Length Slider */}
                <div className="mb-6 p-6 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <label className="font-semibold">Password Length</label>
                        <span className="text-2xl font-bold text-primary">{length}</span>
                    </div>
                    <input
                        type="range"
                        min="4"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-accent"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>4</span>
                        <span>32</span>
                    </div>
                </div>

                {/* Options */}
                <div className="mb-6 p-6 rounded-xl bg-card border border-border space-y-4">
                    <label className="font-semibold block mb-4">Options</label>
                    {[
                        { key: 'uppercase', label: 'Uppercase Letters (A-Z)' },
                        { key: 'lowercase', label: 'Lowercase Letters (a-z)' },
                        { key: 'numbers', label: 'Numbers (0-9)' },
                        { key: 'symbols', label: 'Symbols (!@#$%...)' }
                    ].map((option) => (
                        <label key={option.key} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={options[option.key]}
                                onChange={(e) => setOptions({ ...options, [option.key]: e.target.checked })}
                                className="w-5 h-5 rounded cursor-pointer"
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>

                {/* Generate Button */}
                <Button onClick={generatePassword} className="w-full h-14 text-lg">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Generate Password
                </Button>
            </div>
        </div>
    );
}
