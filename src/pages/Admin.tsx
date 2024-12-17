import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { openDB } from 'idb';

// Initialize the IndexedDB database
const initDB = async () => {
  return openDB('bookDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pdf')) {
        db.createObjectStore('pdf');
      }
    },
  });
};

const Admin = () => {
  const [newBookmark, setNewBookmark] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const db = await initDB();
          await db.put('pdf', e.target?.result, 'bookPdf');
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

  const addBookmark = () => {
    const page = parseInt(newBookmark);
    if (isNaN(page) || page < 1) {
      toast.error("Please enter a valid page number");
      return;
    }

    const existingBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    if (!existingBookmarks.includes(page)) {
      const newBookmarks = [...existingBookmarks, page].sort((a, b) => a - b);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      setNewBookmark("");
      toast.success("Bookmark added!");
    } else {
      toast.error("This page is already bookmarked");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">Admin Panel</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif">Upload PDF</h2>
            </div>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="mb-4"
            />
          </Card>

          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif">Add Bookmark</h2>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter page number"
                value={newBookmark}
                onChange={(e) => setNewBookmark(e.target.value)}
                min="1"
              />
              <Button onClick={addBookmark}>Add</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;