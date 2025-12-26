"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExcelToPDFPage() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Table className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Excel to PDF</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert Excel spreadsheets to PDF format
                    </p>
                </motion.div>

                {!file ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-accent/50 transition-all">
                        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-lg font-semibold">Upload Excel File</p>
                        <p className="text-sm text-muted-foreground">XLSX files</p>
                        <input
                            type="file"
                            className="hidden"
                            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-card border border-border flex items-center gap-3">
                            <Table className="w-10 h-10 text-green-500" />
                            <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                            <p className="text-sm text-muted-foreground mb-4">
                                <strong>Feature Under Development:</strong> Excel to PDF conversion requires POI and iText/PDFBox libraries.
                                Backend API implementation coming soon.
                            </p>
                            <Button className="w-full" disabled>
                                <FileText className="w-4 h-4 mr-2" />
                                Convert to PDF (Coming Soon)
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
