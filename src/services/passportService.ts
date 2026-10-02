import Phaser from 'phaser';

export function createPassportScreen(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  console.log('[Passport] Creating passport at position:', x, y);
  
  // Check if scene is valid
  if (!scene) {
    console.error('[Passport] Invalid scene provided to createPassportScreen');
    throw new Error('Invalid scene');
  }

  // Create passport container
  const passport = scene.add.container(x, y);
  console.log('[Passport] Container created');
  
  // Create passport background (200px x 200px)
  const passportBg = scene.add.rectangle(0, 0, 200, 200, 0x333333);
  passportBg.setStrokeStyle(2, 0x666666);
  passport.add(passportBg);
  console.log('[Passport] Background added');
  
  // Add placeholder initially
  const placeholder = scene.add.text(0, 0, 'Loading...', {
    fontSize: '14px',
    color: '#ffffff'
  });
  placeholder.setOrigin(0.5);
  passport.add(placeholder);
  console.log('[Passport] Placeholder added');
  
  // Initialize webcam using direct video element overlay
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('[Passport] Requesting webcam access...');
    navigator.mediaDevices.getUserMedia({ video: { width: 190, height: 190 } })
      .then((stream) => {
        console.log('[Passport] Webcam access granted, stream:', stream);
        // Remove placeholder
        placeholder.destroy();
        console.log('[Passport] Placeholder destroyed');
        
        // Create video element
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.width = '190px';
        video.style.height = '190px';
        video.style.objectFit = 'cover';
        video.style.borderRadius = '4px';
        console.log('[Passport] Video element created');
        
        // Video event handlers
        video.onloadedmetadata = () => {
          console.log('[Passport] Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
        };
        
        video.onplay = () => {
          console.log('[Passport] Video is playing');
        };
        
        video.onerror = (error) => {
          console.error('[Passport] Video error:', error);
        };
        
        // Get the canvas element from Phaser
        const canvas = scene.game.canvas;
        if (!canvas) {
          console.error('[Passport] No canvas found');
          return;
        }
        console.log('[Passport] Canvas found:', canvas);
        
        // Create a wrapper div for the video that will follow the passport
        const videoWrapper = document.createElement('div');
        videoWrapper.style.position = 'fixed';
        videoWrapper.style.width = '190px';
        videoWrapper.style.height = '190px';
        videoWrapper.style.overflow = 'hidden';
        videoWrapper.style.borderRadius = '4px';
        videoWrapper.style.pointerEvents = 'none';
        videoWrapper.style.zIndex = '1000';
        videoWrapper.appendChild(video);
        console.log('[Passport] Video wrapper created');
        
        // Add to DOM - use document.body for fixed positioning
        document.body.appendChild(videoWrapper);
        console.log('[Passport] Video wrapper added to document.body');
        
        // Function to update video position based on passport
        const updateVideoPosition = () => {
          if (!passport.scene) {
            videoWrapper.remove();
            return;
          }
          
          const passportWorldX = passport.x;
          const passportWorldY = passport.y;
          
          const camera = scene.cameras.main;
          
          // Get canvas bounds in viewport
          const canvasBounds = canvas.getBoundingClientRect();
          
          // Calculate screen position relative to canvas
          const screenX = passportWorldX - camera.scrollX + canvasBounds.left;
          const screenY = passportWorldY - camera.scrollY + canvasBounds.top;
          
          videoWrapper.style.left = `${screenX - 95}px`;
          videoWrapper.style.top = `${screenY - 95}px`;
        };
        
        // Initial position update
        updateVideoPosition();
        console.log('[Passport] Initial video position set');
        
        // Update position on every frame
        scene.events.on('update', updateVideoPosition);
        console.log('[Passport] Video position update handler registered');
        
        // Cleanup on scene destroy
        scene.events.once('destroy', () => {
          console.log('[Passport] Scene destroyed, cleaning up');
          scene.events.off('update', updateVideoPosition);
          videoWrapper.remove();
          stream.getTracks().forEach(track => track.stop());
        });
      })
      .catch((error) => {
        console.error('[Passport] Webcam access failed:', error);
        // Fallback if webcam fails
        if (placeholder && placeholder.scene) {
          placeholder.setText('No Camera');
        }
      });
  } else {
    console.log('[Passport] getUserMedia not available');
    // Fallback if getUserMedia not available
    placeholder.setText('No Camera');
  }
  
  // Make passport draggable with proper hit area
  passport.setSize(200, 200);
  passport.setInteractive({ draggable: true, useHandCursor: true });
  
  scene.input.setDraggable(passport, true);
  
  passport.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
    passport.x = dragX;
    passport.y = dragY;
  });
  
  console.log('[Passport] Passport setup complete');
  return passport;
}
