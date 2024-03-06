import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';
import TikTok from './TikTok';
import Discord from './Discord';
import Twitter from './Twitter';
import Youtube from './Youtube';
import Command from './Command';
import NowPlaying from './NowPlaying';
import RandomQuote from './RandomQuote';
import SubGoal from './DailySubGoal';
import RandomViewer from './RandomViewer';
import UpTime from './UpTime';


function BottomLeft() {
    const [cards, setCards] = useState([]);
    const [showCardDuration, setShowCardDuration] = useState(10); // In seconds
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Initialize the cards here
        const initialCards = [
            {
                component: <Twitter />,
            },
            {
                component: <Discord />,
            },
            {
                component: <Youtube />,
            },
            {
                component: <TikTok />,
            },
            {
                component: <Command />,
            },
            {
                component: <NowPlaying />,
            },
            {
                component: <RandomQuote />,
            },
            {
                component: <SubGoal />,
            },
            {
                component: <RandomViewer />,
            },
            {
                component: <UpTime />,
            },
        ];

        setCards(initialCards);
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const rotateCardsInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                if (prevIndex === cards.length - 1) {
                    return 0;
                } else {
                    return prevIndex + 1;
                }
            });
        }, showCardDuration * 1000);

        return () => clearInterval(rotateCardsInterval);
    }, [cards, showCardDuration]);

    return (
        isLoaded && (
            <>
                {cards[currentIndex].component}
            </>
        )
    );
}

export default BottomLeft;
