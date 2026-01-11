import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of a Track
export interface Track {
    id: string;
    title: string;
    artist: string;
    image: any; // Image source
    uri: string; // Audio URI
}

interface AudioContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    duration: number;
    position: number;
    isLoading: boolean;
    playTrack: (track: Track) => Promise<void>;
    playQueue: (tracks: Track[], startIndex: number) => Promise<void>;
    playNext: () => Promise<void>;
    playPrevious: () => Promise<void>;
    togglePlayPause: () => Promise<void>;
    seekTo: (position: number) => Promise<void>;
    hasNext: boolean;
    hasPrevious: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [queue, setQueue] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);

    const configureAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            });
        } catch (e) {
            console.error("Error configuring audio:", e);
        }
    };

    // Configure Audio Mode on mount
    useEffect(() => {
        configureAudio();
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        }
    }, [sound]);

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
            setPosition(status.positionMillis || 0);
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
                setIsPlaying(false);
                // Auto play next track
                playNext();
            }
        } else if (status.error) {
            console.log(`Playback Error: ${status.error}`);
        }
    };

    const loadAndPlay = async (track: Track) => {
        setIsLoading(true);
        try {
            await configureAudio();
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: track.uri },
                { shouldPlay: false },
                onPlaybackStatusUpdate
            );
            setSound(newSound);
            setCurrentTrack(track);
            await newSound.playAsync();
            setIsPlaying(true);
        } catch (error) {
            console.error("Error loading track:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const playTrack = async (track: Track) => {
        // Single track playback resets queue
        setQueue([track]);
        setCurrentIndex(0);
        await loadAndPlay(track);
    };

    const playQueue = async (tracks: Track[], startIndex: number = 0) => {
        setQueue(tracks);
        setCurrentIndex(startIndex);
        if (tracks[startIndex]) {
            await loadAndPlay(tracks[startIndex]);
        }
    };

    const playNext = async () => {
        if (currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            await loadAndPlay(queue[nextIndex]);
        }
    };

    const playPrevious = async () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            await loadAndPlay(queue[prevIndex]);
        }
    };

    const togglePlayPause = async () => {
        if (!sound) return;

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
    };

    const seekTo = async (millis: number) => {
        if (sound) {
            await sound.setPositionAsync(millis);
        }
    };

    return (
        <AudioContext.Provider
            value={{
                currentTrack,
                isPlaying,
                duration,
                position,
                isLoading,
                playTrack,
                playQueue,
                playNext,
                playPrevious,
                togglePlayPause,
                seekTo,
                hasNext: currentIndex < queue.length - 1,
                hasPrevious: currentIndex > 0
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
