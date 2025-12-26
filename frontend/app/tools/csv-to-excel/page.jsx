"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CSVToExcelPage() {
    const [csvFile, setCSVFile] = useState(null);
    const [csvPreview, setCSVPreview] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'text/csv') {
            setCSVFile(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const rows = text.split('\n').slice(0, 5).map(row => row.split(','));
                setCSVPreview(rows);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Table className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">CSV to Excel</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert CSV files to Excel format
                    </p>
                </motion.div>

                {!csvFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-lg font-semibold">Upload CSV File</p>
                        <p className="text-sm text-muted-foreground">CSV files only</p>
                        <input
                            type="file"
                            className="hidden"
                            accept=".csv,text/csv"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                CSV Preview
                            </h3>
                            {csvPreview.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <tbody>
                                            {csvPreview.map((row, i) => (
                                                <tr key={i} className="border-b border-border">
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="p-2">{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                            <p className="text-sm text-muted-foreground">
                                <strong>Feature Under Development:</strong> CSV to Excel conversion requires additional libraries (xlsx/exceljs).
                                This preview shows your CSV structure. Backend API implementation coming soon.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
