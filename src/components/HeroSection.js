import React, { useState, useEffect  } from "react";
import "../styles/HeroSection.css";
import { AiOutlineArrowUp } from "react-icons/ai";
import { motion } from "framer-motion";
import { animateScroll as scroll } from "react-scroll";

import jumpSound from "../sounds/mario-jump.mp3";
import brickBreakSound from "../sounds/block-break.mp3";
import coinSound from "../sounds/coin-sound.mp3"
import brickHitSound from '../sounds/smb_stomp.wav';

// Example icon imports; update with your actual image paths
import linkedin_icon from "../images/linkedin-icon.webp";
import github_icon from "../images/github-logo-pixel.jpg";
import email_icon from "../images/email-icon.png";

const HeroSection = () => {
  const scrollToTop = () => scroll.scrollToTop({ smooth: "linear" });

  const [visible, setVisible] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  // Track block states
  const [breakingBlocks, setBreakingBlocks] = useState([false, false, false]);
  const [brokenBlocks, setBrokenBlocks] = useState([false, false, false]);
  const [blockPressed, setBlockPressed] = useState(false);

  const [coinVisible, setCoinVisible] = useState(false);

  // Random number of hits needed to break (2-5, for example)
  const [hitsNeeded] = useState(() => Math.floor(Math.random() * 8) + 4);
  const [hitCount, setHitCount] = useState(0);

  // Track the "breaking" animation state
  const [isBreaking, setIsBreaking] = useState(false);  

  useEffect(() => {
    const unlockAudio = () => {
      if (!audioContext) {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
        console.log("Audio context created!");
      } else if (audioContext.state === "suspended") {
        audioContext.resume().then(() => {
          console.log("Audio context resumed!");
        });
      }
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [audioContext]);

  const [hitAnim, setHitAnim] = useState(false);

  useEffect(() => {
    if (hitCount > 0 && !isBreaking) {
      // trigger a quick "hit" animation
      setHitAnim(true);
      // remove it after 0.3s
      const t = setTimeout(() => setHitAnim(false), 300);
      return () => clearTimeout(t);
    }
  }, [hitCount, isBreaking]);

  const playSound = (soundFile) => {
    if (!audioContext) return;
    fetch(soundFile)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        audioContext.decodeAudioData(data, (buffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
        });
      })
      .catch((error) => console.error("Error playing audio:", error));
  };

  // Trigger the block break on first hover
  const handleHoverStart = (index) => {
    // If it's already in the process of breaking or broken, do nothing
    if (breakingBlocks[index] || brokenBlocks[index]) return;

    playSound(jumpSound);

    // Start "breaking" animation
    setBreakingBlocks((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });

    // After ~1s, mark the block as broken
    setTimeout(() => {
      setBrokenBlocks((prev) => {
        const newBroken = [...prev];
        newBroken[index] = true;
        return newBroken;
      });
    }, 1000); // match the CSS animation duration
  };

  const handleBrickClick = (e) => {
    e.preventDefault();  // prevent immediate download if anchor tag is used

    // If it’s already breaking/shattered, do nothing
    if (isBreaking) return;

    playSound(brickHitSound);

    setHitCount(prev => {
      const newCount = prev + 1;

      // If we've reached the required hits to break:
      if (newCount >= hitsNeeded) {
		    playSound(brickBreakSound);
        setIsBreaking(true); // triggers the shatter animation

        // After the shatter animation (1s or so), download the file
        setTimeout(() => {
          // Trigger the actual PDF download
          const link = document.createElement('a');
          link.href = 'Navkar-Jain-Resume.pdf';
          link.download = 'Navkar-Jain-Resume';
          link.click();
        }, 1000); 
      }

      return newCount;
    });

	if (!isBreaking) {
		setHitAnim(true);
		setTimeout(() => setHitAnim(false), 300);
	}
  };

  const handleCoinBlockClick = () => {
    // If the audio context is still locked, resume it:
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log("Audio context resumed for coin block!");
      });
    }
	setBlockPressed(true);
    playSound(coinSound);    // play the coin sound

    setCoinVisible(true); // show the coin sprite

    // After 1 second (matching coinJump duration), hide coin
    setTimeout(() => {
      setCoinVisible(false);
    }, 1000);
	setTimeout(() => {
		setBlockPressed(false);
	}, 300);
  };

  const links = [
    { id: 1, url: "https://www.linkedin.com/in/navkar-j-1b7594110/", icon: linkedin_icon },
    { id: 2, url: "https://github.com/navkar98", icon: github_icon },
    { id: 3, url: "mailto:n.jain001@umb.edu", icon: email_icon },
  ];

  // Framer Motion variants
  const heroVariants = {
    hidden: { opacity: 0, y: "-50%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.4 },
    },
  };

  const contactVariants = {
    hidden: { opacity: 0, y: "50%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.4 },
    },
  };

  return (
    <div className='hero-section' id='home'>
      <div className='hero-overlay'></div>

      <motion.div
        variants={heroVariants}
        initial='hidden'
        whileInView='visible'
        className={visible ? "to-top-icon show" : "to-top-icon hide"}
        onClick={scrollToTop}
      >
        <AiOutlineArrowUp />
      </motion.div>

	<div className={`hero-content ${blockPressed ? "block-pressed" : ""}`} 
	onClick={handleCoinBlockClick}>
        {coinVisible && (
          <div className="coin" style={{ animation: "coinJump 1s forwards" }} />
        )}

        {/* Two rows of text in pixel font, color black */}
        <p className='hero-intro'>Navkar Jain</p>
        <p className='hero-desc'>
          <span className='hero-desc-sub'>AI/ML Enthusiast</span>
        </p>
      </div>

		<div 
			className={`download-brick ${hitAnim ? 'hit-animation' : ''} ${isBreaking ? 'breaking' : ''}`}
			onClick={handleBrickClick}
      	>
			<span className="brick-label">DOWNLOAD<br/>RESUME</span>
		</div>

      <motion.span variants={contactVariants} initial='hidden' whileInView='visible'>
	  <ul className='hero-nav-links'>
          {links.map((link, index) => {
            const isBreaking = breakingBlocks[index] ? "breaking" : "";
            const isBroken = brokenBlocks[index] ? "broken" : "";

            return (
              <li key={link.id}>
                {/* 
                  Div for the BLOCK + Mario 
                  This is the part that gets .breaking / .broken 
                */}
                <div
                  className={`block-wrapper ${isBreaking} ${isBroken}`}
                  onMouseEnter={() => handleHoverStart(index)}
                  // onMouseLeave={() => handleHoverEnd(index)} if you want to reset
                >
                  {/* Show Mario only while not broken */}
                  {!brokenBlocks[index] && <div className='mario' />}
                </div>

                {/* 
                  Div (or span) for the LINK ICON 
                  This becomes visible once the block is "broken"
                */}
                <div className={`link-wrapper ${isBroken ? "revealed" : ""}`}>
                  <a href={link.url} target='_blank' rel='noopener noreferrer'>
                    <img src={link.icon} alt={`Link ${index + 1}`} className='icon' />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </motion.span>
    </div>
  );
};

export default HeroSection;
