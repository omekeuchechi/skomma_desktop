import { useEffect, useRef, useState } from 'react';

interface PassportWithModeProps {
  x: number;
  y: number;
  size: number;
  userName?: string;
  displayName?: string;
}

export default function PassportWithMode({ x: _x, y: _y, size, userName, displayName }: PassportWithModeProps) {
  const actualDisplayName = displayName || userName;
  const [mode, setMode] = useState<'video' | 'image'>('image');
  const [showDropdown, setShowDropdown] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [webcamError, setWebcamError] = useState(false);

  // Reset webcam error when switching to video mode
  useEffect(() => {
    if (mode === 'video') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWebcamError(false);
    }
  }, [mode]);

  // Acquire the webcam stream while in video mode, release it otherwise.
  useEffect(() => {
    if (mode !== 'video') return;

    let cancelled = false;
    let mediaStream: MediaStream | null = null;

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
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Video mode display */}
      {mode === 'video' && (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
          />
          {webcamError && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#333333',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px',
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
            width: '100%',
            height: '100%',
            backgroundColor: '#4a90e2',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size / 2}px`,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        >
          {initials}
        </div>
      )}

      {/* Three dots menu button */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: '#ffffff',
          fontWeight: 'bold',
          pointerEvents: 'auto',
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
            top: 0,
            right: '-130px',
            backgroundColor: '#333333',
            borderRadius: '8px',
            padding: '8px',
            minWidth: '120px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              padding: '8px',
              cursor: 'pointer',
              color: mode === 'video' ? '#00ff00' : '#ffffff',
              borderRadius: '4px',
              pointerEvents: 'auto',
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
              pointerEvents: 'auto',
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
    </div>
  );
}
