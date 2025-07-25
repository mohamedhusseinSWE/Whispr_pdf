// app/(auth)/login/page.tsx

import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <LoginForm />
    </div>
  );
}
