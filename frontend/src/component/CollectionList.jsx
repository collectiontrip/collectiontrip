import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CollectionList.css"; // Import the new CSS file

const CollectionList = ({ onCollectionSelect }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/store/collections/");
                setCollections(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching collections:", error);
                setError(true);
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    const handleCollectionClick = (collectionId) => {
        setSelectedCollectionId(collectionId);
        if (onCollectionSelect) {
            onCollectionSelect(collectionId);
        }
    };

    if (loading) {
        return <div className="collection-container">Loading collections...</div>;
    }

    if (error) {
        return <div className="collection-container">Error loading collections.</div>;
    }

    return (
        <div className="collection-container">
            <h2 className="collection-title">Collections</h2>
            <div className="collection-grid">
                {collections.map((collection) => (
                    <div
                        key={collection.id}
                        className={`collection-item ${selectedCollectionId === collection.id ? 'selected' : ''}`}
                        onClick={() => handleCollectionClick(collection.id)}
                    >
                        {collection.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollectionList;
