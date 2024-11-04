import { type AuthConfig } from '@auth/core';
import { DefaultSession } from '@auth/core/types'

declare module '@auth/core/types' {
  interface Session {
    user?: DefaultSession['user'] & {
      accessToken?: string
    }
  }
}

export const authConfig = {
  providers: [
    {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      },
      token: 'https://oauth2.googleapis.com/token',
      userinfo: 'https://www.googleapis.com/oauth2/v2/userinfo',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    {
      id: 'facebook',
      name: 'Facebook',
      type: 'oauth',
      authorization: 'https://www.facebook.com/v11.0/dialog/oauth',
      token: 'https://graph.facebook.com/v11.0/oauth/access_token',
      userinfo: 'https://graph.facebook.com/me?fields=id,name,email,picture',
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token
        };
      }
      return token;
    },
    async session({ session, token }: { session: any, token: { accessToken?: string } }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error'
  },
  secret: process.env.AUTH_SECRET
} satisfies AuthConfig;