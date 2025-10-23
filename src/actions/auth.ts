'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const role = formData.get('role') || 'standard'

  // In a real app, you'd validate credentials against a database
  if (email && password) {
    const user = {
      name: 'Demo User',
      email: email as string,
      role: role as string,
    }
    cookies().set('session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    redirect('/dashboard')
  } else {
    // Handle error case
    redirect('/login?error=Invalid credentials')
  }
}

export async function logout() {
  cookies().delete('session')
  redirect('/login')
}
