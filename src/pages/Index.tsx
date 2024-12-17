import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { BookOpen, Bookmark } from "lucide-react";

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    // Load saved page from localStorage
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem("bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">My Book Reader</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif">Continue Reading</h2>
            </div>
            <p className="text-lg mb-4">You're currently on page {currentPage}</p>
            <Button 
              className="w-full"
              onClick={() => {
                // This will be implemented when we add PDF viewing functionality
                console.log("Continue reading from page", currentPage);
              }}
            >
              Continue Reading
            </Button>
          </Card>

          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Bookmark className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif">Bookmarks</h2>
            </div>
            {bookmarks.length > 0 ? (
              <ul className="space-y-2">
                {bookmarks.map((page) => (
                  <li key={page} className="flex items-center justify-between">
                    <span>Page {page}</span>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // This will be implemented when we add PDF viewing functionality
                        console.log("Jump to page", page);
                      }}
                    >
                      Go to page
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No bookmarks yet. Add some from the admin page!</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;