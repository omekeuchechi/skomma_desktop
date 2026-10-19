import { useEffect, useRef, useState } from 'react';

interface PassportWithModeProps {
  x: number;
  y: number;
  size: number;
  userName?: string;
  displayName?: string;
}

export default function PassportWithMode({ x, y, size, userName, displayName }: PassportWithModeProps) {
  const actualDisplayName = displayName || userName;
  const [mode, setMode] = useState<'video' | 'image'>('image');
  const [showDropdown, setShowDropdown] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [webcamError, setWebcamError] = useState(false);

  // Acquire the webcam stream while in video mode, release it otherwise.
  useEffect(() => {
    if (mode !== 'video') return;

    let cancelled = false;
    let mediaStream: MediaStream | null = null;
    setWebcamError(false);

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((acquired) => {
        if (cancelled) {
          acquired.getTracks().forEach((track) => track.stop());
          return;
        }
        mediaStream = acquired;
        setStream(acquired);
      })
      .catch(() => {
        if (cancelled) return;
        setWebcamError(true);
        // Fall back to image mode if the webcam is unavailable.
        setMode('image');
      });

    return () => {
      cancelled = true;
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
    };
  }, [mode]);

  // Attach the stream once the <video> element is mounted.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;
    video.play().catch(() => {
      /* Autoplay can be rejected until metadata is ready; ignore. */
    });
  }, [stream, mode]);

  // Get initials from display name
  const getInitials = (name?: string) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(actualDisplayName);

  return (
    <>
      {/* Video mode display */}
      {mode === 'video' && (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              width: `${size}px`,
              height: `${size}px`,
              objectFit: 'cover',
              borderRadius: '8px',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          />
          {webcamError && (
            <div
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: '#333333',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px',
                zIndex: 1001,
              }}
            >
              Camera Error
            </div>
          )}
        </>
      )}

      {/* Image mode display */}
      {mode === 'image' && (
        <div
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: '#4a90e2',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size / 2}px`,
            color: '#ffffff',
            fontWeight: 'bold',
            zIndex: 1000,
          }}
        >
          {initials}
        </div>
      )}

      {/* Three dots menu button */}
      <div
        style={{
          position: 'absolute',
          left: `${x + size - 20}px`,
          top: `${y}px`,
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: '#ffffff',
          fontWeight: 'bold',
        }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        ⋯
      </div>

      {/* Dropdown menu */}
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            left: `${x + size}px`,
            top: `${y}px`,
            backgroundColor: '#333333',
            borderRadius: '8px',
            padding: '8px',
            zIndex: 1002,
            minWidth: '120px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              padding: '8px',
              cursor: 'pointer',
              color: mode === 'video' ? '#00ff00' : '#ffffff',
              borderRadius: '4px',
            }}
            onClick={() => {
              setMode('video');
              setShowDropdown(false);
            }}
          >
            Video Mode
          </div>
          <div
            style={{
              padding: '8px',
              cursor: 'pointer',
              color: mode === 'image' ? '#00ff00' : '#ffffff',
              borderRadius: '4px',
            }}
            onClick={() => {
              setMode('image');
              setShowDropdown(false);
            }}
          >
            Image Mode
          </div>
        </div>
      )}
    </>
  );
}
