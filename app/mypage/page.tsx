"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
  name: string;
  email: string;
  address: string;
  customInfo: string;
}

export default function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Vulnerable data fetching
    const fetchUserData = async () => {
      // Simulating API call
      const data: UserData = {
        name: "John Doe",
        email: "john@example.com",
        address: "123 Vulnerable St, Insecure City, 12345",
        customInfo: '<script>alert("XSS vulnerability")</script>',
      };
      setUserData(data);
    };
    fetchUserData();
  }, []);

  return (
    <div className="w-full">
      <main className="max-w-2xl mx-auto mt-8 px-6 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Page</h2>
            {userData ? (
              <div>
                <p>
                  <strong>Name:</strong> {userData.name}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Address:</strong> {userData.address}
                </p>
                {/* Vulnerable rendering of user data */}
                <div
                  dangerouslySetInnerHTML={{ __html: userData.customInfo }}
                />
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
            <Button onClick={() => router.push("/")} className="mt-4">
              Logout
            </Button>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-500 mt-4 inline-block"
            >
              Return to Home
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
