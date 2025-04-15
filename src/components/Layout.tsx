
import React from "react";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b shadow-sm">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500 text-white p-2 rounded-md">
              <MoveRight size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              PriceWhisperer
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">{children}</main>

      <footer className="bg-muted py-6">
        <div className="container text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} PriceWhisperer. All rights reserved.</p>
          <p className="text-sm mt-1">Pricing analysis made simple for product sellers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
