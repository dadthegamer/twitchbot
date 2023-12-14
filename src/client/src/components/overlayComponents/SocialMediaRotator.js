import React, { useState, useEffect } from 'react';
import '../../styles/overlay/socialMediaRotator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faDiscord, faYoutube, faTwitch, faTiktok } from '@fortawesome/free-brands-svg-icons';

function SocialMediaRotator() {
    const [socialMedia, setSocialMedia] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [showRotator, setShowRotator] = useState(false);
    const [showCardInterval, setShowCardInterval] = useState(20); //In minutes
    const [showCardDuration, setShowCardDuration] = useState(6); //In seconds

    // Set the social media links
    useEffect(() => {
        setSocialMedia([
            {
                name: "@Dad_The_Gam3r",
                icon: faTwitter,
                backgroundColor: "#1DA1F2",
                command: "!twitter"
            },
            {
                name: "The Dad Squad",
                icon: faDiscord,
                backgroundColor: "#7289DA",
                command: "!discord"
            },
            {
                name: "Dad The Gamer Games",
                icon: faYoutube,
                backgroundColor: "#FF0000",
                command: "!youtube"
            },
            {
                name: "dad.the.gamer",
                icon: faTiktok,
                backgroundColor: "#ff0050",
                command: "!tiktok"
            }
        ]);
    }, []);

    useEffect(() => {
        if (animate) {
            setTimeout(() => setAnimate(false), 250); // Reset animation state after 1s
        }
    }, [animate]);

    // Show the rotator every 20 seconds
    useEffect(() => {
        let rotateCardsInterval;

        if (showRotator) {
            rotateCardsInterval = setInterval(() => {
                setAnimate(true);
                setCurrentIndex((prevIndex) => {
                    if (prevIndex === socialMedia.length - 1) {
                        // When the last index is reached
                        setShowRotator(false); // Hide the rotator
                        clearInterval(rotateCardsInterval); // Clear the interval
                        return 0; // Reset index to 0
                    } else {
                        return prevIndex + 1; // Otherwise, move to the next index
                    }
                });
            }, showCardDuration * 1000);
        }

        return () => {
            if (rotateCardsInterval) {
                clearInterval(rotateCardsInterval);
            }
        };
    }, [showRotator, socialMedia.length, showCardDuration]);

    useEffect(() => {
        const showRotatorInterval = setInterval(() => {
            setShowRotator(true);
        }, showCardInterval * 60 * 1000);

        return () => clearInterval(showRotatorInterval);
    }, [showCardInterval]);

    // Render the current social media card
    return (
        <div>
            {showRotator && socialMedia.length > 0 && (
                <div className={`social-media-rotator`}>
                    <div className={`social-media-card ${animate ? 'animated' : ''}`} style={
                            {
                                backgroundColor: socialMedia[currentIndex].backgroundColor,
                            }
                    }>
                        <FontAwesomeIcon icon={socialMedia[currentIndex].icon} className='social-fa-icon'/>
                        <span className='social-name'>{socialMedia[currentIndex].name}</span>
                        <span className='social-command'>{socialMedia[currentIndex].command}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SocialMediaRotator;
