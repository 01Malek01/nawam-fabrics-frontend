import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { airtableService } from "../services/airtable";

export default function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/categories/all?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    // fetch categories when the search UI opens
    if (!isSearchOpen) return;
    let mounted = true;
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        // Fetch categories table (so we get names and ids)
        const allCategories = await airtableService.getAllRecords("Categories");
        // Filter main categories (no ParentCategory) and map to {id,name}
        const mainCategories = allCategories
          .filter((c: any) => !c?.ParentCategory)
          .map((c: any) => ({ id: c.id, name: c.Name || c.name || "" }));

        if (mounted) setCategories(mainCategories.filter((c: any) => c.name));
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        if (mounted) setIsLoadingCategories(false);
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, [isSearchOpen]);

  const handleCategoryClick = (cat: string) => {
    // navigate to categories/:id
    setIsSearchOpen(false);
    navigate(`/categories/${encodeURIComponent(cat)}`);
    setSearchQuery("");
  };

  return (
    <div className="relative flex items-center">
      {isSearchOpen ? (
        <div className="relative">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="ابحث عن الأقمشة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] md:w-[300px]"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => setIsSearchOpen(false)}
            >
              ×
            </Button>
          </form>

          {/* Categories dropdown */}
          <div className="absolute left-0 top-full mt-2 w-[200px] md:w-[300px] bg-white dark:bg-gray-800 border rounded shadow-md z-50">
            {isLoadingCategories ? (
              <div className="p-3 text-center">جاري التحميل...</div>
            ) : categories.length === 0 ? (
              <div className="p-3 text-center">لا توجد فئات</div>
            ) : (
              <ul className="max-h-56 overflow-auto">
                {categories.map((c) => (
                  <li key={c.id}>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleCategoryClick(c.id)}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          className="hover:bg-transparent"
        >
          <Search className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
