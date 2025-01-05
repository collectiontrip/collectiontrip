import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CollectionList.css";

const CollectionList = ({ onCollectionSelect }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null); // Track selected collection

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
        setSelectedCollectionId(collectionId); // Update the selected collection
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
            <div className="collection-list">
                {collections.map((collection) => (
                    <div
                        key={collection.id}
                        className={`collection-item ${selectedCollectionId === collection.id ? 'selected' : ''}`} // Apply 'selected' class
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
