import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [artworks, setArtworks]= useState([]);
  useEffect(()=>{
    async function fetchArtworks(){
      try{
        const response = await fetch('/gallery')
        const data = await response.json();
        setArtworks(data);

      }catch(error){
        console.error("Failed to fetch:", error);
      }
      
    }
    fetchArtworks();
  },[]);
  return (
    <>
      <header>
      <div className="header-title1">ᝰ🖌 Pixel Art Maker</div>
      <div className="header-title2">YOUR DIGITAL ART STUDIO</div>
    </header>
    <main>
      <div className="main-titles-container">
        <div className="main-title1">A SPACE FOR EVERYTHING YOU MAKE</div>
        <h1 className="main-title2">Saved artwork</h1>
        <p className="main-title3">
          Your colors, your stories. Pick up where you left off, or start
          something new.
        </p>
      </div>
      <section>
        <div className="art-grid-container"> {artworks.map((art) => (
          <div className="art-container" key={art.id}>
          <div className="image-container"  ><img src={art.img} alt={art.title}/></div>
          <div>
            <p className="title-art" >{art.title}</p>
            <div className='enreg-cont'><span className="pixel-square"></span>
             <p className='enreg'>ENREGITR LE</p> </div>
            <p className="date-art"   >{art.date}</p>
          </div>
        </div>))}</div>
       

      </section>
    </main>

    <footer>✿ A little collection. Entirely yours.</footer>
    
    </>
  )
}

export default App

