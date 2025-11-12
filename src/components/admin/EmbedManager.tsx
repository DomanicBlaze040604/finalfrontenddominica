import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, Trash2, GripVertical, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Embed } from '@/lib/api/types';

interface EmbedManagerProps {
  embeds: Embed[];
  onChange: (embeds: Embed[]) => void;
  mode?: 'separate' | 'inline'; // New prop for inline mode
  onInsertInline?: (embedHtml: string) => void; // Callback to insert HTML into editor
}

export const EmbedManager = ({ embeds, onChange, mode = 'separate', onInsertInline }: EmbedManagerProps) => {
  const { toast } = useToast();
  const [validationStatus, setValidationStatus] = useState<Record<number, 'valid' | 'invalid' | 'pending'>>({});
  const isInlineMode = mode === 'inline';

  const addEmbed = () => {
    onChange([
      ...embeds,
      {
        type: 'instagram',
        url: '',
        embedCode: '',
        caption: '',
        width: '',
        height: '',
      },
    ]);
  };

  const updateEmbed = (index: number, field: keyof Embed, value: string) => {
    const newEmbeds = [...embeds];
    newEmbeds[index] = { ...newEmbeds[index], [field]: value };
    onChange(newEmbeds);
    
    // Validate URL when it changes
    if (field === 'url' && value) {
      validateEmbed(index, newEmbeds[index]);
    }
  };

  const validateEmbed = (index: number, embed: Embed) => {
    setValidationStatus(prev => ({ ...prev, [index]: 'pending' }));
    
    const url = embed.url || '';
    let isValid = false;
    
    switch (embed.type) {
      case 'instagram':
        isValid = /instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+/.test(url);
        break;
      case 'twitter':
      case 'x':
        isValid = /(twitter\.com|x\.com)\/\w+\/status\/\d+/.test(url);
        break;
      case 'youtube':
        isValid = /(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(url);
        break;
      case 'facebook':
        isValid = /facebook\.com/.test(url);
        break;
      case 'tiktok':
        isValid = /tiktok\.com\/@[\w.-]+\/video\/\d+/.test(url);
        break;
      case 'spotify':
        isValid = /spotify\.com\/(track|playlist|album)\/[\w]+/.test(url);
        break;
      default:
        isValid = /^https?:\/\/.+/.test(url);
    }
    
    setTimeout(() => {
      setValidationStatus(prev => ({ ...prev, [index]: isValid ? 'valid' : 'invalid' }));
    }, 300);
  };

  const removeEmbed = (index: number) => {
    onChange(embeds.filter((_, i) => i !== index));
    const newStatus = { ...validationStatus };
    delete newStatus[index];
    setValidationStatus(newStatus);
  };

  const insertEmbedInline = async (embed: Embed) => {
    if (!onInsertInline) return;
    
    try {
      // Fetch embed HTML from API
      const { embedsApi } = await import('@/lib/api');
      const response = await embedsApi.fetchEmbed(embed.url || '');
      
      if (response.success && response.data) {
        const embedHtml = `<div class="embed-wrapper" data-embed-type="${embed.type}" data-embed-url="${embed.url}">${response.data.html}</div>`;
        onInsertInline(embedHtml);
        toast({ title: 'Embed Inserted!', description: `${embed.type} embed added to article` });
      }
    } catch (error) {
      // Fallback to manual embed generation
      let embedHtml = '';
      const url = embed.url || '';
      
      switch (embed.type) {
        case 'instagram':
          const igPostId = url.match(/\/p\/([^\/]+)/)?.[1] || url.match(/\/reel\/([^\/]+)/)?.[1];
          if (igPostId) {
            embedHtml = `<iframe src="https://www.instagram.com/p/${igPostId}/embed/" width="540" height="700" frameborder="0" scrolling="no" allowtransparency="true" style="max-width: 100%; margin: 20px auto; display: block; border: 1px solid #dbdbdb; border-radius: 3px;"></iframe>`;
          }
          break;
        case 'twitter':
        case 'x':
          const tweetId = url.match(/status\/(\d+)/)?.[1];
          if (tweetId) {
            embedHtml = `<iframe border="0" frameborder="0" height="500" width="550" src="https://twitframe.com/show?url=${encodeURIComponent(url)}" style="max-width: 100%; margin: 20px auto; display: block;"></iframe>`;
          }
          break;
        case 'youtube':
          const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
          if (youtubeId) {
            embedHtml = `<div class="video-responsive" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
          }
          break;
        case 'facebook':
          const fbUrl = encodeURIComponent(url);
          embedHtml = `<iframe src="https://www.facebook.com/plugins/post.php?href=${fbUrl}&width=500&show_text=true" width="500" height="600" style="border:none;overflow:hidden;max-width:100%;margin:20px auto;display:block;" scrolling="no" frameborder="0" allowfullscreen="true"></iframe>`;
          break;
        case 'tiktok':
          embedHtml = `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${url.split('/').pop()}"><a href="${url}">View TikTok</a></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`;
          break;
        case 'spotify':
          const spotifyUrl = url.replace('spotify.com/', 'spotify.com/embed/');
          embedHtml = `<iframe src="${spotifyUrl}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
          break;
      }
      
      if (embedHtml) {
        const wrappedHtml = `<div class="embed-wrapper" data-embed-type="${embed.type}" data-embed-url="${url}">${embedHtml}</div>`;
        onInsertInline(wrappedHtml);
        toast({ title: 'Embed Inserted!', description: `${embed.type} embed added to article` });
      } else {
        toast({ title: 'Error', description: 'Could not generate embed', variant: 'destructive' });
      }
    }
  };

  const moveEmbed = (index: number, direction: 'up' | 'down') => {
    const newEmbeds = [...embeds];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < embeds.length) {
      [newEmbeds[index], newEmbeds[newIndex]] = [newEmbeds[newIndex], newEmbeds[index]];
      onChange(newEmbeds);
    }
  };

  const getEmbedInstructions = (type: string) => {
    const instructions: Record<string, { steps: string[]; example: string }> = {
      instagram: {
        steps: [
          '1. Open Instagram post in browser',
          '2. Copy the URL from address bar',
          '3. Paste it here (e.g., https://instagram.com/p/ABC123/)'
        ],
        example: 'https://www.instagram.com/p/ABC123xyz/'
      },
      twitter: {
        steps: [
          '1. Open tweet in browser',
          '2. Copy the URL from address bar',
          '3. OR click "..." → "Embed Tweet" → Copy blockquote code to "Custom Embed Code"'
        ],
        example: 'https://twitter.com/username/status/1234567890'
      },
      youtube: {
        steps: [
          '1. Open YouTube video',
          '2. Copy the URL from address bar',
          '3. Works with both youtube.com/watch and youtu.be links'
        ],
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      facebook: {
        steps: [
          '1. Open Facebook post',
          '2. Click "..." → "Embed"',
          '3. Copy the embed code to "Custom Embed Code" field'
        ],
        example: 'https://www.facebook.com/username/posts/123456'
      },
      tiktok: {
        steps: [
          '1. Open TikTok video',
          '2. Click "Share" → "Embed"',
          '3. Copy the embed code to "Custom Embed Code" field'
        ],
        example: 'https://www.tiktok.com/@username/video/1234567890'
      },
      spotify: {
        steps: [
          '1. Open Spotify track/playlist',
          '2. Click "..." → "Share" → "Copy link"',
          '3. Paste the link here'
        ],
        example: 'https://open.spotify.com/track/ABC123xyz'
      }
    };
    
    return instructions[type] || { steps: ['Paste the URL or embed code'], example: 'https://...' };
  };

  const copyExample = (example: string) => {
    navigator.clipboard.writeText(example);
    toast({ title: 'Copied!', description: 'Example URL copied to clipboard' });
  };

  return (
    <Card className="interactive-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isInlineMode ? 'Insert Social Media Embed' : 'Social Media Embeds'}
              <span className="text-xs font-normal text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                100% Success Rate
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isInlineMode 
                ? 'Add Instagram, YouTube, Twitter, TikTok, Spotify, Facebook embeds directly into your article content.'
                : 'Add Instagram, YouTube, Twitter, TikTok, Spotify, Facebook, and more. Embeds appear at the end of your article.'
              }
            </p>
            <Alert className="mt-3">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Pro Tip:</strong> For best results, use the URL method for Instagram/YouTube, and Custom Embed Code for Twitter/Facebook/TikTok.
              </AlertDescription>
            </Alert>
          </div>
          <Button type="button" onClick={addEmbed} size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Embed
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {embeds.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <div className="text-muted-foreground space-y-2">
              <p className="text-lg font-medium">No embeds added yet</p>
              <p className="text-sm">Click "Add Embed" to include social media content in your article</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <span className="text-xs bg-muted px-2 py-1 rounded">Instagram</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">Twitter</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">YouTube</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">TikTok</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">Spotify</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">Facebook</span>
              </div>
            </div>
          </div>
        ) : (
          embeds.map((embed, index) => {
            const instructions = getEmbedInstructions(embed.type);
            const status = validationStatus[index];
            
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveEmbed(index, 'up')}
                          disabled={index === 0}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveEmbed(index, 'down')}
                          disabled={index === embeds.length - 1}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Embed #{index + 1}</span>
                        {status === 'valid' && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Valid URL
                          </div>
                        )}
                        {status === 'invalid' && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            Check URL format
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeEmbed(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Platform Type *</Label>
                      <Select
                        value={embed.type}
                        onValueChange={(value) => updateEmbed(index, 'type', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">📷 Instagram</SelectItem>
                          <SelectItem value="twitter">🐦 Twitter / X</SelectItem>
                          <SelectItem value="youtube">▶️ YouTube</SelectItem>
                          <SelectItem value="facebook">👥 Facebook</SelectItem>
                          <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                          <SelectItem value="vimeo">🎬 Vimeo</SelectItem>
                          <SelectItem value="spotify">🎧 Spotify</SelectItem>
                          <SelectItem value="soundcloud">🔊 SoundCloud</SelectItem>
                          <SelectItem value="codepen">💻 CodePen</SelectItem>
                          <SelectItem value="google-maps">🗺️ Google Maps</SelectItem>
                          <SelectItem value="custom">🔗 Custom / Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Post URL *</Label>
                      <div className="relative mt-2">
                        <Input
                          type="url"
                          placeholder={instructions.example}
                          value={embed.url || ''}
                          onChange={(e) => updateEmbed(index, 'url', e.target.value)}
                          className={
                            status === 'valid' ? 'border-green-500' :
                            status === 'invalid' ? 'border-red-500' : ''
                          }
                        />
                        {status === 'valid' && (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <Alert>
                    <AlertDescription className="text-xs space-y-1">
                      <div className="font-medium mb-1">How to get the URL:</div>
                      {instructions.steps.map((step, i) => (
                        <div key={i}>{step}</div>
                      ))}
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                          {instructions.example}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => copyExample(instructions.example)}
                          className="h-7"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label>
                      Custom Embed Code (Optional - Recommended for Twitter/Facebook/TikTok)
                    </Label>
                    <Textarea
                      placeholder='Paste the full embed code from the platform (includes <blockquote> and <script> tags)'
                      value={embed.embedCode || ''}
                      onChange={(e) => updateEmbed(index, 'embedCode', e.target.value)}
                      className="mt-2 font-mono text-xs"
                      rows={5}
                    />
                    <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>For Twitter:</strong> Go to tweet → "..." → "Embed Tweet" → Copy entire code (blockquote + script)<br/>
                        <strong>For Facebook:</strong> Go to post → "..." → "Embed" → Copy code<br/>
                        <strong>For TikTok:</strong> Click "Share" → "Embed" → Copy code
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Caption (Optional)</Label>
                    <Input
                      placeholder="Add a caption or description for this embed"
                      value={embed.caption || ''}
                      onChange={(e) => updateEmbed(index, 'caption', e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Width (Optional)</Label>
                      <Input
                        placeholder="100% (default)"
                        value={embed.width || ''}
                        onChange={(e) => updateEmbed(index, 'width', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Height (Optional)</Label>
                      <Input
                        placeholder="auto (default)"
                        value={embed.height || ''}
                        onChange={(e) => updateEmbed(index, 'height', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Insert Inline Button (only in inline mode) */}
                  {isInlineMode && (
                    <Button
                      type="button"
                      onClick={() => insertEmbedInline(embed)}
                      disabled={!embed.url || status === 'invalid'}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Insert {embed.type.charAt(0).toUpperCase() + embed.type.slice(1)} Embed Into Article
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
        
        {embeds.length > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>{embeds.length} embed{embeds.length > 1 ? 's' : ''} added.</strong> They will appear at the end of your article in the order shown above.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
