import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader({ onLoadComplete }) {
    const logoRef = useRef(null);
    const splashRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const logo = logoRef.current;
        const splash = splashRef.current;

        // Create the zoom in/out animation
        const tl = gsap.timeline({
            repeat: -1,
            yoyo: true
        });

        tl.to(logo, {
            scale: 1.2,
            duration: 0.8,
            ease: "power2.inOut"
        });

        // Simulate loading time (3 seconds)
        const loadTimer = setTimeout(() => {
            // Stop the animation
            tl.kill();
            
            // Fade out animation
            gsap.to(logo, {
                scale: 1.5,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in"
            });

            gsap.to(splash, {
                opacity: 0,
                duration: 0.5,
                delay: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    setIsLoading(false);
                    if (onLoadComplete) onLoadComplete();
                }
            });
        }, 3000);

        return () => {
            clearTimeout(loadTimer);
            tl.kill();
        };
    }, [onLoadComplete]);

    if (!isLoading) return null;

    return (
        <div 
            ref={splashRef}
            className="fixed inset-0 bg-primary flex items-center justify-center z-50"
        >
            <img 
                ref={logoRef}
                className="w-40 h-40 object-contain"
                src="./Trademark-logo.svg" 
                alt="logo"
            />
        </div>
    );
}