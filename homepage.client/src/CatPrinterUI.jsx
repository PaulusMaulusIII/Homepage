import './CatPrinterUI.css';
import { useState } from 'react';

function CatPrinterUI() {
    function setEnergy(energy) {
        if (0x0000 < energy <= 0xffff && energy.length == 6) {
            console.log(energy);
        }
    }

    function setDithering(algorithm) {
        console.log(algorithm)
    }

    function getFile() {

    }

    return (<div id="container">
        <div id="image preview">
        </div>
        <div id="options">
            <div id="image-options">
                <input type="file"></input>
                <select required={true} onChange={ e => setDithering(e.target.value)}>
                    <option value="">-- Please choose a dithering algorithm  --</option>
                    <optgroup label="No Dithering">
                        <option value="none">No Dithering</option>
                    </optgroup>
                    <optgroup label="Simple Dithering">
                        <option value="halftone">Half Tone</option>
                    </optgroup>
                    <optgroup label="Smart Dithering">
                        <option value="atkinson">Atkinson Dithering</option>
                        <option value="floyd-steinberg">Floyd-Steinberg Dithering</option>
                    </optgroup>
                </select>
                <input type="checkbox"></input>
                <label>Invert Image</label>
            </div>
            <div id="print-options">
                <input id="energy" defaultValue="0xFFFF" onChange={e => setEnergy(e.target.value)}></input>
            </div>
        </div>
    </div>
    );
}

export default CatPrinterUI;