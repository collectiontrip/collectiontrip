import { createContext, useState } from "react";

const SearchContext = createContext();

const SearchProvider = ({children}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [queryParams, setQueryParams] = useState({});

    const handleSearch = () => {
        setCurrentPage(1);
        setQueryParams({search: searchTerm});
    };

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, handleSearch, currentPage, queryParams }}>
            {children}
        </SearchContext.Provider>
    );

};

export {SearchProvider, SearchContext};