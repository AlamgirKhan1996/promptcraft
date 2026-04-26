'use client';
// components/builder/WebsitePreview.tsx
// Uses blob URL instead of srcDoc to avoid ALL sandbox issues

import { useEffect, useRef, useState } from 'react';

interface WebsitePreviewProps {
  html: string;
  device: 'desktop' | 'mobile';
}

export function WebsitePreview({ html, device }: WebsitePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [blobUrl, setBlobUrl] = useState<string>('');

  useEffect(() => {
    if (!html) return;

    // ── Create blob URL — bypasses ALL sandbox restrictions ──
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    setBlobUrl(url);

    // Cleanup old blob URL
    return () => URL.revokeObjectURL(url);
  }, [html]);

  return (
    <div style={{
      background: '#1a1a2e',
      border: '1px solid rgba(99,102,241,0.2)',
      borderTop: 'none',
      borderRadius: '0 0 16px 16px',
      padding: device === 'mobile' ? '20px' : '0',
      minHeight: 600,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      {blobUrl && (
        <iframe
          ref={iframeRef}
          src={blobUrl}
          style={{
            width: device === 'mobile' ? '390px' : '100%',
            height: '780px',
            border: device === 'mobile' ? '10px solid #0f1120' : 'none',
            borderRadius: device === 'mobile' ? 28 : '0 0 16px 16px',
            display: 'block',
          }}
          title="Website Preview"
        />
      )}
    </div>
  );
}
