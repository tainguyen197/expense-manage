"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const Header = () => {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <SparklesIcon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">AI Chat</span>
          </Link>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-8">
            <Link
              href="/chat"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/history"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              History
            </Link>
            <Link
              href="/statics"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Statistics
            </Link>
            <Link
              href="/settings"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Settings
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            <Link
              href="/about"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              About
            </Link>

            {isLoaded && !isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-foreground/80 hover:text-foreground transition-colors">
                    Login
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </motion.button>
                </SignUpButton>
              </>
            ) : (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
