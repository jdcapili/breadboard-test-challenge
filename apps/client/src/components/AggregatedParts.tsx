import React, { useEffect, useState } from "react";
import SearchBar from "./searchbar";
import { useNavigate } from "react-router-dom";

const AggregatedParts: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>("0510210200");
    const [searchResults, setSearchResults] = useState<JSON[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(()=> {
        navigate(`/aggregate-parts?partNumber=${searchInput}`)
    },[])

    useEffect(()=>{
        setIsFetching(true);
        navigate(`/aggregate-parts?partNumber=${searchInput}`)
        fetch(`/api/aggregated-part?partNumber=${searchInput}`)
            .then((res)=> res.text())
            .then((s) => {
                setIsFetching(false)
                setSearchResults(JSON.parse(s))
            })
    }, [searchInput])

    return <>
        <SearchBar
            currentVal={searchInput}
            onChange={setSearchInput}
        />
        <div style={{display: 'inline-block'}}>
            <div>
                {isFetching ? <h3>Loading...</h3> :
                    <>
                        {searchResults.map((d) => 
                            <pre style={{wordWrap: 'break-word', whiteSpace: 'pre-wrap', textAlign: 'initial'}}>
                            {JSON.stringify(d,null, 7)}
                            </pre>
                        )}
                    </>
                }
            </div>
        </div>
    </>
}

export default AggregatedParts