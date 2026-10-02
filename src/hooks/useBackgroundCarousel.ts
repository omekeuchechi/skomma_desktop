import { useState, useEffect } from 'react';
import bgImage from '../assets/bg.jpeg';
import bg1Image from '../assets/bg1.jpeg';
import bg2Image from '../assets/bg2.jpeg';

const backgroundImages = [bgImage, bg1Image, bg2Image];

export function useBackgroundCarousel(interval = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return {
    images: backgroundImages,
    currentIndex,
  };
}