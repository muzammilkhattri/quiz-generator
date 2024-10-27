import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        accept=".pptx,.docx,.pdf"
        onChange={handleFileChange}
        className="text-black"
      />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}
