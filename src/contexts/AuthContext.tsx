import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";
import { setCookie } from 'nookies'
import Router from 'next/router'

type User = {
  email: string;
  permissions: string[];
  roles: string[]
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const { data } = await api.post('sessions', {
        email,
        password
      })

      const { token, refreshToken, permissions, roles } = data
      setUser({ email, permissions, roles })

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      Router.push('/dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated, 
      signIn,
      user
    }}>
      { children }
    </AuthContext.Provider>
  )

}