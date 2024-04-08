import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import '../styles.css';

import { headshotAdjustments, backgroundAdjustments } from '../constants/adjustments';
import bphat from './bphat.webp';
import santa from './santa.webp';
import bcav from './blackcav.webp'
import tcav from './browncav.webp'
import santa2 from './santa2.webp'

const zIndexes = {
    headshot: 10,
    background: 5,
    sticker: 20 // Ensure this is higher than headshot and background
};

const StickerBuilder = () => {
    const [currentHeadshotIndex, setCurrentHeadshotIndex] = useState(0);
    const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
    const [headshots, setHeadshots] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [stickers, setStickers] = useState([]);

    const canvasRef = useRef(null);
    const headshotRef = useRef(null);
    const backgroundRef = useRef(null);

    useEffect(() => {
        const headshotContext = require.context('../../public/headshots', false, /\.(png|jpe?g|svg|webp)$/);
        const headshotImages = headshotContext.keys().map(headshotContext);
        setHeadshots(headshotImages);

        const backgroundContext = require.context('../../public/bgs', false, /\.(png|jpe?g|svg|webp)$/);
        const backgroundImages = backgroundContext.keys().map(backgroundContext);
        
        setBackgrounds(backgroundImages);
    }, []);

    useEffect(() => {
        const canvas = new fabric.Canvas('nft-canvas', {
            width: 400,
            height: 400,
            preserveObjectStacking: true,
        });
        canvasRef.current = canvas;

        const handleObjectSelected = (options) => {
            if (options.target) {
                options.target.bringToFront();
                canvasRef.current.renderAll();
            }
        };

        canvas.on('selection:created', handleObjectSelected);
        canvas.on('selection:updated', handleObjectSelected);

        const canvasContainer = document.getElementById('nft-canvas').parentElement;
        if (canvasContainer) {
            canvasContainer.style.width = '400px';
            canvasContainer.style.height = '400px';
        }
    
        return () => {
            canvas.off('selection:created', handleObjectSelected);
            canvas.off('selection:updated', handleObjectSelected);
            canvas.dispose();
        };
    }, []);

    useEffect(() => {
        if (headshots.length > 0 && backgrounds.length > 0) {
            loadHeadshot(currentHeadshotIndex);
            loadBackground(currentBackgroundIndex);
        }
    }, [currentHeadshotIndex, currentBackgroundIndex, headshots, backgrounds]);

    const loadHeadshot = (index) => {
        if (!canvasRef.current || index >= headshots.length) return;
        fabric.Image.fromURL(headshots[index], (oImg) => {
            // Assume the original image size is larger than the canvas size
            const targetWidth = 350;
            const targetHeight = 350;
            const canvasPaddingTop = 50;
            const canvasPaddingRight = 50;
            const canvasPaddingBottom = 25;
            const canvasPaddingLeft = 25;
      
            const scaleRatio = Math.min(targetWidth / oImg.width, targetHeight / oImg.height);
            const scale = scaleRatio * 0.9; // Apply a slightly smaller scale
            oImg.scale(scale);

            const leftPosition = (targetWidth - oImg.getScaledWidth()) / 2 + canvasPaddingLeft;
            const topPosition = (targetHeight - oImg.getScaledHeight()) / 2 + canvasPaddingTop;

            const { leftAdjust = 0, topAdjust = 0 } = headshotAdjustments[index] || {};
    
            canvasRef.current.setWidth(targetWidth + canvasPaddingLeft + canvasPaddingRight);
            canvasRef.current.setHeight(targetHeight + canvasPaddingTop + canvasPaddingBottom);
    
            oImg.set({
                left: leftPosition + leftAdjust,
                top: topPosition + topAdjust,
                selectable: false,
                evented: false,
            }).scale(scale); // Apply the scale

            if (headshotRef.current) {
                canvasRef.current.remove(headshotRef.current);
            }
            headshotRef.current = oImg; // Update the current headshot reference
            canvasRef.current.add(oImg); // Add the new headshot to the canvas
            canvasRef.current.moveTo(oImg, zIndexes.headshot); // Move it to its proper z-index
            stickers.forEach(sticker => canvasRef.current.bringToFront(sticker)); // Re-apply stickers on top
            canvasRef.current.renderAll(); // Re-render the canvas to apply changes
        });

    };

    const loadBackground = (bgIndex) => {
        if (!canvasRef.current) return;
        fabric.Image.fromURL(backgrounds[bgIndex], (bgImg) => {
            if (!canvasRef.current) return;
          // Default adjustments if none are specified for the current background
          const defaultAdjustments = { leftAdjust: 0, topAdjust: 0, scale: 1 };
          const adjustments = backgroundAdjustments[bgIndex] || defaultAdjustments;
      
          const width = canvasRef.current.width * adjustments.scale;
          const height = canvasRef.current.height * adjustments.scale;
          
      
          bgImg.set({
            width: width,
            height: height,
            left: adjustments.leftAdjust,
            top: adjustments.topAdjust,
            originX: 'left',
            originY: 'top',
            selectable: false,
            evented: false,
          });

          if (!canvasRef.current) return;
      
          // Use setBackgroundImage to keep it as a background but apply adjustments
          canvasRef.current.setBackgroundImage(bgImg, () => canvasRef.current.renderAll(), {
            // These options allow for the adjusted position and scale
            originX: 'left',
            originY: 'top',
            top: adjustments.topAdjust,
            left: adjustments.leftAdjust,
          });
          if (backgroundRef.current) {
            canvasRef.current.remove(backgroundRef.current); // Remove the old background only if it exists
        }
        backgroundRef.current = bgImg; // Update the current background reference
        canvasRef.current.add(bgImg); // Add the new background to the canvas
        canvasRef.current.sendToBack(bgImg); // Send it to the very back
        if (headshotRef.current) {
            canvasRef.current.moveTo(headshotRef.current, zIndexes.headshot); // Make sure the headshot is just above the background
        }
        stickers.forEach(sticker => canvasRef.current.bringToFront(sticker)); // Re-apply stickers on top
        canvasRef.current.renderAll(); // Re-render the canvas to apply changes
        });
        updateLayers();
      };

      const handleNextHeadshot = () => {
        const newIndex = (currentHeadshotIndex + 1) % headshots.length;
        setCurrentHeadshotIndex(newIndex);
        loadHeadshot(newIndex); // Load the new headshot
    };
    
    const handlePrevHeadshot = () => {
        const newIndex = currentHeadshotIndex - 1 < 0 ? headshots.length - 1 : currentHeadshotIndex - 1;
        setCurrentHeadshotIndex(newIndex);
        loadHeadshot(newIndex); // Load the new headshot
    };
    
    const handleNextBackground = () => {
        const newIndex = (currentBackgroundIndex + 1) % backgrounds.length;
        setCurrentBackgroundIndex(newIndex);
        loadBackground(newIndex); // Load the new background
    };
    
    const handlePrevBackground = () => {
        const newIndex = currentBackgroundIndex - 1 < 0 ? backgrounds.length - 1 : currentBackgroundIndex - 1;
        setCurrentBackgroundIndex(newIndex);
        loadBackground(newIndex); // Load the new background
    };



    const handleDragStart = (e) => {
        if(e.target.alt == 'santa'){
            e.dataTransfer.setData("text/plain", santa2);
        } else {
            e.dataTransfer.setData("text/plain", e.target.src); 
        }// Pass the src of the dragged image
      };

      useEffect(() => {
        const canvasContainer = document.getElementById('nft-canvas').parentElement;
        if (canvasContainer) {
          canvasContainer.addEventListener('dragover', handleDragOver);
          canvasContainer.addEventListener('drop', handleDrop);
        }
      
        return () => {
          if (canvasContainer) {
            canvasContainer.removeEventListener('dragover', handleDragOver);
            canvasContainer.removeEventListener('drop', handleDrop);
          }
        };
      }, []);

      const handleDragOver = (e) => {
        e.preventDefault(); // Necessary for the drop event to fire
      };


      const handleDrop = (e) => {
        e.preventDefault();
        const canvasRect = canvasRef.current.getElement().getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;


        const imageUrl = e.dataTransfer.getData("text/plain");

        fabric.Image.fromURL(imageUrl, (img) => {
            // Get the scale ratios
            const scaleX = 100 / img.width * 2.3;
            const scaleY = 100   / img.height * 1.5; 
    
            img.set({
                left: x - (150 / 2), // Adjust for the scaled image size
                top: y - (150 / 2),  // Adjust for the scaled image size
                scaleX: scaleX,
                scaleY: scaleY,
            });
            canvasRef.current.add(img).renderAll();
  
            // After adding a new sticker, immediately bring it to the front
            bringStickerToFront(img);
        });
    };

    const bringStickerToFront = (sticker) => {
        // Use a function to ensure that the sticker always stays on top
        canvasRef.current.bringToFront(sticker);
        setStickers((prevStickers) => [...prevStickers.filter(s => s !== sticker), sticker]); // Reorder stickers array
        canvasRef.current.renderAll();
    };

    const updateLayers = () => {
        // Set z-index for headshot and background
        if (backgroundRef.current) {
            canvasRef.current.sendToBack(backgroundRef.current);
        }
        if (headshotRef.current) {
            canvasRef.current.sendBackwards(headshotRef.current, true); // Move behind stickers but above background
        }
    
        // Set z-index for stickers
        stickers.forEach(sticker => {
            // Instead of bringToFront, manually set z-index
            canvasRef.current.moveTo(sticker, 2);
        });
    
        canvasRef.current.renderAll();
    };
            
      
      

    return (
        <div className="pfp-generator">
            <h1 className="title">Create a PFP</h1>
            <div className="headshot-controls">
                <button className='next' onClick={handlePrevHeadshot}>Prev</button>
                <button className='next' onClick={handleNextHeadshot}>Next</button>
                <button className='next' onClick={handlePrevBackground}>Prev Background</button>
                <button className='next' onClick={handleNextBackground}>Next Background</button>
            </div>
            <canvas id="nft-canvas" className="nft-canvas" />
            <div id="sticker-panel" onDragOver={(e) => e.preventDefault()}>
                <img
                    src={bphat}
                    className="sticker"
                    draggable="true"
                    alt="Phat"
                    width={100}
                    height={100 }
                    onDragStart={handleDragStart} // This is correct
                />
                <img
                    src={santa}
                    className="sticker"
                    draggable="true"
                    alt="santa"
                    width={100}
                    height={100 }
                    onDragStart={handleDragStart} // This is correct
                />
                <img
                    src={bcav}
                    className="sticker"
                    draggable="true"
                    alt="Phat"
                    width={100}
                    height={100 }
                    onDragStart={handleDragStart} // This is correct
                />
                 <img
                    src={tcav}
                    className="sticker"
                    draggable="true"
                    alt="Phat"
                    width={100}
                    height={100 }
                    onDragStart={handleDragStart} // This is correct
                />
                {/* Add more stickers here */}
            </div>
        </div>
    );
};

export default StickerBuilder;
