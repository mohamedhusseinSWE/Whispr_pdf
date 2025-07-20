"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { trpc } from "@/app/_trpc/client";

const formSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Registered successfully!");
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed.");
    },
  });

  const onSubmit = (data: FormData) => registerMutation.mutate(data);

  const loading = registerMutation.isPending; // ✔️ حالة التحميل الحقيقية

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-black dark:to-zinc-900 px-4 py-10">
      <div className="w-full max-w-xl p-12 rounded-3xl shadow-2xl border bg-white dark:bg-zinc-900">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground">
            Create an Account
          </h1>
          <p className="text-muted-foreground mt-1">
            Register to access your dashboard
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-xl mx-auto"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering…
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8 flex justify-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="ml-1 text-primary hover:underline cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
