import { Outlet } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
    // TODO: Connect cart/wishlist count to real state context
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header cartCount={0} wishlistCount={0} />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer onSupportClick={() => { }} />
        </div>
    );
}
