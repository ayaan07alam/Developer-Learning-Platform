"use client";
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { Play, Copy, Check, Loader2, AlertCircle, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { executeCode, isLanguageSupported } from '@/lib/pistonApi';
import { detectLanguage } from '@/lib/languageDetector';

export default function CodeBlockComponent({ node, updateAttributes, extension }) {
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState(node.attrs.savedOutput || null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(node.attrs.language || 'javascript');
    const [saveOutput, setSaveOutput] = useState(node.attrs.saveOutput || false);
    const [autoDetected, setAutoDetected] = useState(false);

    // Auto-detect language when code changes
    useEffect(() => {
        const code = node.textContent;
        if (code && code.trim().length > 10 && !node.attrs.language) {
            const detected = detectLanguage(code);
            if (detected && detected !== 'text') {
                setSelectedLanguage(detected);
                updateAttributes({ language: detected });
                setAutoDetected(true);
                setTimeout(() => setAutoDetected(false), 2000);
            }
        }
    }, [node.textContent]);

    const handleRun = async () => {
        const code = node.textContent;
        if (!code.trim()) {
            setError('No code to execute');
            return;
        }

        setIsRunning(true);
        setOutput(null);
        setError(null);

        const result = await executeCode(code, selectedLanguage);

        setIsRunning(false);

        if (result.success) {
            const newOutput = result.output || 'Code executed successfully (no output)';
            setOutput(newOutput);
            setError(null);

            // If save output is checked, save it to node attributes
            if (saveOutput) {
                updateAttributes({ savedOutput: newOutput });
            }
        } else {
            setError(result.error);
            setOutput(null);
        }
    };

    const handleCopy = async () => {
        const code = node.textContent;
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setSelectedLanguage(newLang);
        updateAttributes({ language: newLang });
        setOutput(null);
        setError(null);
    };

    const handleSaveOutputToggle = (e) => {
        const checked = e.target.checked;
        setSaveOutput(checked);
        updateAttributes({
            saveOutput: checked,
            savedOutput: checked ? output : null
        });
    };

    const canRun = isLanguageSupported(selectedLanguage);

    return (
        <NodeViewWrapper className="code-block-wrapper relative group my-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
                    <div className="flex items-center gap-2">
                        <select
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            className="text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="typescript">TypeScript</option>
                            <option value="ruby">Ruby</option>
                            <option value="go">Go</option>
                            <option value="rust">Rust</option>
                            <option value="php">PHP</option>
                            <option value="csharp">C#</option>
                            <option value="kotlin">Kotlin</option>
                            <option value="swift">Swift</option>
                            <option value="r">R</option>
                            <option value="bash">Bash</option>
                            <option value="sql">SQL</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                        </select>
                        {autoDetected && (
                            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 animate-pulse">
                                <Sparkles className="w-3 h-3" />
                                Auto-detected!
                            </span>
                        )}
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
                <NodeViewContent as="pre" className="!my-0" />

                {/* Save Output Checkbox */}
                {canRun && (output || node.attrs.savedOutput) && (
                    <div className="px-3 py-2 bg-muted/20 border-t border-border flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`save-output-${node.attrs.id || 'default'}`}
                            checked={saveOutput}
                            onChange={handleSaveOutputToggle}
                            className="rounded border-border cursor-pointer"
                        />
                        <label
                            htmlFor={`save-output-${node.attrs.id || 'default'}`}
                            className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1"
                        >
                            <Save className="w-3 h-3" />
                            Save output with blog post
                        </label>
                        {saveOutput && (
                            <span className="text-xs text-green-600 dark:text-green-400">✓ Saved</span>
                        )}
                    </div>
                )}

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
        </NodeViewWrapper>
    );
}
