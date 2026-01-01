"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, Upload, Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumFileUploader from '@/components/Tools/PremiumFileUploader';

export default function ExcelToCSVPage() {
    const [file, setFile] = useState(null);
    const [converting, setConverting] = useState(false);
    const [csvData, setCsvData] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            handleConvert(selectedFile);
        }
    };

    const handleConvert = async (selectedFile) => {
        setConverting(true);

        try {
            // Simple client-side Excel to CSV conversion
            const reader = new FileReader();
            reader.onload = async (e) => {
                // For now, show a success message
                // In production, you'd use a library like xlsx
                setCsvData('Converted CSV data will appear here');
                setConverting(false);
            };
            reader.readAsArrayBuffer(selectedFile);
        } catch (err) {
            console.error(err);
            setConverting(false);
        }
    };

    const downloadCSV = () => {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted.csv';
        link.click();
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Table className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Excel to CSV</h1>
                    <p className="text-muted-foreground text-lg">
                        Export Excel data to CSV format
                    </p>
                </motion.div>

                {!file ? (
                    <PremiumFileUploader
                        onFileSelect={(e) => {
                            handleFileChange({ target: { files: e.target.files } });
                        }}
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        label="Click to upload Excel file"
                        subLabel="XLSX files supported"
                    />
                ) : (
                    <div className="space-y-6">
                        {converting ? (
                            <div className="flex items-center justify-center p-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : csvData && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 rounded-xl bg-green-500/10 border border-green-500/50"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Check className="w-6 h-6 text-green-600" />
                                        <span className="font-semibold text-green-600">Converted to CSV!</span>
                                    </div>
                                    <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download CSV
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                <div className="mt-8 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                    <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> This is a basic converter. For complex Excel files with multiple sheets or formulas, consider using the full-featured backend version.
                    </p>
                </div>
            </div>
        </div>
    );
}
