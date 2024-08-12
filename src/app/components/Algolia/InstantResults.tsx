
import {  Hits, SearchBox, Configure, useSearchBox} from "react-instantsearch";
import { InstantHit } from "./InstantHit";


export const InstantResults = () => {
  const { query } = useSearchBox();
  const shouldDisplayHits = query && query.trim() !== '';

  return (
    <>
      <Configure hitsPerPage={3} />
      <div className="ais-InstantSearch flex flex-col w-full h-full z-40">
        <SearchBoxComponent />
        {shouldDisplayHits && <Hits hitComponent={InstantHit} className="cursor-pointer"/>}
      </div>
    </>
  );
};

const SearchBoxComponent = () => {
  return (
    <>
      <SearchBox />
    </>
  );
};