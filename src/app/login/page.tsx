import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 mb-8">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-center">
            Welcome to Smart Spend
            </h1>
            <p className="text-center text-muted-foreground">
                Sign in to your account to continue
            </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
