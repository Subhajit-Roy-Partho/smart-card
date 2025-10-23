'use server'

import { redirect } from 'next/navigation'
import { handleLogout } from '@auth0/nextjs-auth0';

export async function login(formData: FormData) {
  // This is now handled by Auth0
  redirect('/api/auth/login');
}

export async function logout() {
  await handleLogout();
  redirect('/');
}
