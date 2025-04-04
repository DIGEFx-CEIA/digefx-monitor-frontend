import CredentialsProvider from "next-auth/providers/credentials";
import {
    getServerSession as getNextAuthServerSession,
    type NextAuthOptions,
} from "next-auth";

const API_URL = process.env.API_URL;

const credentialsProvider = CredentialsProvider({
    credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },        
    },
    async authorize(credentials) {
        try {
            if (credentials?.username === "" || credentials?.password === "") {
                return null;
            }
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                body: JSON.stringify(credentials),
                headers: { "Content-Type": "application/json" },
            });
            const user = await res.json();

            if (res.ok && user) {
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error connecting to API:", error);
            return null;
        }
    }
});

export const authOptions: NextAuthOptions = {
    providers: [credentialsProvider],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                token.name = user.name;
                token.userId = user.id;
                token.sub = user.id
                token.accessToken = user.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.name = token.name;
                session.user.id = token.userId;
                session.accessToken = token.accessToken;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    theme: {
        brandColor: "#04a3da",
        logo: "/logo.png",
        buttonText: "Entrar",
    }
};

export const getInternalServerSession = () =>
    getNextAuthServerSession(authOptions);
