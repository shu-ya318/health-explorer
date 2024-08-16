
import { SearchBox, Configure, Hits , useSearchBox} from "react-instantsearch";
import { InstantHit } from "./InstantHit";


export const InstantResults = () => {
  const { query } = useSearchBox();
  const shouldDisplayHits = query && query.trim() !== ''; 


  return (
    <>
      <Configure hitsPerPage={3} />  
      <div className="ais-InstantSearch flex flex-col w-[350px] h-full z-40 ">
        <SearchBoxComponent />
        {shouldDisplayHits && <Hits hitComponent={InstantHit} className="cursor-pointer w-[350px]"/>}
      </div>
    </>
  );
};

const SearchBoxComponent = () => {
  return (
    <>
       <div className="flex max-w-screen-md h-full mx-auto"> 
          <SearchBox className="ais-InstantSearch flex flex-col w-[350px] h-full z-40 rounded-lg border-solid border-[3px] border-[#6898a5]" placeholder="立即查詢癌篩機構"/>
      </div>
    </>
  );
};