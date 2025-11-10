import { Node, mergeAttributes } from '@tiptap/core';

export const EmbedNode = Node.create({
  name: 'embed',

  group: 'block',

  atom: true,

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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-embed]',
      },
    ];
  },

  renderHTML({ node }) {
    const { type, url, embedCode } = node.attrs;
    
    let embedHtml = '';
    
    if (embedCode) {
      embedHtml = embedCode;
    } else {
      switch (type) {
        case 'twitter':
        case 'x':
          embedHtml = `<blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><p lang="en" dir="ltr"><a href="${url}">View this post on Twitter</a></p></blockquote>`;
          break;
        case 'instagram':
          embedHtml = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${url}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px auto; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"><a href="${url}" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank">View this post on Instagram</a></div></blockquote>`;
          break;
        case 'youtube':
          const youtubeId = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
          embedHtml = `<div class="video-responsive"><iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
          break;
        case 'facebook':
          embedHtml = `<div class="fb-post" data-href="${url}" data-width="500" data-show-text="true"><blockquote cite="${url}" class="fb-xfbml-parse-ignore"><a href="${url}">View post on Facebook</a></blockquote></div>`;
          break;
        case 'tiktok':
          embedHtml = `<blockquote class="tiktok-embed" cite="${url}"><a href="${url}">View TikTok</a></blockquote>`;
          break;
        case 'spotify':
          const spotifyUrl = url?.replace('spotify.com/', 'spotify.com/embed/');
          embedHtml = `<iframe src="${spotifyUrl}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
          break;
        default:
          embedHtml = `<a href="${url}" target="_blank">${url}</a>`;
      }
    }
    
    return [
      'div',
      {
        'data-embed': '',
        'data-type': type,
        'data-url': url,
        class: 'embed-block my-6',
      },
      ['div', { innerHTML: embedHtml }],
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.className = 'embed-wrapper my-6 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50';
      dom.setAttribute('data-embed', '');
      dom.setAttribute('data-type', node.attrs.type);
      dom.setAttribute('data-url', node.attrs.url || '');
      
      if (node.attrs.embedCode) {
        dom.innerHTML = node.attrs.embedCode;
      } else {
        // Generate embed HTML based on type
        const { type, url } = node.attrs;
        
        switch (type) {
          case 'twitter':
          case 'x':
            dom.innerHTML = `<blockquote class="twitter-tweet" data-dnt="true" data-theme="light"><p lang="en" dir="ltr"><a href="${url}">View this post on Twitter</a></p></blockquote>`;
            break;
          case 'instagram':
            dom.innerHTML = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${url}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px auto; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"><a href="${url}" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank">View this post on Instagram</a></div></blockquote>`;
            break;
          case 'youtube':
            const youtubeId = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
            dom.innerHTML = `<div class="video-responsive"><iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
            break;
          case 'facebook':
            dom.innerHTML = `<div class="fb-post" data-href="${url}" data-width="500" data-show-text="true"><blockquote cite="${url}" class="fb-xfbml-parse-ignore"><a href="${url}">View post on Facebook</a></blockquote></div>`;
            break;
          default:
            dom.innerHTML = `<div class="text-center p-4"><a href="${url}" target="_blank" class="text-primary underline">${type} embed: ${url}</a></div>`;
        }
      }
      
      return {
        dom,
      };
    };
  },
});
