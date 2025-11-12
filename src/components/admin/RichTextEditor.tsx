import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import TiptapUnderline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { EmbedNode } from './EmbedExtension';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmbedManager } from './EmbedManager';
import type { Embed } from '@/lib/api/types';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Type,
  Video,
  Table as TableIcon,
  Plus,
  Minus
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = "Start writing...", className = "" }: RichTextEditorProps) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [inlineEmbeds, setInlineEmbeds] = useState<Embed[]>([]);
  
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapUnderline,
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2 bg-gray-100 font-bold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2',
        },
      }),
      CharacterCount,
      EmbedNode,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain');
        if (!text) return false;

        // Check if pasted text is a social media URL
        const twitterMatch = text.match(/https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
        const instagramMatch = text.match(/https?:\/\/(www\.)?instagram\.com\/(p|reel)\/([^\/\?]+)/);
        const facebookMatch = text.match(/https?:\/\/(www\.)?facebook\.com\/[^\/]+\/(posts|videos)\/\d+/);
        const youtubeMatch = text.match(/https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);

        if (twitterMatch) {
          event.preventDefault();
          const tweetId = twitterMatch[2];
          const embedHtml = `<iframe border="0" frameborder="0" height="500" width="550" src="https://twitframe.com/show?url=${encodeURIComponent(text)}" style="max-width: 100%; margin: 20px auto; display: block;"></iframe>`;
          editor?.commands.insertContent(embedHtml);
          return true;
        }

        if (instagramMatch) {
          event.preventDefault();
          const postId = instagramMatch[3];
          const embedHtml = `<iframe src="https://www.instagram.com/p/${postId}/embed/" width="540" height="700" frameborder="0" scrolling="no" allowtransparency="true" style="max-width: 100%; margin: 20px auto; display: block; border: 1px solid #dbdbdb; border-radius: 3px;"></iframe>`;
          editor?.commands.insertContent(embedHtml);
          return true;
        }

        if (facebookMatch) {
          event.preventDefault();
          const fbUrl = encodeURIComponent(text);
          const embedHtml = `<iframe src="https://www.facebook.com/plugins/post.php?href=${fbUrl}&width=500&show_text=true" width="500" height="600" style="border:none;overflow:hidden;max-width:100%;margin:20px auto;display:block;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
          editor?.commands.insertContent(embedHtml);
          return true;
        }

        if (youtubeMatch) {
          event.preventDefault();
          const videoId = youtubeMatch[3];
          const embedHtml = `<div class="video-responsive" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
          editor?.commands.insertContent(embedHtml);
          return true;
        }

        return false;
      },
    },
  });

  // Update editor content when content prop changes (for editing existing articles)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Convert to base64 for now (you can replace with actual upload to server)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        editor.chain().focus().setImage({ src: base64String, alt: imageAlt || file.name }).run();
        setImageUrl('');
        setImageAlt('');
        setImageFile(null);
        setImageDialogOpen(false);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
    }
  };

  const addImage = () => {
    if (imageFile) {
      handleImageUpload(imageFile);
    } else if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
      setImageUrl('');
      setImageAlt('');
      setImageDialogOpen(false);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  const handleImagePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleImageUpload(file);
        }
      }
    }
  };



  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph')}
            title="Paragraph"
          >
            <Type className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Links */}
          <ToolbarButton
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              const { from, to } = editor.state.selection;
              const selectedText = editor.state.doc.textBetween(from, to);
              setLinkUrl(previousUrl || '');
              setLinkText(selectedText || '');
              setLinkDialogOpen(true);
            }}
            isActive={editor.isActive('link')}
            title="Add/Edit Link"
          >
            <Link className="h-4 w-4" />
          </ToolbarButton>
          
          {editor.isActive('link') && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
            >
              <span className="text-xs font-bold">🔗✕</span>
            </ToolbarButton>
          )}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Media */}
          <ToolbarButton
            onClick={() => setImageDialogOpen(true)}
            title="Insert Image"
          >
            <Image className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => setEmbedDialogOpen(true)}
            title="Insert Embed (Twitter, Instagram, YouTube, etc.)"
          >
            <Video className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Table */}
          <ToolbarButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </ToolbarButton>
          
          {editor.isActive('table') && (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                title="Add Column Before"
              >
                <Plus className="h-3 w-3" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                title="Add Column After"
              >
                <Plus className="h-3 w-3" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteColumn().run()}
                title="Delete Column"
              >
                <Minus className="h-3 w-3" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().addRowBefore().run()}
                title="Add Row Before"
              >
                <Plus className="h-3 w-3" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().addRowAfter().run()}
                title="Add Row After"
              >
                <Plus className="h-3 w-3" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteRow().run()}
                title="Delete Row"
              >
                <Minus className="h-3 w-3" />
              </ToolbarButton>
              
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteTable().run()}
                title="Delete Table"
              >
                <span className="text-xs font-bold">✕</span>
              </ToolbarButton>
            </>
          )}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div 
        className="min-h-[300px] max-h-[600px] overflow-y-auto"
        onDrop={handleImageDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handleImagePaste}
      >
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:p-4"
        />
      </div>

      {/* Footer with character count */}
      <div className="border-t bg-muted/30 px-4 py-2.5 text-xs">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">
              {editor.storage.characterCount?.characters()?.toLocaleString() || 0} characters
            </span>
            <span className="text-muted-foreground">
              {editor.storage.characterCount?.words()?.toLocaleString() || 0} words
            </span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">
            💡 Use Video button (📹) for inline embeds
          </span>
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>
              Upload an image or paste a URL. You can also drag & drop images directly into the editor!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-file">Upload Image</Label>
              <div className="mt-2">
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImageUrl(''); // Clear URL if file is selected
                    }
                  }}
                  className="cursor-pointer"
                />
                {imageFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or use URL
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageFile(null); // Clear file if URL is entered
                }}
                className="mt-2"
                disabled={!!imageFile}
              />
            </div>
            
            <div>
              <Label htmlFor="image-alt">Alt Text (for accessibility)</Label>
              <Input
                id="image-alt"
                placeholder="Describe the image"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setImageDialogOpen(false);
              setImageFile(null);
              setImageUrl('');
              setImageAlt('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={addImage} 
              disabled={(!imageUrl && !imageFile) || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Insert Image'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Link</DialogTitle>
            <DialogDescription>
              Create a hyperlink to another page or website
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-text">Link Text</Label>
              <Input
                id="link-text"
                placeholder="Click here"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The text that will be displayed (leave empty to use selected text)
              </p>
            </div>
            <div>
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The destination URL (must start with http:// or https://)
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <input
                type="checkbox"
                id="link-new-tab"
                defaultChecked
                className="h-4 w-4"
              />
              <Label htmlFor="link-new-tab" className="text-sm cursor-pointer">
                Open in new tab (recommended for external links)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (!linkUrl) return;
                
                // Validate URL
                if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
                  alert('URL must start with http:// or https://');
                  return;
                }
                
                const { from, to } = editor.state.selection;
                const hasSelection = from !== to;
                
                if (linkText && !hasSelection) {
                  // Insert new text with link
                  editor
                    .chain()
                    .focus()
                    .insertContent(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`)
                    .run();
                } else {
                  // Apply link to selection
                  editor
                    .chain()
                    .focus()
                    .setLink({ href: linkUrl, target: '_blank', rel: 'noopener noreferrer' })
                    .run();
                }
                
                setLinkDialogOpen(false);
                setLinkUrl('');
                setLinkText('');
              }}
              disabled={!linkUrl}
            >
              {editor.isActive('link') ? 'Update Link' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embed Dialog - Using EmbedManager for better UX */}
      <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Insert Social Media Embed</DialogTitle>
            <DialogDescription>
              Add Instagram, YouTube, Twitter, TikTok, Spotify, Facebook embeds directly into your article.
            </DialogDescription>
          </DialogHeader>
          <EmbedManager
            embeds={inlineEmbeds}
            onChange={setInlineEmbeds}
            mode="inline"
            onInsertInline={(embedHtml) => {
              // Insert the embed HTML into the editor at cursor position
              editor.chain().focus().insertContent(embedHtml).run();
              setEmbedDialogOpen(false);
              setInlineEmbeds([]); // Clear after insertion
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEmbedDialogOpen(false);
              setInlineEmbeds([]);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table Styles */}
      <style>{`
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
        }

        .ProseMirror td,
        .ProseMirror th {
          min-width: 1em;
          border: 1px solid #ddd;
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f3f4f6;
        }

        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }

        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #adf;
          pointer-events: none;
        }

        .ProseMirror.resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;