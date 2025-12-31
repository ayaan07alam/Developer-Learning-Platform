"use client";
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';

import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { common, createLowlight } from 'lowlight';
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
    Code, Quote, Undo, Redo, ImageIcon, Link as LinkIcon,
    ListTree, Strikethrough, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Minus, Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
    Eraser, Palette, Highlighter, Trash2, Plus, Grid,
    ArrowDown, ArrowRight, ArrowUp, ArrowLeft, Merge, Split
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import CodeBlockComponent from './CodeBlockComponent';
import CustomDialog from './CustomDialog';
import { useDialog } from '@/lib/useDialog';

// Initialize lowlight with common languages
const lowlight = createLowlight(common);

export default function RichTextEditor({ content, onChange, placeholder = "Start writing...", onRequestImage, onEditorReady }) {
    const [showTOCDialog, setShowTOCDialog] = useState(false);
    const [selectedHeadings, setSelectedHeadings] = useState([2, 3]); // Default H2 and H3
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const { showAlert, dialogState, handleClose, handleConfirm } = useDialog();

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
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Subscript,
            Superscript,
            Table && Table.configure ? Table.configure({
                resizable: true,
            }) : undefined,
            TableRow,
            TableHeader,
            TableCell,
            // Custom extension to allow divs with inline styles (for TOC)
            {
                name: 'customDiv',
                addGlobalAttributes() {
                    return [
                        {
                            types: ['div'],
                            attributes: {
                                style: {
                                    default: null,
                                    parseHTML: element => element.getAttribute('style'),
                                    renderHTML: attributes => {
                                        if (!attributes.style) return {};
                                        return { style: attributes.style };
                                    },
                                },
                            },
                        },
                    ];
                },
            },
        ].filter(Boolean),
        content,
        // CRITICAL: We need this to ensure content can be set externally later if needed
        onTransaction: ({ editor }) => {
            // Optional: track transaction
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onCreate: ({ editor }) => {
            if (onEditorReady) {
                onEditorReady(editor);
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose xl:prose-lg dark:prose-invert focus:outline-none min-h-[600px] max-w-none p-6',
            },
        },
    });

    // Also update reference if it changes (rare but possible)
    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        if (onRequestImage) {
            onRequestImage();
            return;
        }
        const url = window.prompt('Enter image URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);
        setLinkText(selectedText || '');
        setLinkUrl('');
        setShowLinkDialog(true);
    };

    const handleLinkInsert = () => {
        if (!linkUrl.trim()) {
            showAlert('Please enter a valid URL.', { title: 'Invalid URL' });
            return;
        }

        // If user provided custom text, update selection
        if (linkText.trim() && linkText !== editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)) {
            editor.chain().focus()
                .insertContent(linkText)
                .setTextSelection({ from: editor.state.selection.from - linkText.length, to: editor.state.selection.from })
                .setLink({ href: linkUrl })
                .run();
        } else {
            // Just apply link to existing selection
            editor.chain().focus().setLink({ href: linkUrl }).run();
        }

        setShowLinkDialog(false);
        setLinkUrl('');
        setLinkText('');
    };

    const setTextColor = () => {
        const color = window.prompt('Enter color (e.g., #FF0000 or red):');
        if (color) {
            editor.chain().focus().setColor(color).run();
        }
    };

    const setHighlight = () => {
        const color = window.prompt('Enter highlight color (e.g., #FFFF00 or yellow):');
        if (color) {
            editor.chain().focus().setHighlight({ color }).run();
        }
    };

    // Generate Table of Contents
    const generateTOC = () => {
        // First, save the current cursor position
        const { from } = editor.state.selection;

        const json = editor.getJSON();
        const headings = [];

        // Recursively extract headings from TipTap JSON structure
        const extractHeadings = (node) => {
            if (node.type === 'heading' && selectedHeadings.includes(node.attrs?.level)) {
                // Get text content from the heading
                let text = '';
                if (node.content) {
                    node.content.forEach(child => {
                        if (child.type === 'text') {
                            text += child.text || '';
                        }
                    });
                }

                if (text.trim()) {
                    const level = node.attrs.level;
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    headings.push({ level, text: text.trim(), id });
                }
            }

            // Recursively check children
            if (node.content) {
                node.content.forEach(child => extractHeadings(child));
            }
        };

        extractHeadings(json);

        if (headings.length === 0) {
            showAlert('No headings found! Add some headings (H2, H3, etc.) to your content first.', {
                title: 'No Headings'
            });
            return;
        }

        // STEP 1: Add IDs to headings by updating HTML while preserving structure
        const html = editor.getHTML();
        let updatedHTML = html;

        headings.forEach(({ level, text, id }) => {
            const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Match headings - handles both with and without existing id attributes
            const patterns = [
                // Heading without any id
                new RegExp(`<h${level}((?!\\sid=)[^>]*)>\\s*${escapedText}\\s*</h${level}>`, 'gi'),
                // Heading with existing id - replace it
                new RegExp(`<h${level}([^>]*)\\sid="[^"]*"([^>]*)>\\s*${escapedText}\\s*</h${level}>`, 'gi')
            ];

            patterns.forEach(pattern => {
                updatedHTML = updatedHTML.replace(pattern, `<h${level} id="${id}">${text}</h${level}>`);
            });
        });

        // Update content with IDs (this will reset cursor)
        editor.commands.setContent(updatedHTML);

        // STEP 2: Restore cursor position and insert TOC there
        // Use a small timeout to ensure content is updated
        setTimeout(() => {
            // Try to restore position, or go to start if position invalid
            try {
                editor.commands.setTextSelection(from);
            } catch (e) {
                // If position is invalid, go to start
                editor.commands.setTextSelection(0);
            }

            // Generate improved TOC with icon and view more/less
            const showViewMore = headings.length > 10;
            const visibleHeadings = showViewMore ? headings.slice(0, 10) : headings;
            const hiddenHeadings = showViewMore ? headings.slice(10) : [];

            let tocHTML = '<table data-toc="true" style="width:100%;background:#f3f0ff;border:1px solid #e0d7ff;padding:24px;border-radius:12px;margin:32px 0;box-shadow:0 1px 3px rgba(0,0,0,0.05);border-collapse:separate;border-spacing:0;"><tr><td><div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #e0d7ff;"><span style="font-size:20px;color:#6b21a8;">☰</span><span style="font-size:18px;font-weight:600;color:#1f2937;">Table of Contents</span></div><ul style="list-style:none;padding:0;margin:0;">';

            visibleHeadings.forEach((heading, index) => {
                const indent = (heading.level - 2) * 20;
                const icon = heading.level === 2 ? '▸' : '•';
                const marginStyle = indent > 0 ? ` style="margin-left:${indent}px;margin-top:12px;"` : ' style="margin-top:12px;"';
                tocHTML += `<li${marginStyle}><a href="#${heading.id}" style="color:#7c3aed;text-decoration:none;display:inline-block;padding:4px 0;font-size:15px;">${icon} ${heading.text}</a></li>`;
            });

            if (showViewMore) {
                tocHTML += '<div id="toc-hidden-items" style="display:none;">';
                hiddenHeadings.forEach((heading) => {
                    const indent = (heading.level - 2) * 20;
                    const icon = heading.level === 2 ? '▸' : '•';
                    const marginStyle = indent > 0 ? ` style="margin-left:${indent}px;margin-top:12px;"` : ' style="margin-top:12px;"';
                    tocHTML += `<li${marginStyle}><a href="#${heading.id}" style="color:#7c3aed;text-decoration:none;display:inline-block;padding:4px 0;font-size:15px;">${icon} ${heading.text}</a></li>`;
                });
                tocHTML += '</div>';
                tocHTML += `<button id="toc-toggle-btn" style="background:transparent;color:#7c3aed;border:none;padding:8px 0;cursor:pointer;font-size:14px;font-weight:500;margin-top:16px;" onclick="const hidden = document.getElementById('toc-hidden-items'); const btn = document.getElementById('toc-toggle-btn'); if (hidden.style.display === 'none') { hidden.style.display = 'block'; btn.textContent = 'View less ↑'; } else { hidden.style.display = 'none'; btn.textContent = 'View all ↓'; }">View all ↓</button>`;
            }

            tocHTML += '</ul></td></tr></table>';

            // Insert TOC at current cursor position
            editor.chain().focus().insertContent(tocHTML).run();
            setShowTOCDialog(false);
        }, 100);
    };

    return (
        <div className="border border-border rounded-lg bg-card flex flex-col overflow-hidden" style={{ height: '900px' }}>
            {/* Sticky Toolbar - Fixed at top */}
            <div className="flex-none bg-card border-b border-border shadow-sm">
                <div className="flex flex-wrap items-center gap-1 p-2">
                    {/* Text Formatting */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        variant={editor.isActive('bold') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        variant={editor.isActive('italic') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        variant={editor.isActive('underline') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        variant={editor.isActive('strike') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Strikethrough"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Colors */}
                    <Button
                        type="button"
                        onClick={setTextColor}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Text Color"
                    >
                        <Palette className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={setHighlight}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Highlight Color"
                    >
                        <Highlighter className="w-4 h-4" />
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

                    {/* Alignment */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Justify"
                    >
                        <AlignJustify className="w-4 h-4" />
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

                    {/* Superscript/Subscript */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        variant={editor.isActive('superscript') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Superscript"
                    >
                        <SuperscriptIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        variant={editor.isActive('subscript') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Subscript"
                    >
                        <SubscriptIcon className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    {/* Horizontal Rule */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Horizontal Rule"
                    >
                        <Minus className="w-4 h-4" />
                    </Button>

                    {/* Clear Formatting */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Clear Formatting"
                    >
                        <Eraser className="w-4 h-4" />
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

                    {/* Table */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        variant={editor.isActive('table') ? 'default' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Insert Table"
                    >
                        <Grid className="w-4 h-4" />
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

                {/* Table Context Menu - only visible when table is active */}
                {editor.isActive('table') && (
                    <div className="flex flex-wrap items-center gap-1 p-2 border-t border-border bg-muted/20">
                        <span className="text-xs text-muted-foreground mr-2 font-medium">Table Tools:</span>

                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().addColumnBefore().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Add Column Before"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Col Left
                        </Button>
                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Add Column After"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Col Right
                        </Button>
                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().deleteColumn().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                            title="Delete Column"
                        >
                            <Trash2 className="w-3 h-3 mr-1" /> Col
                        </Button>

                        <div className="w-px h-4 bg-border mx-1" />

                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().addRowBefore().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Add Row Before"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Row Above
                        </Button>
                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Add Row After"
                        >
                            <Plus className="w-3 h-3 mr-1" /> Row Below
                        </Button>
                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().deleteRow().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
                            title="Delete Row"
                        >
                            <Trash2 className="w-3 h-3 mr-1" /> Row
                        </Button>

                        <div className="w-px h-4 bg-border mx-1" />

                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
                            variant={editor.isActive('tableHeader') ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Toggle Header Column"
                        >
                            H-Col
                        </Button>
                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                            variant={editor.isActive('tableHeader') ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Toggle Header Row"
                        >
                            H-Row
                        </Button>
                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeaderCell().run()}
                            variant={'ghost'}
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Toggle Header Cell"
                        >
                            H-Cell
                        </Button>

                        <div className="w-px h-4 bg-border mx-1" />

                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().mergeCells().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Merge Cells"
                        >
                            Merge
                        </Button>
                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().splitCell().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            title="Split Cell"
                        >
                            Split
                        </Button>

                        <div className="w-px h-4 bg-border mx-1" />

                        <Button
                            type="button"
                            onClick={() => editor.chain().focus().deleteTable().run()}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                            title="Delete Table"
                        >
                            Delete Table
                        </Button>
                    </div>
                )}
            </div>

            {/* TOC Dialog */}
            {
                showTOCDialog && (
                    <div className="flex-none p-4 border-b border-border bg-muted/30">
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
                )
            }

            {/* Link Dialog */}
            {
                showLinkDialog && (
                    <div className="flex-none p-4 border-b border-border bg-muted/30">
                        <h3 className="text-sm font-semibold mb-3">Insert Link</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Link Text (optional)</label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Leave empty to use selection"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    autoFocus={!linkText}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">URL *</label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com or /internal-link"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    autoFocus={!!linkText}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleLinkInsert();
                                        }
                                    }}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    💡 Tip: Use /blogs/slug for internal links
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleLinkInsert}
                                >
                                    Insert Link
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setShowLinkDialog(false);
                                        setLinkUrl('');
                                        setLinkText('');
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }


            {/* Editor - Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} />
            </div>

            {/* Custom Dialog */}
            <CustomDialog
                isOpen={dialogState.isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={dialogState.title}
                message={dialogState.message}
                type={dialogState.type}
                confirmText={dialogState.confirmText}
                cancelText={dialogState.cancelText}
                variant={dialogState.variant}
            />
        </div >
    );
}


