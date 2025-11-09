import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import type { Embed } from '@/lib/api/types';

interface EmbedManagerProps {
  embeds: Embed[];
  onChange: (embeds: Embed[]) => void;
}

export const EmbedManager = ({ embeds, onChange }: EmbedManagerProps) => {
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
  };

  const removeEmbed = (index: number) => {
    onChange(embeds.filter((_, i) => i !== index));
  };

  const moveEmbed = (index: number, direction: 'up' | 'down') => {
    const newEmbeds = [...embeds];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < embeds.length) {
      [newEmbeds[index], newEmbeds[newIndex]] = [newEmbeds[newIndex], newEmbeds[index]];
      onChange(newEmbeds);
    }
  };

  return (
    <Card className="interactive-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Social Media Embeds</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add Instagram, YouTube, Twitter, TikTok, Spotify, and more
            </p>
          </div>
          <Button type="button" onClick={addEmbed} size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Embed
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {embeds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No embeds added yet</p>
            <p className="text-sm mt-1">Click "Add Embed" to get started</p>
          </div>
        ) : (
          embeds.map((embed, index) => (
            <Card key={index} className="border-2">
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
                    <span className="text-sm font-medium text-muted-foreground">
                      Embed #{index + 1}
                    </span>
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
                    <Label>Platform Type</Label>
                    <Select
                      value={embed.type}
                      onValueChange={(value) => updateEmbed(index, 'type', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter / X</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="vimeo">Vimeo</SelectItem>
                        <SelectItem value="spotify">Spotify</SelectItem>
                        <SelectItem value="soundcloud">SoundCloud</SelectItem>
                        <SelectItem value="codepen">CodePen</SelectItem>
                        <SelectItem value="google-maps">Google Maps</SelectItem>
                        <SelectItem value="custom">Custom / Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Post URL</Label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={embed.url || ''}
                      onChange={(e) => updateEmbed(index, 'url', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label>
                    Custom Embed Code (Optional)
                    <span className="text-xs text-muted-foreground ml-2">
                      Paste iframe or embed code from the platform
                    </span>
                  </Label>
                  <Textarea
                    placeholder='<iframe src="..." ...></iframe>'
                    value={embed.embedCode || ''}
                    onChange={(e) => updateEmbed(index, 'embedCode', e.target.value)}
                    className="mt-2 font-mono text-sm"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Caption (Optional)</Label>
                  <Input
                    placeholder="Add a caption or description"
                    value={embed.caption || ''}
                    onChange={(e) => updateEmbed(index, 'caption', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Width (Optional)</Label>
                    <Input
                      placeholder="100% or 560px"
                      value={embed.width || ''}
                      onChange={(e) => updateEmbed(index, 'width', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Height (Optional)</Label>
                    <Input
                      placeholder="auto or 315px"
                      value={embed.height || ''}
                      onChange={(e) => updateEmbed(index, 'height', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
