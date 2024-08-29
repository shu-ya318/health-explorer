'use client';
import FavoriteContent from './FavoriteContent';
import { FavoriteProvider } from '../hooks/useFavorite';
import { useAuth } from '../hooks/useAuth'; 

const FavoritePage: React.FC = (): React.ReactElement | null  => {
    const { user } = useAuth();


    return (     
        <FavoriteProvider user={user}>  
            <FavoriteContent />
        </FavoriteProvider>
    )
};


export default FavoritePage;