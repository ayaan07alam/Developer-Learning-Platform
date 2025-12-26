"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegexTesterPage() {
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState({ g: true, i: false, m: false });
    const [testString, setTestString] = useState('');
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState('');

    const testRegex = () => {
        if (!pattern) {
            setError('Please enter a pattern');
            return;
        }

        try {
            const flagString = Object.keys(flags).filter(f => flags[f]).join('');
            const regex = new RegExp(pattern, flagString);
            const found = [...testString.matchAll(regex)];
            setMatches(found);
            setError('');
        } catch (err) {
            setError(err.message);
            setMatches([]);
        }
    };

    const highlightMatches = () => {
        if (!matches.length) return testString;

        let result = testString;
        let offset = 0;

        matches.forEach((match) => {
            const start = match.index + offset;
            const end = start + match[0].length;
            const highlighted = `<mark class="bg-yellow-300 dark:bg-yellow-600">${match[0]}</mark>`;
            result = result.slice(0, start) + highlighted + result.slice(end);
            offset += highlighted.length - match[0].length;
        });

        return result;
    };

    const examples = [
        { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', test: 'Contact us at info@example.com or support@test.org' },
        { name: 'URL', pattern: 'https?://[^\\s]+', test: 'Visit https://example.com and http://test.org' },
        { name: 'Phone', pattern: '\\d{3}-\\d{3}-\\d{4}', test: 'Call 123-456-7890 or 987-654-3210' },
    ];

    const loadExample = (example) => {
        setPattern(example.pattern);
        setTestString(example.test);
        setFlags({ g: true, i: false, m: false });
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Regex Tester</h1>
                    <p className="text-muted-foreground text-lg">
                        Test regular expressions with live results and highlighting
                    </p>
                </motion.div>

                {/* Pattern Input */}
                <div className="mb-6 space-y-3">
                    <label className="text-lg font-semibold">Regular Expression Pattern</label>
                    <div className="flex gap-2">
                        <span className="text-2xl text-muted-foreground">/</span>
                        <input
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            placeholder="Enter regex pattern..."
                            className="flex-1 p-3 rounded-lg bg-card border border-border font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-2xl text-muted-foreground">/</span>
                    </div>
                </div>

                {/* Flags */}
                <div className="mb-6 p-4 rounded-xl bg-card border border-border">
                    <label className="font-semibold mb-3 block">Flags</label>
                    <div className="flex gap-6">
                        {[
                            { key: 'g', label: 'Global (g)' },
                            { key: 'i', label: 'Case Insensitive (i)' },
                            { key: 'm', label: 'Multiline (m)' }
                        ].map((flag) => (
                            <label key={flag.key} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={flags[flag.key]}
                                    onChange={(e) => setFlags({ ...flags, [flag.key]: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span>{flag.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Test String */}
                <div className="mb-6 space-y-3">
                    <label className="text-lg font-semibold">Test String</label>
                    <textarea
                        value={testString}
                        onChange={(e) => setTestString(e.target.value)}
                        placeholder="Enter text to test against..."
                        className="w-full h-32 p-4 rounded-lg bg-card border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <Button onClick={testRegex} className="w-full mb-6">
                    Test Regex
                </Button>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-600">
                        {error}
                    </div>
                )}

                {/* Results */}
                {matches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 p-6 rounded-xl bg-green-500/10 border border-green-500/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-green-600">
                                Found {matches.length} match{matches.length !== 1 ? 'es' : ''}
                            </h3>
                        </div>
                        <div
                            className="p-4 rounded-lg bg-background border border-border"
                            dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                        />
                    </motion.div>
                )}

                {/* Examples */}
                <div className="p-6 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold mb-4">Quick Examples</h3>
                    <div className="space-y-2">
                        {examples.map((example) => (
                            <button
                                key={example.name}
                                onClick={() => loadExample(example)}
                                className="w-full p-3 rounded-lg bg-background hover:bg-accent border border-border text-left transition-colors"
                            >
                                <span className="font-medium">{example.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">- Click to load</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
