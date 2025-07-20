"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button, buttonVariants } from "./ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";

import {
  ArrowRight,
  LogOut,
  User,
  ChevronDown,
  LayoutDashboard,
  Info,
  MessageCircle,
  Home,
  DollarSign,
} from "lucide-react";
import { trpc } from "@/app/_trpc/client";

const Navbar = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false, // Don't retry failed auth requests
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on component mount
  });

  // Helper function to refresh user data - can be called from login components
  const refreshUserData = async () => {
    await utils.auth.me.invalidate();
  };

  const logout = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      toast.success("Logged out successfully!");
      // Clear the user data from cache immediately
      utils.auth.me.setData(undefined, null);
      // Invalidate to refetch and ensure fresh state
      await utils.auth.me.invalidate();
      // Force a page refresh to ensure clean state
      window.location.href = "/login";
    },
    onError: () => {
      toast.error("Something went wrong. Try again.");
    },
  });

  const isNavLoading = isLoading || logout.isPending;

  // Show login/register buttons if no user or if logout is pending
  const showAuthButtons = !user || logout.isPending;

  return (
    <nav className="sticky h-16 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-40">
            <Image
              src="/logo.png"
              alt="Whispr PDF Logo"
              width={102}
              height={72}
              className="rounded-sm"
            />
            <span className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors duration-200">
              Whispr PDF
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <DollarSign className="h-4 w-4" />
              Pricing
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isNavLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-8 w-20 animate-pulse bg-gray-200 rounded" />
                <div className="h-10 w-32 animate-pulse bg-gray-200 rounded" />
              </div>
            ) : showAuthButtons ? (
              // Show login/register buttons when logged out or logging out
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className:
                      "text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200",
                  })}
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className={buttonVariants({
                    size: "sm",
                    className:
                      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200",
                  })}
                >
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </>
            ) : (
              // Show user dropdown when logged in
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className:
                      "hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200",
                  })}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-3 py-2 h-auto text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                    >
                      <User className="h-5 w-5" />
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {user?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user?.email}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild className="sm:hidden">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/billing"
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        Upgrade Plan
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        My Files
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                      onClick={() => logout.mutate()}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
