import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faDiscord, faYoutube, faTwitch, faTiktok } from '@fortawesome/free-brands-svg-icons';

function BottomLeft() {
    const [cards, setCards] = useState([]);
    const [showCardDuration, setShowCardDuration] = useState(10); // In seconds
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Initialize the cards here
        const initialCards = [
            {
                name: "@Dad_The_Gam3r",
                icon: faTwitter,
                backgroundColor: "#1DA1F2",
            },
            {
                name: "The Dad Squad",
                icon: faDiscord,
                backgroundColor: "#7289DA",
            },
            {
                name: "Dad The Gamer Games",
                icon: faYoutube,
                backgroundColor: "#FF0000",
            },
            {
                name: "dad.the.gamer",
                icon: faTiktok,
                backgroundColor: "#ff0050",
            }
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
            <div className='bottom-left-card' style={
                {
                    backgroundColor: cards[currentIndex].backgroundColor
                }
            }>
                <FontAwesomeIcon icon={cards[currentIndex].icon} size='2x' className='social-media-icon'/>
                <span className='social-media-name'>{cards[currentIndex].name}</span>
            </div>
        )
    );
}

export default BottomLeft;
