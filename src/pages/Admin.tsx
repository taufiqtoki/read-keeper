import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { Upload, Plus } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [newBookmark, setNewBookmark] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      // Store the file reference in localStorage (in a real app, we'd use proper storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem("bookPdf", e.target?.result as string);
        toast.success("PDF uploaded successfully!");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a PDF file");
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