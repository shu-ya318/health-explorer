'use client';
import FavoriteContent from '../components/FavoriteContent';
import { FavoriteProvider } from '../contexts/FavoriteContext';
import { useAuth } from '../contexts/AuthContext'; 

const FavoritePage: React.FC = (): React.ReactElement | null  => {
    const { user } = useAuth();


    return (     
        <FavoriteProvider user={user}>  
            <FavoriteContent />
        </FavoriteProvider>
    )
};


export default FavoritePage;