import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './CollectionList.css';


const CollectionList = () => {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/store/collections/');
                setCollections(response.data);
            } catch (error) {
                console.error('Error fechin collections:', error);
            }
        };

        fetchCollections();
    }, []);

    return (
        <div className="collection-container">
            
            <div className="collection-list">
                {collections.map((collection) => (
                    <div key={collection.id} className="collection-item">
                        {collection.title}
                    </div>
                ))}
            </div>
        </div>
    );
};


export default CollectionList;