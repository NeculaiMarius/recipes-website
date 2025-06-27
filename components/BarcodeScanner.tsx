'use client';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
  active: boolean;
}

const BarcodeScanner = ({ onScan, onError, active }: BarcodeScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!active) return;

    const elementId = `barcode-scanner-${Date.now()}`;
    const container = document.createElement('div');
    container.id = elementId;
    document.getElementById('scanner-container')?.appendChild(container);

    const config = {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.ITF
      ],
      fps: 10,
      qrbox: {width:200, height:100}
    };

    scannerRef.current = new Html5QrcodeScanner(elementId, config, false);

    const successHandler = (decodedText: string) => {
      onScan(decodedText);
      scannerRef.current?.pause();
    };

    const errorHandler = (errorMessage: string) => {
      // onError?.(errorMessage); 
    };

    scannerRef.current.render(successHandler, errorHandler);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        container.remove();
      }
    };
  }, [active, onScan, onError]);

  return active ? <div id="scanner-container" className="sm:w-full lg:w-[50%] md:w-[70%]" /> : null;
};

export default BarcodeScanner;