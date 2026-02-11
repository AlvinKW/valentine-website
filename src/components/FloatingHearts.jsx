import { useMemo } from 'react';

const FloatingHearts = () => {
    const hearts = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: Math.random() * 20 + 15,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 15,
            emoji: ['💖', '💕', '💗', '💓', '💘', '❤️', '💝'][Math.floor(Math.random() * 7)],
        }));
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {hearts.map((heart) => (
                <span
                    key={heart.id}
                    className="floating-heart"
                    style={{
                        left: `${heart.left}%`,
                        fontSize: `${heart.size}px`,
                        animationDuration: `${heart.duration}s`,
                        animationDelay: `${heart.delay}s`,
                    }}
                >
                    {heart.emoji}
                </span>
            ))}
        </div>
    );
};

export default FloatingHearts;
