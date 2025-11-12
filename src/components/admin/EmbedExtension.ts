import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { createElement } from 'react';

// Inline Embed Node for TipTap Editor
export const EmbedNode = Node.create({
  name: 'embed',

  group: 'block',

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      type: {
        default: 'twitter',
      },
      url: {
        default: null,
      },
      embedCode: {
        default: null,
      },
      caption: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-embed]',
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          return {
            type: element.getAttribute('data-type'),
            url: element.getAttribute('data-url'),
            embedCode: element.getAttribute('data-embed-code'),
            caption: element.getAttribute('data-caption'),
            width: element.getAttribute('data-width'),
            height: element.getAttribute('data-height'),
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { type, url, embedCode, caption, width, height } = node.attrs;
    
    // If we have embedCode, render it as raw HTML
    if (embedCode) {
      return [
        'div',
        mergeAttributes({
          'data-embed': '',
          'data-type': type,
          'data-url': url,
          'data-caption': caption,
          'data-width': width,
          'data-height': height,
          class: 'embed-block my-6',
        }),
        ['div', { class: 'embed-content', innerHTML: embedCode }],
        caption ? ['p', { class: 'embed-caption text-sm text-muted-foreground text-center mt-2 italic' }, caption] : '',
      ];
    }
    
    // Fallback: render placeholder
    return [
      'div',
      mergeAttributes({
        'data-embed': '',
        'data-type': type,
        'data-url': url,
        'data-caption': caption,
        'data-width': width,
        'data-height': height,
        class: 'embed-block my-6 p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20',
      }),
      ['div', { class: 'text-center space-y-2' }, 
        ['div', { class: 'text-sm font-medium text-muted-foreground' }, `${type.charAt(0).toUpperCase() + type.slice(1)} Embed`],
        ['div', { class: 'text-xs text-muted-foreground font-mono' }, url],
        ['div', { class: 'text-xs text-muted-foreground italic' }, 'Embed will render on published article']
      ],
      caption ? ['p', { class: 'embed-caption text-sm text-muted-foreground text-center mt-2 italic' }, caption] : '',
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'embed-wrapper my-6 p-6 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 hover:border-primary/50 transition-all cursor-pointer relative group';
      dom.setAttribute('data-embed', '');
      dom.setAttribute('data-type', node.attrs.type);
      dom.setAttribute('data-url', node.attrs.url || '');
      dom.contentEditable = 'false';
      
      // Create embed preview
      const preview = document.createElement('div');
      preview.className = 'text-center space-y-3';
      
      // Icon and type
      const typeLabel = document.createElement('div');
      typeLabel.className = 'flex items-center justify-center gap-2 text-primary font-medium';
      
      const icon = getEmbedIcon(node.attrs.type);
      typeLabel.innerHTML = `${icon} <span class="capitalize">${node.attrs.type} Embed</span>`;
      preview.appendChild(typeLabel);
      
      // URL display
      if (node.attrs.url) {
        const urlDisplay = document.createElement('div');
        urlDisplay.className = 'text-xs text-muted-foreground font-mono bg-background px-3 py-2 rounded truncate max-w-md mx-auto';
        urlDisplay.textContent = node.attrs.url;
        preview.appendChild(urlDisplay);
      }
      
      // Caption
      if (node.attrs.caption) {
        const captionDisplay = document.createElement('div');
        captionDisplay.className = 'text-sm text-muted-foreground italic';
        captionDisplay.textContent = node.attrs.caption;
        preview.appendChild(captionDisplay);
      }
      
      // Edit/Delete buttons
      const actions = document.createElement('div');
      actions.className = 'flex items-center justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors';
      editBtn.textContent = '✏️ Edit';
      editBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Open edit dialog (you can implement this)
        const newUrl = prompt('Enter new URL:', node.attrs.url);
        if (newUrl) {
          const pos = getPos();
          if (typeof pos === 'number') {
            editor.commands.updateAttributes('embed', { url: newUrl });
          }
        }
      };
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors';
      deleteBtn.textContent = '🗑️ Delete';
      deleteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Delete this embed?')) {
          const pos = getPos();
          if (typeof pos === 'number') {
            editor.commands.deleteRange({ from: pos, to: pos + node.nodeSize });
          }
        }
      };
      
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      preview.appendChild(actions);
      
      // Info text
      const info = document.createElement('div');
      info.className = 'text-xs text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transition-opacity';
      info.textContent = '💡 This embed will render on the published article';
      preview.appendChild(info);
      
      dom.appendChild(preview);
      
      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'embed') {
            return false;
          }
          return true;
        },
      };
    };
  },

  addCommands() {
    return {
      setEmbed: (attributes: any) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        });
      },
    } as any;
  },
});

// Helper function to get emoji icons for different platforms
function getEmbedIcon(type: string): string {
  const icons: Record<string, string> = {
    instagram: '📷',
    twitter: '🐦',
    x: '🐦',
    youtube: '▶️',
    facebook: '👥',
    tiktok: '🎵',
    vimeo: '🎬',
    spotify: '🎧',
    soundcloud: '🔊',
    codepen: '💻',
    'google-maps': '🗺️',
    maps: '🗺️',
    custom: '🔗',
  };
  return icons[type.toLowerCase()] || '🔗';
}

// Export a command to insert embeds easily
export const insertEmbed = (editor: any, type: string, url: string, embedCode?: string, caption?: string) => {
  editor.commands.setEmbed({
    type,
    url,
    embedCode,
    caption,
  });
};
