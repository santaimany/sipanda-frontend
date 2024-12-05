import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import DekorasiAtas from "../assets/Group 1000005180.png"; // Dekorasi atas
import DekorasiBawah from "../assets/Group 1000005186.png"; // Dekorasi bawah
import Logo from "../assets/Group 2.png"; // Logo

const WaitingListPage = () => {
  const [licenseKey, setLicenseKey] = useState("");
  const [scanning, setScanning] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const navigate = useNavigate();

  const startCamera = () => {
    console.log("Attempting to start camera...");
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          console.log("Camera access granted.");
          setVideoStream(stream);
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setScanning(true);

            // Set canvas size to match video
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }

            console.log("Camera started successfully.");
          };
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error);
          alert("Could not access camera. Please check permissions and device settings.");
        });
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setScanning(false);
    console.log("Camera stopped.");
  };

  const scanQRCode = () => {
    if (!scanning || !canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext("2d", { willReadFrequently: true });
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (qrCode) {
      console.log("QR Code detected:", qrCode.data);
      setLicenseKey(qrCode.data);

      // Stop scanning after detecting QR code
      stopCamera();

      // Verify the QR Code
      verifyQRCode(qrCode.data);
    } else {
      requestAnimationFrame(scanQRCode);
    }
  };

  const verifyQRCode = async (qrCode) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://sipanda-production.up.railway.app/api/user/verify-qr-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ license_key: qrCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        navigate("/login");
      } else {
        setMessage(data.message || "An error occurred during verification.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Error verifying QR Code:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scanning) {
      console.log("Starting QR scan...");
      const scanInterval = setInterval(() => {
        scanQRCode();
      }, 100); // Scan every 100ms

      return () => {
        clearInterval(scanInterval);
        stopCamera();
      };
    }
  }, [scanning]);

  return (
    <div className="relative min-h-screen flex justify-center items-center font-poppins overflow-hidden">
      {/* Decorations */}
      <img
        src={DekorasiAtas}
        alt="Dekorasi Atas"
        className="absolute top-0 right-0 max-w-[200px] md:max-w-[300px] rotate-90"
      />
      <img
        src={DekorasiBawah}
        alt="Dekorasi Bawah"
        className="absolute bottom-0 left-0 max-w-[200px] md:max-w-[300px]"
      />

      {/* Logo */}
      <div className="absolute top-5 left-5">
        <img src={Logo} alt="Logo" className="h-8" />
      </div>

      {/* Main Content */}
      <div className="p-5 bg-[#327A6D] shadow-lg rounded-lg w-full max-w-md">
        <div className="text-center">
          <p className="text-sm mb-4 text-white">
            Scan the QR Code to input your license key automatically.
          </p>
          <div
            id="camera-box"
            className="relative bg-white flex justify-center items-center text-white font-bold rounded-lg mb-4 w-full h-64"
          >
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full rounded-lg hidden"
            />
          </div>
          <button
            onClick={startCamera}
            disabled={scanning || loading}
            className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition ${
              scanning ? "bg-gray-400" : "bg-[#48B09D] hover:bg-[#327a6d]"
            }`}
          >
            {scanning ? "Scanning..." : "Activate Camera"}
          </button>
          <label
            htmlFor="license-key"
            className="block text-left text-sm text-white mb-2"
          >
            License Key
          </label>
          <input
            type="text"
            id="license-key"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="Enter your license key"
            className="w-full px-4 py-2 border border-gray-600 rounded-lg mb-4 outline-none"
            readOnly
          />
          <button
            onClick={() => verifyQRCode(licenseKey)}
            disabled={loading || !licenseKey}
            className={`w-full px-4 py-2 rounded-lg transition ${
              loading ? "bg-gray-400" : "bg-[#EAF8EF] text-black hover:bg-gray-200"
            }`}
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>
          {message && (
            <p className={`text-sm mt-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </div>
        <footer className="mt-6 text-center">
         
          <p className="text-sm text-white mb-4 text-center">
            Already Verified?{" "}
            <span
              className="font-bold text-[#48B09D] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WaitingListPage;
