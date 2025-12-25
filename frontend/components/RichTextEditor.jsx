"use client";
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
    Code, Quote, Undo, Redo, ImageIcon, Link as LinkIcon,
    ListTree, Play, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CodeBlockComponent from './CodeBlockComponent';

// Initialize lowlight with common languages (safer than 'all')
const lowlight = createLowlight(common);

export default function RichTextEditor({ content, onChange, placeholder = "Start writing..." }) {
    const [showTOCDialog, setShowTOCDialog] = useState(false);
    const [selectedHeadings, setSelectedHeadings] = useState([2, 3]); // Default H2 and H3

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Disable default code block
            }),
            CodeBlockLowlight.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent);
                },
            }).configure({
                lowlight,
                defaultLanguage: 'javascript',
            }),
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none min-h-[300px] max-w-none p-4',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    // Generate Table of Contents
    const generateTOC = () => {
        const json = editor.getJSON();
        const headings = [];

        // Extract headings from content
        const extractHeadings = (node, level = 0) => {
            if (node.type === 'heading' && selectedHeadings.includes(node.attrs.level)) {
                const text = node.content?.[0]?.text || '';
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                headings.push({
                    level: node.attrs.level,
                    text,
                    id
                });
            }
            if (node.content) {
                node.content.forEach(child => extractHeadings(child, level + 1));
            }
        };

        extractHeadings(json);

        if (headings.length === 0) {
            alert('No headings found! Add some headings (H2, H3, etc.) to your content first.');
            return;
        }

        // Generate TOC HTML
        let tocHTML = '<div class="table-of-contents"><h2>Table of Contents</h2><ul>';
        let currentLevel = headings[0].level;

        headings.forEach((heading, index) => {
            const indent = (heading.level - 2) * 20; // Indent based on level
            if (heading.level > currentLevel) {
                tocHTML += '<ul>';
            } else if (heading.level < currentLevel) {
                tocHTML += '</ul>';
            }
            tocHTML += `<li style="margin-left: ${indent}px"><a href="#${heading.id}">${heading.text}</a></li>`;
            currentLevel = heading.level;
        });

        tocHTML += '</ul></div>';

        // Insert TOC at current cursor position
        editor.chain().focus().insertContent(tocHTML).run();
        setShowTOCDialog(false);
    };

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
            {/* Sticky Toolbar */}
            <div className="sticky top-0 z-30 bg-card border-b border-border">
                <div className="flex flex-wrap items-center gap-1 p-2">
                    {/* Text Formatting */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        variant={editor.isActive('bold') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        variant={editor.isActive('italic') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Headings */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 px-2"
                        title="Heading 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 px-2"
                        title="Heading 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 px-2"
                        title="Heading 3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Lists */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Code & Quote */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Code Block"
                    >
                        <Code className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Quote"
                    >
                        <Quote className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Media & Links */}
                    <Button
                        type="button"
                        onClick={addImage}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Insert Image"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={addLink}
                        variant={editor.isActive('link') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Insert Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* TOC */}
                    <Button
                        type="button"
                        onClick={() => setShowTOCDialog(true)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Generate Table of Contents"
                    >
                        <ListTree className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Undo/Redo */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Undo"
                    >
                        <Undo className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Redo"
                    >
                        <Redo className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* TOC Dialog */}
            {showTOCDialog && (
                <div className="p-4 border-b border-border bg-muted/30">
                    <h3 className="text-sm font-semibold mb-3">Select Heading Levels for TOC:</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {[1, 2, 3, 4, 5, 6].map(level => (
                            <label key={level} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedHeadings.includes(level)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedHeadings([...selectedHeadings, level].sort());
                                        } else {
                                            setSelectedHeadings(selectedHeadings.filter(h => h !== level));
                                        }
                                    }}
                                    className="rounded border-border"
                                />
                                <span className="text-sm">H{level}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            size="sm"
                            onClick={generateTOC}
                            disabled={selectedHeadings.length === 0}
                        >
                            Generate TOC
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setShowTOCDialog(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
