"use client";
import { useState } from 'react';
import { Play, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { executeCode, isLanguageSupported } from '@/lib/pistonApi';

export default function CodeBlockRenderer({ code, language, savedOutput = null }) {
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState(savedOutput);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleRun = async () => {
        if (!code.trim()) {
            setError('No code to execute');
            return;
        }

        setIsRunning(true);
        setOutput(null);
        setError(null);

        const result = await executeCode(code, language);

        setIsRunning(false);

        if (result.success) {
            setOutput(result.output || 'Code executed successfully (no output)');
            setError(null);
        } else {
            setError(result.error);
            setOutput(null);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const canRun = isLanguageSupported(language);

    return (
        <div className="code-block-wrapper relative group my-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                            {language || 'code'}
                        </span>
                        {!canRun && (
                            <span className="text-xs text-muted-foreground">(View only)</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={handleCopy}
                            className="h-7 px-2"
                            title="Copy code"
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </Button>
                        {canRun && (
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleRun}
                                disabled={isRunning}
                                className="h-7 px-3 bg-primary hover:bg-primary/90"
                                title="Run code"
                            >
                                {isRunning ? (
                                    <>
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        <span className="text-xs">Running...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3 h-3 mr-1" />
                                        <span className="text-xs">Run</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Code Content */}
                <pre className="p-4 overflow-x-auto">
                    <code className={`language-${language}`}>{code}</code>
                </pre>

                {/* Output/Error Display */}
                {(output || error) && (
                    <div className="border-t border-border">
                        {output && (
                            <div className="p-3 bg-muted/30">
                                <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                                    Output:
                                </div>
                                <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                                    {output}
                                </pre>
                            </div>
                        )}
                        {error && (
                            <div className="p-3 bg-destructive/10">
                                <div className="flex items-center gap-1 text-xs font-semibold text-destructive mb-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Error:
                                </div>
                                <pre className="text-xs font-mono whitespace-pre-wrap text-destructive">
                                    {error}
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
