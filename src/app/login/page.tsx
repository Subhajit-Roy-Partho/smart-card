import { redirect } from 'next/navigation';

export default function LoginPage() {
  const authProvider = process.env.AUTH;
  if (authProvider === 'firebase') {
    redirect('/firebase-login');
  }

  // Redirect to Auth0 login
  redirect('/api/auth/login');
}
