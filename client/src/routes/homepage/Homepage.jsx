import { Link } from 'react-router-dom'
import './homepage.css'
import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'

const Homepage = () => {

    const [typingStatus, setTypingStatus] = useState("human1");

    return (
        <div className='homepage'>
            <img src='/orbital.png' alt='' className='orbital'></img>
            <div className="left">
                <h1>AICHAT</h1>
                <h2>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus, voluptatum.</h2>
                <h3>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est eligendi architecto assumenda quod itaque.</h3>
                <Link to="/dashboard">Get Started</Link>
            </div>
            <div className="right">
                <div className="imageContainer">
                    <div className="bgContainer">
                        <div className="bg"></div>
                    </div>
                    <img src='/bot.png' alt="" className='bot'></img>
                    <div className="chat">
                        <img src={typingStatus === "human1" 
                            ? "/human1.jpeg" 
                            : typingStatus === "human2" 
                            ? "/human2.jpeg" 
                            : "/bot.png" } 
                            alt="" />
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                'Human:We produce food for Mice',
                                1000, ()=> {
                                    setTypingStatus("bot")
                                },
                                'Bot:We produce food for Hamsters',
                                1000, () => {
                                    setTypingStatus("human2")
                                },
                                'Human:We produce food for Guinea Pigs',
                                1000, () => {
                                    setTypingStatus("bot")
                                },
                                'Bot:We produce food for Chinchillas',
                                1000, () => {
                                    setTypingStatus("human1")
                                }
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt="" />
                <div className="links">
                    <Link to="/" >Terms of service</Link>
                    <span>|</span>
                    <Link to="/" >Priacy policy</Link>
                </div>
            </div>
        </div>
    )
}

export default Homepage