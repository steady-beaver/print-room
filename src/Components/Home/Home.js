import React from 'react'
import Merit from './Merit'
import './home.css'

const Home = () => {
    return (
        <div className="home-panel">
            <Merit 
                img_url={"/assets/posters-group.png"} 
                heading={"Exclusive selection"} 
                text={"Diversity of modern actions as well as evergreen classics. Search in our extensive database that will serve all of your whims."} 
                />
            <Merit 
                classes="reverse"
                img_url={"/assets/tarantino-posturing.png"} 
                heading={"Create perfect setting"} 
                text={"Bring  the cinematic atmosphere into your place. And make your favourite characters come to live with help of our posters."}
            />
            <Merit 
                img_url={"/assets/harley-birds-of-prey-poster.png"} 
                heading={"Palpate blogbusters"} 
                text={"Warm up for the most waited titles this season. Ignite your imagination with the original cover even before release date."}
            />
            <Merit 
                classes="reverse"
                img_url={"/assets/capitan-america-poster.png"} 
                heading={"Immersive adventure"} 
                text={"Bring  the cinematic atmosphere into your place. And make your favourite characters come to live with help of our posters."}
            />
        </div>
    )
}

export default Home
