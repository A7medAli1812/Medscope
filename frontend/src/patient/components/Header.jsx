import React from 'react';
const Header = ({ searchQuery, setSearchQuery, sortMethod, setSortMethod }) => {
    return (
        <div>
            <div className="bb-notice">
                <strong>Note:</strong> This information is for viewing purposes only. For blood requests or donations, please contact the hospital or blood bank directly.
            </div>

            <div className="bb-controls">
                <div className="bb-search-wrapper">
                    <input
                        type="text"
                        className="bb-input"
                        placeholder="Search hospitals by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="bb-sort-wrapper">
                    <select
                        className="bb-select"
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value)}
                    >
                        <option value="none">Sort by...</option>
                        <option value="highest">Highest Blood Availability</option>
                        <option value="lowest">Lowest Blood Availability</option>
                        <option value="name">Hospital Name A–Z</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Header;
