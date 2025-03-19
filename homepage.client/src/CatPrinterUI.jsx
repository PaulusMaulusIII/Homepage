import { useState } from "react";
import "./CatPrinterUI.css";

export default function CatPrinterUI() {
    const [dpi, setDpi] = useState(200);
    const [energy, setEnergy] = useState(50);
    const [dithering, setDithering] = useState("Floyd-Steinberg");
    const [invert, setInvert] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container">
            {/* Left Panel - Controls */}
            <div className="panel">
                <h2>Printer Settings</h2>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />

                <label>DPI ({dpi})</label>
                <input type="range" min="100" max="600" value={dpi} onChange={(e) => setDpi(e.target.value)} className="slider" />

                <label>Energy Level ({energy}%)</label>
                <input type="range" min="0" max="100" value={energy} onChange={(e) => setEnergy(e.target.value)} className="slider" />

                <label>Dithering Algorithm</label>
                <select value={dithering} onChange={(e) => setDithering(e.target.value)} className="dropdown">
                    <option value="Floyd-Steinberg">Floyd-Steinberg</option>
                    <option value="Atkinson">Atkinson</option>
                    <option value="Ordered">Ordered</option>
                </select>

                <label>Invert Colors</label>
                <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} className="checkbox" />

                <div className="button-group">
                    <button className="button primary">Process Image</button>
                    <button className="button secondary">Print</button>
                </div>
            </div>

            {/* Right Panel - Image Preview */}
            <div className="panel preview">
                <h2>Preview</h2>
                <div className="preview-box">
                    {image ? (
                        <img src={image} alt="Preview" className={`preview-image ${invert ? "invert" : ""}`} />
                    ) : (
                        <p className="no-image">No image uploaded</p>
                    )}
                </div>
            </div>
        </div>
    );
}
