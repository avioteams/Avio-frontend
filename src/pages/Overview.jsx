import Button from "../components/button";
import { useEffect, useState } from "react";

export default function Overview() {
    const [greet, setGreet] = useState('Hello')

    useEffect(()=> { 
        const hour = new Date().getHours();

        if (hour < 12) {
            setGreet("Morning")
        } else if (hour < 17) {
            setGreet("Afternoon")
        } else {
            setGreet("Evening")
        }
    }, []);
    
    return(
        <div className="home">
            <div className="home-container">
                <div className="greet-user">
                    <h1>{greet}, George</h1>
                </div>


                <div className="banner">
                    <div className="banner-content">
                    <div className="wallet">
                        <div className="wallet-balance">
                            <p>Wallet Balance</p>
                            <h1>NGN50,000.00</h1>
                        </div>
                        <div className="btn-actions">
                            <Button to="transfer" className="primary">Text a Friend</Button>
                            <Button to="savings" className="outline">Escrow</Button>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="actions">
                    <h2>Actions</h2>
                    <div className="actions-container">
                        <div className="headline">
                            <h1>Text to <br/> Pay Onchain</h1>
                            <p>Payment made easier and lazier</p>
                        </div>
                        <div className="actions-img">
                            <img src="../gold money bag.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}