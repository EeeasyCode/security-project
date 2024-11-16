"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function MyPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      <main className="max-w-2xl mx-auto mt-8 px-6 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Page</h2>
            <div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {/* Vulnerable rendering of user data */}
              {/* <div
                dangerouslySetInnerHTML={{ __html: user.customInfo || "" }}
              /> */}
            </div>
            <Button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="mt-4"
            >
              Logout
            </Button>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-500 mt-4 inline-block ml-4"
            >
              Return to Home
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
