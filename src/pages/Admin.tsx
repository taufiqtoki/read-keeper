import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { Upload, Trash2, Edit2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { openDB } from 'idb';
import { Progress } from "@/components/ui/progress";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [editingBookmark, setEditingBookmark] = useState<{index: number, value: string} | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load current file name and bookmarks on mount
  useEffect(() => {
    const loadCurrentFile = async () => {
      try {
        const db = await initDB();
        const file = await db.get('pdf', 'bookPdf');
        if (file) {
          setCurrentFile("Current PDF");
        }
      } catch (error) {
        console.error('Error loading file:', error);
      }
    };

    const loadBookmarks = () => {
      const stored = localStorage.getItem("bookmarks");
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    };

    loadCurrentFile();
    loadBookmarks();
  }, []);

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
          const db = await initDB();
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

  const handleDeleteFile = async () => {
    try {
      const db = await initDB();
      await db.delete('pdf', 'bookPdf');
      localStorage.removeItem("currentPage");
      setCurrentFile(null);
      setShowDeleteConfirm(false);
      toast.success("PDF deleted successfully");
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error("Failed to delete PDF");
    }
  };

  const addBookmark = () => {
    const page = parseInt(newBookmark);
    if (isNaN(page) || page < 1) {
      toast.error("Please enter a valid page number");
      return;
    }

    const existingBookmarks = [...bookmarks];
    if (!existingBookmarks.includes(page)) {
      const newBookmarks = [...existingBookmarks, page].sort((a, b) => a - b);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
      setNewBookmark("");
      toast.success("Bookmark added!");
    } else {
      toast.error("This page is already bookmarked");
    }
  };

  const updateBookmark = (index: number, newValue: string) => {
    const page = parseInt(newValue);
    if (isNaN(page) || page < 1) {
      toast.error("Please enter a valid page number");
      return;
    }

    const newBookmarks = [...bookmarks];
    newBookmarks[index] = page;
    newBookmarks.sort((a, b) => a - b);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
    setEditingBookmark(null);
    toast.success("Bookmark updated!");
  };

  const deleteBookmark = (index: number) => {
    const newBookmarks = bookmarks.filter((_, i) => i !== index);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
    toast.success("Bookmark deleted!");
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
              <h2 className="text-2xl font-serif">PDF Management</h2>
            </div>
            
            {!currentFile ? (
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
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{currentFile}</span>
                  {!showDeleteConfirm ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete PDF
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteFile}
                      >
                        <Check className="w-4 h-4" />
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif">Bookmarks Management</h2>
            </div>
            <div className="space-y-4">
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
              
              <div className="space-y-2">
                {bookmarks.map((bookmark, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {editingBookmark?.index === index ? (
                      <>
                        <Input
                          type="number"
                          value={editingBookmark.value}
                          onChange={(e) => setEditingBookmark({ index, value: e.target.value })}
                          min="1"
                          className="w-24"
                        />
                        <Button
                          size="sm"
                          onClick={() => updateBookmark(index, editingBookmark.value)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingBookmark(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">Page {bookmark}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingBookmark({ index, value: bookmark.toString() })}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBookmark(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;