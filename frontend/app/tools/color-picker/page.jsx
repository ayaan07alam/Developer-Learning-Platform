"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ColorPickerPage() {
    const [color, setColor] = useState('#3b82f6');
    const [copied, setCopied] = useState('');

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const hexToHsl = (hex) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return null;

        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    const rgb = hexToRgb(color);
    const hsl = hexToHsl(color);

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(''), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formats = [
        { id: 'hex', name: 'HEX', value: color.toUpperCase() },
        { id: 'rgb', name: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '' },
        { id: 'hsl', name: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '' },
    ];

    const presetColors = [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
        '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
        '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <Palette className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Color Picker</h1>
                    <p className="text-muted-foreground text-lg">
                        Pick colors and convert between HEX, RGB, HSL
                    </p>
                </motion.div>

                {/* Color Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <div
                        className="w-full h-48 rounded-2xl shadow-2xl border-4 border-white/20"
                        style={{ backgroundColor: color }}
                    />
                </motion.div>

                {/* Color Picker */}
                <div className="mb-8 p-6 rounded-xl bg-card border border-border">
                    <label className="text-lg font-semibold mb-4 block">Select Color</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full h-16 rounded-lg cursor-pointer"
                    />
                </div>

                {/* Color Formats */}
                <div className="space-y-4 mb-8">
                    {formats.map((format) => (
                        <motion.div
                            key={format.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-xl bg-card border border-border flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{format.name}</p>
                                <p className="font-mono text-lg font-semibold">{format.value}</p>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(format.value, format.id)}
                            >
                                {copied === format.id ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Preset Colors */}
                <div className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-4">Preset Colors</h3>
                    <div className="grid grid-cols-6 md:grid-cols-9 gap-3">
                        {presetColors.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => setColor(preset)}
                                className="w-full aspect-square rounded-lg cursor-pointer hover:scale-110 transition-transform border-2 border-white/20"
                                style={{ backgroundColor: preset }}
                                title={preset}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
