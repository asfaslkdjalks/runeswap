import React from 'react';
import SwapWidget from './components/SwapWidget';
import StickerBuilder from './components/PFPGenerator2';
import Details from './components/Details'
import './App.css';
import yew from './Yew_tree.webp'
import durial from './fanellaman.webp'
import haitus from './haitus.png'
import trio from './trio.png'
import max from './max.gif'
import capy from './capy.gf.gif'
import paper from './paper.webp'
import bronze from './bronze.png'
import chaos from './chaos.webp'
import noob from './noob.png'
import waterfall from './waterfall.png'
import scenery from './scenery.webp'
import sand from './sand.png'
import hill from './hill.png'
import zulrah from './zulrah.png'
import bandos from './bandos.png'
import dragon from './dragon.png'
import jelly from './jelly.png'
import kraken from './kraken.png'
import edmond from './edmons.webp'
import willow from './willow.webp'
import { FaTwitter, FaTelegramPlane } from 'react-icons/fa';


function App() {
  return (
    <div className="App">
    <div className='icons'>
      <div class="twicon">
        <a href="https://twitter.com/based_rsgp" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={30} color='black' />
        </a>
      </div>
      <div class="telicon">
      <a href="https://t.me/based_rsgp" target="_blank" rel="noopener noreferrer">
        <FaTelegramPlane size={30} color='black' />
      </a>
      </div>
    </div>
      <div className='willow'>
        <img src={willow}/>
      </div>
      <div className='kraken'>
        <img src={kraken}/>
      </div>
      <div className='edmond3'>
        <img src={edmond}/>
      </div>
      <div className='edmond'>
        <img src={edmond}/>
      </div>
      <div className='edmond2'>
        <img src={edmond}/>
      </div>
      <div className='jelly'>
        <img src={jelly}/>
      </div>
      <div className='zulrah'>
        <img src={zulrah}/>
      </div>
      <div className='dragon'>
        <img src={dragon}/>
      </div>
      <div className='bandos'>
        <img src={bandos}/>
      </div>
      <div className='hill'>
        <img src={hill}/>
      </div>
      <div className='sand'>
        <img src={sand}/>
      </div>
      <div className='scenery'>
        <img src={scenery}/>
      </div>
      <div className='waterfall'>
        <img src={waterfall}/>
      </div>
      <div className='waterfall2'>
        <img src={waterfall}/>
      </div>
      <div className='noob'>
        <img src={noob}/>
      </div>
      <div className='chaos'>
        <img src={chaos}/>
      </div>
      <div className='bronze'>
        <img src={bronze}/>
      </div>
      <div className='paper'>
        <img src={paper}/>
      </div>
      <div className='capy'>
        <img src={capy}/>
      </div>
      <div className='max'>
        <img src={max}/>
      </div>
      <div className='trio'>
        <img src={trio}/>
      </div>
      <div className='haitus'>
        <img src={haitus}/>
      </div>
      <div className='yew2'>
        <img src={yew}/>
      </div>
        <SwapWidget />
      <div className='durial'>
        <img src={durial}/>
      </div>
      <StickerBuilder/>
    </div>
  );
}

export default App;
