"use client";

import { AuthProvider } from "./hooks/useAuth";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { InstantSearch } from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";

const searchClient = algoliasearch(
  "N0FZM6IRFS",
  "f0a299471e81f359d8306ebca289feaf"
);

export default function ParentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <InstantSearch
        searchClient={searchClient}
        indexName="Medical_Institutions"
      >
        <>
          <Header />
          {children}
          <Footer />
        </>
      </InstantSearch>
    </AuthProvider>
  );
}
