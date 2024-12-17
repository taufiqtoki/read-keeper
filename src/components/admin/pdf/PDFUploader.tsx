import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { openDB } from 'idb';

interface PDFUploaderProps {
  setCurrentFile: (file: string | null) => void;
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
}

export const PDFUploader = ({ setCurrentFile, uploadProgress, setUploadProgress }: PDFUploaderProps) => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadstart = () => setUploadProgress(0);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };
      
      reader.onload = async (e) => {
        try {
          const db = await openDB('bookDB', 1, {
            upgrade(db) {
              if (!db.objectStoreNames.contains('pdf')) {
                db.createObjectStore('pdf');
              }
            },
          });
          await db.put('pdf', e.target?.result, 'bookPdf');
          setCurrentFile("Current PDF");
          setUploadProgress(100);
          toast.success("PDF uploaded successfully!");
        } catch (error) {
          console.error('Error storing PDF:', error);
          toast.error("Failed to store PDF. The file might be too large.");
        }
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error("Failed to read the PDF file");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress value={uploadProgress} className="w-full" />
      )}
    </div>
  );
};