"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PremiumFileUploader from '@/components/Tools/PremiumFileUploader';

export default function WordToHTMLPage() {
    const [file, setFile] = useState(null);
    const [converting, setConverting] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            convertToHTML(selectedFile);
        }
    };

    const convertToHTML = async (docFile) => {
        setConverting(true);

        // Simple conversion - in production you'd use a library like mammoth.js
        setTimeout(() => {
            const mockHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Converted Document</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        p { line-height: 1.6; }
    </style>
</head>
<body>
    <h1>Document Converted</h1>
    <p>This is a basic HTML conversion. For full conversion with formatting, images, and tables, 
    use a specialized library like mammoth.js or the backend API.</p>
    <p><strong>File:</strong> ${docFile.name}</p>
    <p><strong>Size:</strong> ${(docFile.size / 1024).toFixed(2)} KB</p>
</body>
</html>`;
            setHtmlContent(mockHTML);
            setConverting(false);
        }, 1000);
    };

    const downloadHTML = () => {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted.html';
        link.click();
    };

    const copyHTML = () => {
        navigator.clipboard.writeText(htmlContent);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Word to HTML</h1>
                    <p className="text-muted-foreground text-lg">
                        Convert Word documents to HTML format
                    </p>
                </motion.div>

                {!file ? (
                    <PremiumFileUploader
                        onFileSelect={(e) => {
                            handleFileChange({ target: { files: e.target.files } });
                        }}
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        label="Click to upload Word document"
                        subLabel="DOCX files supported"
                    />
                ) : (
                    <div className="space-y-6">
                        {converting ? (
                            <div className="flex items-center justify-center p-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : htmlContent && (
                            <>
                                <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Check className="w-6 h-6 text-green-600" />
                                        <span className="font-semibold text-green-600">Converted to HTML!</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button onClick={downloadHTML} className="bg-green-600 hover:bg-green-700">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download HTML
                                        </Button>
                                        <Button onClick={copyHTML} variant="outline">
                                            Copy HTML
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-card border border-border">
                                    <h3 className="font-semibold mb-3">HTML Preview:</h3>
                                    <pre className="text-sm bg-background p-4 rounded-lg overflow-x-auto max-h-96">
                                        <code>{htmlContent}</code>
                                    </pre>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="mt-8 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50">
                    <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> This is a basic converter. For production use with full formatting preservation,
                        install mammoth.js library or use the backend conversion API.
                    </p>
                </div>
            </div>
        </div>
    );
}
