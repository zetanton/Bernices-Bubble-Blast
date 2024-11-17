export type SoundName = 'pop' | 'shot' | 'welcome' | 'theme' | 'select' | 'background' | 'start' | 'nobubbles' | 'stagecomplete';

let currentBackgroundMusic: HTMLAudioElement | null = null;
const audioCache: Partial<Record<SoundName, HTMLAudioElement>> = {};

export const playSound = (soundName: SoundName, loop: boolean = false) => {
  try {
    // Handle background music tracks
    if (soundName === 'theme' || soundName === 'select' || soundName === 'background') {
      if (currentBackgroundMusic) {
        currentBackgroundMusic.pause();
        currentBackgroundMusic = null;
      }

      // Create or get cached audio
      if (!audioCache[soundName]) {
        audioCache[soundName] = new Audio(`/sounds/${soundName}.mp3`);
      }
      const audio = audioCache[soundName]!;
      audio.currentTime = 0;
      audio.loop = loop;
      audio.volume = 0.2;
      
      if (loop) {
        currentBackgroundMusic = audio;
      }
      
      audio.play().catch(error => {
        console.warn(`Background music playback failed for ${soundName}:`, error);
      });
      
      return audio;
    }

    // Handle sound effects
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.volume = soundName === 'stagecomplete' ? 0.4 : 0.3;
    audio.loop = loop;
    
    audio.play().catch(error => {
      console.warn(`Sound effect playback failed for ${soundName}:`, error);
    });
    
    return audio;
  } catch (error) {
    console.warn(`Error playing sound ${soundName}:`, error);
    return null;
  }
};

export const stopBackgroundMusic = () => {
  if (currentBackgroundMusic) {
    currentBackgroundMusic.pause();
    currentBackgroundMusic = null;
  }
};

export const preloadSounds = () => {
  const sounds: SoundName[] = ['welcome', 'theme', 'select', 'background', 'start', 'nobubbles', 'stagecomplete'];
  sounds.forEach(sound => {
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.preload = 'auto';
  });
}; 