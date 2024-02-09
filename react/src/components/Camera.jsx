import React, { useRef, useState } from 'react';

const Camera = () => {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [geoTag, setGeoTag] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); 

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const toggleCameraFacingMode = () => {
    setFacingMode((prevFacingMode) => (prevFacingMode === 'user' ? 'environment' : 'user'));
    stopCamera(); 
    startCamera(); 
  };

  const capturePhoto = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
  
    if (geoTag) {
      try {
        const position = await getCurrentPosition();
        console.log('Geotagged position:', position);
  
        const geoTagText = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
        const backgroundWidth = ctx.measureText(geoTagText).width + 20; 
        const backgroundHeight = 20; 
  
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; 
        ctx.fillRect(10, 10, backgroundWidth, backgroundHeight);
  
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(geoTagText, 20, 25); 
  
        setCapturedGeoTag(position);
      } catch (error) {
        console.error('Error getting geolocation:', error);
      }
    }
  
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
  };
  
  
  

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        { enableHighAccuracy: true }
      );
    });
  };

  const handleGeoTagChange = () => {
    setGeoTag(!geoTag);
  };

  return (
    <div className='postcomponent camera'>
      <h4>Capture with Geo-tagged imaging.</h4>
      <h5>Click <span>Allow</span> in your browser's camera popup.</h5>
      <div className="imageview">
        {photo && (
          <div>
            <img src={photo} alt="Captured" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            <a href={photo} download="captured_photo.png">
              <strong>Download_Photo</strong>
            </a>
          </div>
        )}
        <video ref={videoRef} autoPlay muted style={{ display: 'block', margin: '10px 0', width:'400px'}} />
      </div>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={capturePhoto}>Capture Photo</button>
      <button onClick={stopCamera}>Stop Camera</button>
      <button onClick={toggleCameraFacingMode}>Toggle Camera</button>
      <label>
        GeoTag Photo
        <input type="checkbox" checked={geoTag} onChange={handleGeoTagChange} />
      </label>
      <div className="buffercamera"></div>
    </div>
  );
};

export default Camera;
