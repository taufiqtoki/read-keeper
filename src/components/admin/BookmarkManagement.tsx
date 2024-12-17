import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export const BookmarkManagement = () => {
  const [newBookmark, setNewBookmark] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const stored = localStorage.getItem("bookmarks");
    return stored ? JSON.parse(stored) : [];
  });
  const [editingBookmark, setEditingBookmark] = useState<{index: number, value: string} | null>(null);

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
  );
};