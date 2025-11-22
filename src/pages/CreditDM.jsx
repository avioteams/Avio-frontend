import { useState, useEffect } from "react"
import Button from "../components/button";

export default function Credit() {
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowChat(true);
        }, 1000);

        return () => clearTimeout(timer);
    })

    return (
        <div className="credit">
            <div className="chat-dm-container">
                {!showChat ? (
                    <div className="chat-intro">
                        <img src="../set of several credit cards.png" alt="" />
                        <h1>Credit <br />a friend by DM</h1>
                        <p>{`Use the keyword "Send [Amount] to [Recipient] by [Time]`}</p>
                    </div>
                ) : (<div className="chat-container">
                    <div className="chat-body">
                        <div className="message user-message">
                            <p>Send NGN5,000 to Ola by 12pm</p>
                            <p className="message-time">10:0am</p>
                        </div>
                        <div className="message ai-message">
                            <p>Processing rule...</p>
                            <p className="message-time">10:0am</p>
                        </div>
                        <div className="message ai-message">
                            <div className="transfer-success">
                                Schedule to Send NGN5,000 to Ola by 12pm, is Successful!
                                <p className="message-time">10:0am</p>
                            </div>
                        </div>
                    </div>
                    <div className="chat-input">
                        <div className="chat-input-container">
                            <input type="text" placeholder="DM to credit recipient" />
                            <Button>Send</Button>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    )
}