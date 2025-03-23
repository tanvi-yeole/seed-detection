"use client"

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      });
    } else {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        setImage(canvasRef.current.toDataURL("image/png"));
        setOpen(false);
      }
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto p-6 shadow-xl bg-white rounded-2xl">
        <CardContent className="flex flex-col items-center space-y-4">
          {image ? (
            <img src={image} alt="Uploaded" className="w-full h-96 object-cover rounded-xl" />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
              No Image Selected
            </div>
          )}
          <div className="flex gap-4">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button type="button" onClick={openFilePicker} variant="outline" className="flex items-center gap-2">
              <Upload size={18} /> Upload Image
            </Button>
            <Button type="button" onClick={() => setOpen(true)} variant="outline" className="flex items-center gap-2">
              <Camera size={18} /> Capture Image
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Capture Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <video ref={videoRef} className="w-full rounded-lg" />
            <canvas ref={canvasRef} className="hidden" />
            <Button type="button" onClick={captureImage} className="mt-4">Capture</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}