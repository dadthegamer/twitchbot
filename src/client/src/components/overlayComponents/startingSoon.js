import React, { useState, useEffect } from 'react';
import '../../styles/overlay/startingSoon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faInstagram, faTiktok, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

function StartingSoon() {

  // Set the intial time state to 5 minutes
  const [timeLeft, setTimeLeft] = useState(60 * 5); // 5 minutes

  // useEffect hook to update the timer every second
  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
  });

  // Calculate the minutes and seconds from timeLeft
  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  // If the timer reaches 0, display the starting soon message
  if (timeLeft < 0) {
    return (
      <div className="main-container">
        <div className="left">
          <div className="starting-soon">
            <span>LIVE STREAM</span>
            <span>STARTING</span>
            <span>SOON</span>
          </div>
        </div>
      </div>
    );

  }

  return (
    <><div className="main-container">
      <div className="left">
        <div className="starting-soon">
          <span>LIVE STREAM</span>
          <span id="starting-soon-text">STARTING</span>
          <span id="soon">SOON</span>
        </div>

        <span id='timer'>{minutes}:{seconds}</span>
      </div>
    </div><div className="social-icons">
        <div className="social">
          <FontAwesomeIcon icon={faTwitter} />
          <span>Dad_The_Gam3r</span>
        </div>
        <div className="social">
          <FontAwesomeIcon icon={faTiktok} />
          <span>dad.the.gamer</span>
        </div>
        <div className="social">
          <FontAwesomeIcon icon={faDiscord} />
          <span>The Dad Squad</span>
        </div>
        <div className="social">
          <FontAwesomeIcon icon={faInstagram} />
          <span>dad.the.gamer</span>
        </div>
        <div class="social">
          <FontAwesomeIcon icon={faYoutube} />
          <span>Dad The Gamer Games</span>
        </div>

      </div></>
  );

}

export default StartingSoon;