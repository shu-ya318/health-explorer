'use client';
import { AuthContextProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';

export default function ParentProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <AuthContextProvider>
            <>
                <Header />
                {children}
                <Footer />
            </>
        </AuthContextProvider>
    )
}
