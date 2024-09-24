import React, { useState } from 'react';

const FilterForm = ({ onSubmit }) => {
    const [filters, setFilters] = useState({
        username: '',
        productType: '',
        locationName: '',
        fromDateTime: '',
        toDateTime: '',
        price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedFilters = {
            ...filters,
            fromDateTime: filters.fromDateTime ? new Date(filters.fromDateTime).toISOString() : '',
            toDateTime: filters.toDateTime ? new Date(filters.toDateTime).toISOString() : '',
            price: filters.price ? parseFloat(filters.price) : ''
        };
        onSubmit(updatedFilters);
    };

    return (
        <form onSubmit={handleSubmit} className="filter-form">
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={filters.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="productType">Product Type:</label>
                <input
                    type="text"
                    id="productType"
                    name="productType"
                    value={filters.productType}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="locationName">Location Name:</label>
                <input
                    type="text"
                    id="locationName"
                    name="locationName"
                    value={filters.locationName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="fromDateTime">From Date and Time:</label>
                <input
                    type="datetime-local"
                    id="fromDateTime"
                    name="fromDateTime"
                    value={filters.fromDateTime}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="toDateTime">To Date and Time:</label>
                <input
                    type="datetime-local"
                    id="toDateTime"
                    name="toDateTime"
                    value={filters.toDateTime}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="price">Price:</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={filters.price}
                    onChange={handleChange}
                    required
                    min="0"
                />
            </div>

            <button type="submit">Apply Filters</button>
        </form>
    );
};

export default FilterForm;
