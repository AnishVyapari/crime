import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import type { StatusInfo } from '../App';

interface CameraCaptureProps {
  onStatusChange: (status: StatusInfo) => void;
}

export const CameraCapture = forwardRef<
  { capturePhoto: () => string | null },
  CameraCaptureProps
>(({ onStatusChange }, ref) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const requestCameraPermission = async () => {
    onStatusChange({ message: '📷 Requesting camera permission...', type: 'info' });
    
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionStatus.state === 'granted') {
        setPermissionGranted(true);
        startCamera();
      } else if (permissionStatus.state === 'prompt') {
        startCamera();
      } else {
        onStatusChange({ 
          message: '❌ Camera permission denied. Please enable camera in browser settings.', 
          type: 'error' 
        });
      }
    } catch (error) {
      // Fallback if permissions API not supported
      startCamera();
    }
  };

  const startCamera = async () => {
    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setPermissionGranted(true);
      onStatusChange({ message: '✓ Camera ready. Click Capture Photo.', type: 'success' });
    } catch (error: any) {
      setPermissionGranted(false);
      if (error.name === 'NotAllowedError') {
        onStatusChange({ 
          message: '❌ Camera permission denied. Please click "Allow" when prompted or enable in browser settings.', 
          type: 'error' 
        });
      } else if (error.name === 'NotFoundError') {
        onStatusChange({ message: '❌ No camera found on your device.', type: 'error' });
      } else {
        onStatusChange({ message: '❌ Camera error: ' + error.message, type: 'error' });
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      onStatusChange({ message: '❌ Camera not started', type: 'error' });
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(photoData);
      onStatusChange({ message: '✓ Photo captured!', type: 'success' });
      stopCamera();
      return photoData;
    }
    return null;
  };

  useImperativeHandle(ref, () => ({
    capturePhoto,
  }));

  return (
    <div>
      <label className="block text-xs mb-2" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Take Photo for Wanted Poster
      </label>

      <div className="bg-black rounded-md overflow-hidden mb-3">
        {!capturedPhoto ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto block"
            style={{ display: stream ? 'block' : 'none' }}
          />
        ) : (
          <img src={capturedPhoto} alt="Captured" className="w-full h-auto block" />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2">
        {!capturedPhoto ? (
          <>
            <button
              onClick={permissionGranted ? startCamera : requestCameraPermission}
              className="flex-1 px-4 py-2.5 border-2 border-[#333] rounded-md bg-[#1a1a1a] text-[#e0e0e0] text-sm hover:border-[#2196F3] transition-all"
              style={{ fontWeight: 600 }}
            >
              {stream ? 'Restart Camera' : permissionGranted ? 'Start Camera' : '📷 Enable Camera'}
            </button>
            {stream && (
              <button
                onClick={capturePhoto}
                className="flex-1 px-4 py-2.5 bg-[#2196F3] text-white rounded-md text-sm hover:bg-[#1976D2] transition-all"
                style={{ fontWeight: 600 }}
              >
                📸 Capture Photo
              </button>
            )}
          </>
        ) : (
          <button
            onClick={() => {
              setCapturedPhoto(null);
              startCamera();
            }}
            className="flex-1 px-4 py-2.5 border-2 border-[#333] rounded-md bg-[#1a1a1a] text-[#e0e0e0] text-sm hover:border-[#2196F3] transition-all"
            style={{ fontWeight: 600 }}
          >
            🔄 Retake Photo
          </button>
        )}
      </div>
    </div>
  );
});

CameraCapture.displayName = 'CameraCapture';