"use client";

import { useAuth } from "../hooks/useAuth"; 
import { FavoriteProvider } from "../hooks/useFavorite";

import FavoriteContent from "./FavoriteContent";

const FavoritePage: React.FC = () => {
    const { user } = useAuth();

    return (     
        <FavoriteProvider user={user}>  
            <FavoriteContent />
        </FavoriteProvider>
    )
};

export default FavoritePage;