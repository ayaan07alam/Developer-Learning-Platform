"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QRCodeLib from 'qrcode';

export default function QRGeneratorPage() {
    const [text, setText] = useState('');
    const [qrCode, setQrCode] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        if (text && canvasRef.current) {
            QRCodeLib.toCanvas(canvasRef.current, text, { width: 300 }, (error) => {
                if (error) console.error(error);
            });

            QRCodeLib.toDataURL(text, { width: 300 }, (err, url) => {
                if (!err) setQrCode(url);
            });
        }
    }, [text]);

    const downloadQR = () => {
        if (!qrCode) return;
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = 'qrcode.png';
        link.click();
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">QR Code Generator</h1>
                    <p className="text-muted-foreground text-lg">
                        Create QR codes from text or URLs
                    </p>
                </motion.div>

                <div className="mb-6 space-y-3">
                    <label className="text-lg font-semibold">Enter Text or URL</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="https://example.com or any text..."
                        className="w-full h-32 p-4 rounded-lg bg-card border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {text && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-xl bg-card border border-border text-center"
                    >
                        <canvas ref={canvasRef} className="mx-auto mb-6 rounded-lg" />
                        <Button onClick={downloadQR} className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download QR Code
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
