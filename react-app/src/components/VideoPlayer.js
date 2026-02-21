import React, { useRef, useEffect, useState } from 'react';

const VideoPlayer = (props) => {
    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [hasRestored, setHasRestored] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const saveIntervalRef = useRef(null);

    // Construire l'URL correcte pour la vidéo
    const videoSrc = props.path || '';

    // Récupérer la progression sauvegardée
    useEffect(() => {
        const fetchProgress = async () => {
            if (!props.jwtToken || !props.movieId) return;
            
            try {
                const response = await fetch(`/progress/${props.movieId}`, {
                    headers: {
                        'Authorization': `Bearer ${props.jwtToken}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.progress_seconds > 0 && videoRef.current) {
                        videoRef.current.currentTime = data.progress_seconds;
                        setProgress(data.progress_seconds);
                    }
                }
            } catch (error) {
                console.log('Could not fetch progress:', error);
            }
            setHasRestored(true);
        };
        
        fetchProgress();
    }, [props.jwtToken, props.movieId]);

    // Sauvegarder la progression périodiquement
    useEffect(() => {
        if (!props.jwtToken || !props.movieId || !hasRestored) return;

        saveIntervalRef.current = setInterval(() => {
            if (videoRef.current && props.jwtToken) {
                saveProgress(videoRef.current.currentTime, videoRef.current.duration);
            }
        }, 5000); // Sauvegarder toutes les 5 secondes

        return () => {
            if (saveIntervalRef.current) {
                clearInterval(saveIntervalRef.current);
            }
        };
    }, [props.jwtToken, props.movieId, hasRestored]);

    const saveProgress = async (currentTime, duration) => {
        if (!props.jwtToken || !props.movieId) return;
        
        try {
            await fetch(`/progress/${props.movieId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.jwtToken}`
                },
                body: JSON.stringify({
                    progress_seconds: Math.floor(currentTime),
                    total_seconds: Math.floor(duration || 0)
                })
            });
        } catch (error) {
            console.log('Could not save progress:', error);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setProgress(videoRef.current.currentTime);
        }
    };

    const handlePause = () => {
        if (videoRef.current && props.jwtToken) {
            saveProgress(videoRef.current.currentTime, videoRef.current.duration);
        }
    };

    const handleEnded = () => {
        if (videoRef.current && props.jwtToken) {
            saveProgress(0, videoRef.current.duration); // Reset progress at end
        }
    };

    const handleLoadedData = () => {
        setIsLoading(false);
        setError(null);
    };

    const handleError = (e) => {
        setIsLoading(false);
        setError("Error loading video");
        console.error("Video error:", e);
    };

    // Sauvegarder avant de quitter la page
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (videoRef.current && props.jwtToken) {
                // Use sendBeacon for reliable save on page unload
                const data = JSON.stringify({
                    progress_seconds: Math.floor(videoRef.current.currentTime),
                    total_seconds: Math.floor(videoRef.current.duration || 0)
                });
                navigator.sendBeacon(`/progress/${props.movieId}`, data);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [props.jwtToken, props.movieId]);

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full h-full bg-black">
            {isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-xl z-10">
                    Loading video...
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xl z-10">
                    {error}
                </div>
            )}
            <video 
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onPause={handlePause}
                onEnded={handleEnded}
                onLoadedData={handleLoadedData}
                onError={handleError}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support video playback.
            </video>
        </div>
    );
}

export default VideoPlayer;
