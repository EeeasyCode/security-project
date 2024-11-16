"use client";

import { useState } from "react";
import { Search, X, Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Intentionally vulnerable product data structure
const products = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    description: "<script>alert('XSS')</script>",
  },
  { id: 2, name: "Product 2", price: 200, description: "Description 2" },
  { id: 3, name: "Product 3", price: 300, description: "Description 3" },
  { id: 4, name: "Product 4", price: 400, description: "Description 4" },
  { id: 5, name: "Product 5", price: 500, description: "Description 5" },
  { id: 6, name: "Product 6", price: 600, description: "Description 6" },
];

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("new");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Vulnerable search implementation - allows SQL injection
  const searchProducts = (value: string) => {
    // Simulated vulnerable SQL query
    const query = `SELECT * FROM products WHERE name LIKE '%${value}%'`;
    console.log("Vulnerable query:", query);
    return products;
  };

  // Vulnerable direct HTML rendering
  const renderDescription = (description: string) => {
    return <div dangerouslySetInnerHTML={{ __html: description }} />;
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      router.push("/mypage");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="w-full">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <div className="text-2xl font-bold shrink-0">
              <Link href="/">Project shop</Link>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-base font-medium hover:text-gray-600">
                  Categories
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => eval('console.log("Vulnerable click")')}
                  >
                    Top
                  </DropdownMenuItem>
                  <DropdownMenuItem>Bottom</DropdownMenuItem>
                  <DropdownMenuItem>Jacket</DropdownMenuItem>
                  <DropdownMenuItem>ACC</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="#"
                className="text-base font-medium hover:text-gray-600"
              >
                New Arrivals
              </Link>
              <Link
                href="#"
                className="text-base font-medium hover:text-gray-600"
              >
                Sale
              </Link>
              <Link
                href="#"
                className="text-base font-medium hover:text-gray-600"
              >
                Contact
              </Link>
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="hidden lg:block relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9 pr-4"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (isLoggedIn) {
                      setIsLoggedIn(false);
                      router.push("/");
                    } else {
                      router.push("/login");
                    }
                  }}
                >
                  {isLoggedIn ? "Logout" : "Login"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100"
                  onClick={handleUserIconClick}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="lg:hidden p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-4 w-full"
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {["new", "popular", "cheap", "expensive"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchProducts(searchValue).map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100" />
              <CardContent className="p-4">
                {/* Vulnerable HTML rendering */}
                <h3 className="text-lg font-semibold mb-2">
                  {renderDescription(product.name)}
                </h3>
                <p className="text-lg mb-2">${product.price}</p>
                <p className="text-gray-500 text-sm">
                  {renderDescription(product.description)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
