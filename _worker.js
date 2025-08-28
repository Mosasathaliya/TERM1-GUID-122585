// This worker handles routing and static file serving for Cloudflare Pages
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  let filePath = url.pathname;

  // Default to index.html for root
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // Remove leading slash for file lookup
  filePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

  // Try to serve the file from the out directory
  try {
    const file = await getAssetFromKV({
      request,
      waitUntil(promise) {
        return promise;
      },
    });

    // Get the file extension for proper content type
    const extension = filePath.split('.').pop().toLowerCase();
    const contentType = getContentType(extension);
    
    // Return the file with appropriate headers
    return new Response(file.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    // If file not found, serve index.html for SPA routing
    if (e.status === 404) {
      try {
        const index = await getAssetFromKV({
          request: new Request(new URL('/index.html', request.url)),
          waitUntil(promise) {
            return promise;
          },
        });
        
        return new Response(index.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        });
      } catch (e) {
        return new Response('Not Found', { status: 404 });
      }
    }
    
    return new Response('Internal Server Error', { status: 500 });
  }
}

function getContentType(extension) {
  const mimeTypes = {
    'html': 'text/html; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'css': 'text/css; charset=utf-8',
    'json': 'application/json; charset=utf-8',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'webp': 'image/webp',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject',
    'otf': 'font/otf',
    'wasm': 'application/wasm',
    'webmanifest': 'application/manifest+json',
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

// This is a simplified version of the getAssetFromKV function
// In a real deployment, this would be provided by the @cloudflare/kv-asset-handler package
async function getAssetFromKV({ request }) {
  const url = new URL(request.url);
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.join('out', pathname);
  
  try {
    const file = await fetch(`file://${__dirname}/${filePath}`);
    if (file.status === 200) {
      return {
        body: file.body,
        headers: file.headers,
      };
    }
    throw new Error('File not found');
  } catch (e) {
    const error = new Error('Not Found');
    error.status = 404;
    throw error;
  }
}

// Simple path.join implementation
function pathJoin(...parts) {
  return parts
    .map(part => part.replace(/^\/+|\/+$/g, ''))
    .filter(part => part)
    .join('/');
}

// Simple path.dirname implementation
function pathDirname(path) {
  const parts = path.split(/[\\/]/);
  parts.pop();
  return parts.join('/');
}
