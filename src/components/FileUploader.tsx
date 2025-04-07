
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, XCircle, Image as ImageIcon } from "lucide-react";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleFile = (file: File) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelected(file);
    } else {
      alert("Please upload a valid image file (JPEG or PNG)");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full mt-6">
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Upload your handwriting image</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Drag and drop your image here, or click to browse. We accept JPG and PNG files.
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="mt-2"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Browse files
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <img src={preview} alt="Handwriting preview" className="w-full max-h-[400px] object-contain my-4" />
          <Button 
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-white/70 hover:bg-white"
            onClick={clearImage}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
