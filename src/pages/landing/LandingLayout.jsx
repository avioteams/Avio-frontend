import Button from "../../components/button";
import Footer from "./Footer";
import NavBar from "./NavBar";
import "./style/landing.css"

export default function Landing(){
    return(
        <div className="landing">
            <NavBar />
            <div className="landing-container">
                <div className="hero-section">
                    <div className="tagline">
                        <div className="tag-content">
                            <p className="badge" style={{fontSize: "20px"}}>Powered by <span style={{
                                color: "#e30101",
                                fontWeight: 600,
                            }}>Avalanche</span></p>
                            <h1>A DM into Onchain <br />Banking Experience</h1>
                        </div>
                        <div className="hero-btn-container">
                            <Button to="/dashboard" className="secondary">Begin an Experience</Button>
                            <Button to="/dashboard" className="primary">login</Button>
                        </div>
                    </div>
                    <div className="hero-img">
                        <img src="../Black folding wallet.png" alt="" />
                    </div>
                </div>
                <div className="target-audience">
                    <p style={{
                        color: "#e30101", 
                        fontSize: "18px",
                        fontWeight: "700"
                    }}>For you</p>
                    <p style={{
                        fontSize:"48px",
                    }}>Whether it’s a friend, a vendor, or a creator, sending money is now as easy as sending a message</p>
                    <div className="img-container"></div>
                </div>
                <div className="features">
                    <section>
                        <img src="../CreditCards.svg" alt=""/>
                        <div className="tagline">
                            <p style={{
                                color: "#e30101", 
                                fontSize: "18px",
                                fontWeight: "700"
                            }}>For you</p>
                            <p style={{
                                fontSize:"48px",
                            }}>It’s a New Wave of Social Money</p>
                        </div>
                    </section>
                    <section>
                        <div className="tagline">
                            <p style={{
                                color: "#e30101", 
                                fontSize: "18px",
                                fontWeight: "700"
                            }}>Savings</p>
                            <p style={{
                                fontSize:"48px",
                            }}>Smart Savings That Actually Save You</p>
                        </div>
                        <div style={{}}>
                            <img src="../WalletOnCard.svg" alt=""/>
                        </div>
                    </section>
                    <section>
                        <img src="../Escrow.svg" alt=""/>
                        <div className="tagline">
                            <p style={{
                                color: "#e30101", 
                                fontSize: "18px",
                                fontWeight: "700"
                            }}>Creating Agreements</p>
                            <p style={{
                                fontSize:"48px",
                            }}>Escrow in One Line, No more trust issues. No more fear.</p>
                        </div>
                    </section>
                </div>
                <div className="highlights">
                    <div className="backdrop"></div>
                    <div className="benito">
                        <div className="card1 card"></div>
                        <div className="card2 card"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}