import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function ErrorPage() {
    const errorRef = useRef(null);
    const glitchRef = useRef(null);
    const messageRef = useRef(null);
    const buttonRef = useRef(null);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Float animation for main 404
            gsap.to(errorRef.current, {
                y: -15,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });

            // Glitch effect - optimized with fewer repetitions
            const glitchTl = gsap.timeline({ 
                repeat: -1, 
                repeatDelay: 2,
                paused: false
            });
            
            glitchTl
                .to(glitchRef.current, {
                    x: -3,
                    opacity: 0.8,
                    duration: 0.08
                })
                .to(glitchRef.current, {
                    x: 3,
                    opacity: 0.6,
                    duration: 0.08
                })
                .to(glitchRef.current, {
                    x: 0,
                    opacity: 1,
                    duration: 0.08
                });

            // Fade in content
            gsap.from(messageRef.current.children, {
                opacity: 0,
                y: 20,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out"
            });

            // Button hover animation setup
            const button = buttonRef.current;
            button.addEventListener('mouseenter', () => {
                gsap.to(button, { scale: 1.05, duration: 0.3, ease: "power2.out" });
            });
            button.addEventListener('mouseleave', () => {
                gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" });
            });
        });

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = '/';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            ctx.revert();
        };
    }, []);

    return (
        <div 
            className="relative min-h-screen flex flex-col items-center justify-center"
            style={{ backgroundColor: '#121212' }}
        >
            {/* Main 404 container */}
            <div className="relative z-10 text-center px-4">
                {/* 404 text with glitch effect */}
                <div className="relative inline-block">
                    <h1 
                        ref={errorRef}
                        className="text-8xl md:text-[10rem] font-black tracking-wider select-none"
                        style={{ color: '#ffffff' }}
                    >
                        404
                    </h1>
                    
                    {/* Glitch overlay */}
                    <h1 
                        ref={glitchRef}
                        className="absolute top-0 left-0 text-8xl md:text-[10rem] font-black tracking-wider select-none pointer-events-none"
                        style={{ 
                            color: '#e30101',
                            textShadow: '2px 0 #ffffff, -2px 0 #e30101'
                        }}
                    >
                        404
                    </h1>
                </div>

                {/* Error message */}
                <div ref={messageRef} className="mt-8 space-y-6">
                    <p 
                        className="text-2xl md:text-3xl font-bold tracking-wide"
                        style={{ color: '#ffffff' }}
                    >
                        PAGE NOT FOUND
                    </p>
                    
                    <p 
                        className="text-base md:text-lg"
                        style={{ color: '#ffffff', opacity: 0.7 }}
                    >
                        The page you're looking for doesn't exist
                    </p>

                    {/* Countdown */}
                    <p 
                        className="text-base"
                        style={{ color: '#ffffff', opacity: 0.6 }}
                    >
                        Redirecting in{' '}
                        <span 
                            className="font-bold text-xl"
                            style={{ color: '#e30101' }}
                        >
                            {countdown}s
                        </span>
                    </p>

                    {/* Manual redirect button */}
                    <button
                        ref={buttonRef}
                        onClick={() => window.location.href = '/'}
                        className="mt-4 px-8 py-3 text-base font-semibold rounded-lg cursor-pointer"
                        style={{ 
                            backgroundColor: '#e30101',
                            color: '#ffffff',
                            border: 'none'
                        }}
                    >
                        Go Home Now
                    </button>
                </div>
            </div>
        </div>
    );
}