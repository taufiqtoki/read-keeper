import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PDFManagement } from "@/components/admin/PDFManagement";
import { BookmarkManagement } from "@/components/admin/BookmarkManagement";
import { openDB } from 'idb';

const Admin = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  // Load current file name on mount
  useEffect(() => {
    const loadCurrentFile = async () => {
      try {
        const db = await openDB('bookDB', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('pdf')) {
              db.createObjectStore('pdf');
            }
          },
        });
        const file = await db.get('pdf', 'bookPdf');
        if (file) {
          setCurrentFile("Current PDF");
        }
      } catch (error) {
        console.error('Error loading file:', error);
      }
    };

    loadCurrentFile();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">Admin Panel</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <PDFManagement
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
          />
          <BookmarkManagement />
        </div>
      </main>
    </div>
  );
};

export default Admin;