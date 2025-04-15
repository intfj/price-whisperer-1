
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  query: string;
  onChange: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ query, onChange }) => {
  return (
    <div className="flex items-center space-x-2 relative">
      <Search className="absolute left-3 text-muted-foreground" size={18} />
      <Input
        type="text"
        placeholder="Enter product name, ASIN, UPC, or keywords..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default SearchInput;
