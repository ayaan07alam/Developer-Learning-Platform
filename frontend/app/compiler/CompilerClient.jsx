"use client";
import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, Loader2, Copy, Check, Terminal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { executeCode, getSupportedLanguages } from '@/lib/pistonApi';

const DEFAULT_CODE = {
    javascript: `// Write your JavaScript code here
console.log("Hello from RuntimeRiver!");

function sum(a, b) {
    return a + b;
}

console.log("Sum of 5 + 3 =", sum(5, 3));`,
    python: `# Write your Python code here
print("Hello from RuntimeRiver!")

def greet(name):
    return f"Welcome, {name}!"

print(greet("Developer"))`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from RuntimeRiver!");
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from RuntimeRiver!" << endl;
    return 0;
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello from RuntimeRiver!\\n");
    return 0;
}`,
    typescript: `// Write your TypeScript code here
console.log("Hello from RuntimeRiver!");

function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`,
    go: `package main
import "fmt"

func main() {
    fmt.Println("Hello from RuntimeRiver!")
}`,
    rust: `fn main() {
    println!("Hello from RuntimeRiver!");
}`,
    php: `<?php
echo "Hello from RuntimeRiver!";
?>`,
    csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from RuntimeRiver!");
    }
}`,
    ruby: `puts "Hello from RuntimeRiver!"`,
    swift: `print("Hello from RuntimeRiver!")`,
    r: `print("Hello from RuntimeRiver!")`,
    bash: `echo "Hello from RuntimeRiver!"`
};

export default function CompilerPage() {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(DEFAULT_CODE.javascript);
    const [stdin, setStdin] = useState('');
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (DEFAULT_CODE[newLang]) {
            setCode(DEFAULT_CODE[newLang]);
        }
        setOutput(null);
        setError(null);
    };

    const handleRun = async () => {
        if (!code.trim()) {
            setError('Please write some code to execute.');
            return;
        }

        setIsRunning(true);
        setOutput(null);
        setError(null);

        const result = await executeCode(code, language, stdin);

        setIsRunning(false);

        if (result.success) {
            setOutput(result.output || 'Code executed successfully (no output)');
        } else {
            setError(result.error);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setOutput(null);
        setError(null);
    };

    // Get language extension
    const getLanguageExtension = () => {
        switch (language) {
            case 'javascript':
            case 'typescript':
                return [javascript({ jsx: true, typescript: language === 'typescript' })];
            case 'python':
                return [python()];
            case 'java':
                return [java()];
            case 'cpp':
            case 'c':
                return [cpp()];
            default:
                return [];
        }
    };

    if (!mounted) return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Online <span className="text-primary">Compiler</span> & IDE
                        </h1>
                        <p className="text-muted-foreground">
                            Write, compile, and run code in 18+ programming languages instantly.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="bg-card border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
                        >
                            {getSupportedLanguages().map(lang => (
                                <option key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </option>
                            ))}
                        </select>

                        <Button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="min-w-[120px]"
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Run Code
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Editor & Output Split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
                    {/* Editor Panel */}
                    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-xs text-muted-foreground font-mono">main.{language === 'cpp' ? 'cpp' : language.replace('sharp', 'cs')}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="h-8 w-8 p-0"
                                title="Copy Code"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="flex-grow overflow-hidden">
                            <CodeMirror
                                value={code}
                                height="100%"
                                theme={oneDark}
                                extensions={getLanguageExtension()}
                                onChange={(value) => setCode(value)}
                                style={{ fontSize: '14px', height: '100%' }}
                                basicSetup={{
                                    lineNumbers: true,
                                    highlightActiveLineGutter: true,
                                    highlightSpecialChars: true,
                                    foldGutter: true,
                                    drawSelection: true,
                                    dropCursor: true,
                                    allowMultipleSelections: true,
                                    indentOnInput: true,
                                    bracketMatching: true,
                                    closeBrackets: true,
                                    autocompletion: true,
                                    rectangularSelection: true,
                                    crosshairCursor: true,
                                    highlightActiveLine: true,
                                    highlightSelectionMatches: true,
                                    closeBracketsKeymap: true,
                                    searchKeymap: true,
                                    foldKeymap: true,
                                    completionKeymap: true,
                                    lintKeymap: true,
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Panel - Input & Output */}
                    <div className="flex flex-col gap-6 h-[calc(100vh-250px)] min-h-[500px]">
                        {/* Input Panel */}
                        <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm h-1/3">
                            <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center">
                                <span className="text-sm font-medium">Standard Input (stdin)</span>
                            </div>
                            <textarea
                                value={stdin}
                                onChange={(e) => setStdin(e.target.value)}
                                className="flex-grow p-4 bg-background resize-none focus:outline-none font-mono text-sm"
                                placeholder={`Enter input here (e.g., for Java Scanner or Python input())...\n\nExample:\n25\nJohn Doe`}
                            />
                        </div>

                        {/* Output Panel */}
                        <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm h-2/3">
                            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">Output Console</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClear}
                                    className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                                >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Clear
                                </Button>
                            </div>

                            <div className="flex-grow p-4 bg-[#1e1e1e] overflow-auto">
                                {!output && !error && !isRunning && (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50">
                                        <Play className="w-12 h-12 mb-4 opacity-20" />
                                        <p className="text-sm">Run your code to see output here</p>
                                    </div>
                                )}

                                {isRunning && (
                                    <div className="h-full flex flex-col items-center justify-center text-primary">
                                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                        <p className="text-sm animate-pulse">Compiling and executing...</p>
                                    </div>
                                )}

                                {output && (
                                    <pre className="font-mono text-sm whitespace-pre-wrap text-green-400">
                                        {output}
                                    </pre>
                                )}

                                {error && (
                                    <pre className="font-mono text-sm whitespace-pre-wrap text-red-400">
                                        {error}
                                    </pre>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
