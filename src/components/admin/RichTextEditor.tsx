import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import { EmbedNode } from './EmbedExtension';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Video
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
  const [embedType, setEmbedType] = useState('twitter');
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
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

  const addEmbed = () => {
    if (embedUrl || embedCode) {
      let embedHtml = '';
      
      if (embedCode) {
        embedHtml = embedCode;
      } else {
        switch (embedType) {
          case 'twitter':
          case 'x':
            embedHtml = `<blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><p lang="en" dir="ltr"><a href="${embedUrl}">View this post on Twitter</a></p></blockquote>`;
            break;
          case 'instagram':
            embedHtml = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${embedUrl}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px auto; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"><a href="${embedUrl}" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank">View this post on Instagram</a></div></blockquote>`;
            break;
          case 'youtube':
            const youtubeId = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
            embedHtml = `<div class="video-responsive"><iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
            break;
          case 'facebook':
            embedHtml = `<div class="fb-post" data-href="${embedUrl}" data-width="500" data-show-text="true"><blockquote cite="${embedUrl}" class="fb-xfbml-parse-ignore"><a href="${embedUrl}">View post on Facebook</a></blockquote></div>`;
            break;
          case 'tiktok':
            embedHtml = `<blockquote class="tiktok-embed" cite="${embedUrl}"><a href="${embedUrl}">View TikTok</a></blockquote>`;
            break;
          case 'spotify':
            const spotifyUrl = embedUrl.replace('spotify.com/', 'spotify.com/embed/');
            embedHtml = `<iframe src="${spotifyUrl}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
            break;
          default:
            embedHtml = `<div class="embed-container"><a href="${embedUrl}" target="_blank">${embedUrl}</a></div>`;
        }
      }
      
      // Wrap in a div to preserve as HTML
      const wrappedHtml = `<div class="embed-wrapper" data-embed-type="${embedType}" data-embed-url="${embedUrl}">${embedHtml}</div>`;
      
      // Insert as raw HTML
      editor.chain().focus().insertContent(wrappedHtml).run();
      
      setEmbedUrl('');
      setEmbedCode('');
      setEmbedDialogOpen(false);
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

      {/* Embed Dialog */}
      <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Insert Social Media Embed</DialogTitle>
            <DialogDescription>
              Embed content from Twitter, Instagram, YouTube, TikTok, Spotify, and more.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="embed-type">Platform</Label>
              <Select value={embedType} onValueChange={setEmbedType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="custom">Custom Embed Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {embedType !== 'custom' ? (
              <div>
                <Label htmlFor="embed-url">Post URL *</Label>
                <Input
                  id="embed-url"
                  type="url"
                  placeholder="https://twitter.com/user/status/123..."
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the full URL of the post you want to embed
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="embed-code">Embed Code *</Label>
                <Textarea
                  id="embed-code"
                  placeholder='<iframe src="..." ...></iframe>'
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  className="mt-2 font-mono text-sm"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste the embed code from the platform
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmbedDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={addEmbed} 
              disabled={embedType === 'custom' ? !embedCode : !embedUrl}
            >
              Insert Embed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RichTextEditor;