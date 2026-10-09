import { useEffect, useRef, useState } from 'react';

interface PassportWithModeProps {
  x: number;
  y: number;
  size: number;
  userName?: string;
  displayName?: string;
}

export default function PassportWithMode({ x, y, size, userName, displayName }: PassportWithModeProps) {
  const [mode, setMode] = useState<'video' | 'image'>('video');
  const [showDropdown, setShowDropdown] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamInitializedRef = useRef(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize webcam
  useEffect(() => {
    if (mode === 'video' && !webcamInitializedRef.current) {
      webcamInitializedRef.current = true;
      
      const initWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720, facingMode: 'user' } 
          });
          setStream(stream);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
            };
          }
        } catch (error) {
          console.error('Webcam access failed:', error);
        }
      };

      initWebcam();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        webcamInitializedRef.current = false;
      }
    };
  }, [mode]);

  // Get initials from display name
  const getInitials = (name?: string) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName || userName);

  return (
    <>
      {/* Video mode display */}
      {mode === 'video' && (
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
