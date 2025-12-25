"use client";
import { useState } from 'react';
import { Plus, Trash2, GripVertical, HelpCircle } from 'lucide-react';

export default function FAQBuilder({ faqs = [], onChange }) {
    const [localFaqs, setLocalFaqs] = useState(faqs);

    const addFAQ = () => {
        const newFaq = {
            question: '',
            answer: '',
            displayOrder: localFaqs.length
        };
        const updated = [...localFaqs, newFaq];
        setLocalFaqs(updated);
        onChange(updated);
    };

    const updateFAQ = (index, field, value) => {
        const updated = localFaqs.map((faq, i) =>
            i === index ? { ...faq, [field]: value } : faq
        );
        setLocalFaqs(updated);
        onChange(updated);
    };

    const removeFAQ = (index) => {
        const updated = localFaqs.filter((_, i) => i !== index);
        // Update display order
        const reordered = updated.map((faq, i) => ({ ...faq, displayOrder: i }));
        setLocalFaqs(reordered);
        onChange(reordered);
    };

    const moveFAQ = (index, direction) => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === localFaqs.length - 1)
        ) {
            return;
        }

        const updated = [...localFaqs];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

        // Update display order
        const reordered = updated.map((faq, i) => ({ ...faq, displayOrder: i }));
        setLocalFaqs(reordered);
        onChange(reordered);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">FAQs</h3>
                    <span className="text-sm text-muted-foreground">
                        ({localFaqs.length} {localFaqs.length === 1 ? 'question' : 'questions'})
                    </span>
                </div>
                <button
                    type="button"
                    onClick={addFAQ}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add FAQ
                </button>
            </div>

            {localFaqs.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                    <HelpCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No FAQs added yet</p>
                    <button
                        type="button"
                        onClick={addFAQ}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                        Add Your First FAQ
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {localFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className="p-4 bg-card border border-border rounded-lg space-y-3"
                        >
                            {/* FAQ Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Question #{index + 1}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => moveFAQ(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                                        title="Move up"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveFAQ(index, 'down')}
                                        disabled={index === localFaqs.length - 1}
                                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                                        title="Move down"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeFAQ(index)}
                                        className="p-1 text-red-500 hover:text-red-600"
                                        title="Delete FAQ"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Question Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Question
                                </label>
                                <input
                                    type="text"
                                    value={faq.question}
                                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                    placeholder="Enter your question..."
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {/* Answer Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Answer
                                </label>
                                <textarea
                                    value={faq.answer}
                                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                    placeholder="Enter the answer..."
                                    rows="3"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
