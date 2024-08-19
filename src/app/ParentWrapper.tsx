'use client';
// import { InstitutionsProvider} from './contexts/InstitutionsContext';
import { AuthContextProvider } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';

import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";  // 改更小幅度，改修改部分CSS import "instantsearch.css/themes/algolia-min.css"
import { InstantSearch, Hits, SearchBox, Configure} from "react-instantsearch";


const searchClient = algoliasearch("N0FZM6IRFS", "f0a299471e81f359d8306ebca289feaf");


export default function ParentProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <AuthContextProvider>
            <InstantSearch searchClient={searchClient} indexName="Medical_Institutions">
                <>
                    <Header />
                    {children}
                    <Footer />
                </>
            </InstantSearch>
        </AuthContextProvider>
    )
}
