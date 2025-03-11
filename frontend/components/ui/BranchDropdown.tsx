// BranchDropdown.tsx
import React, { useState } from 'react';

const branchLocations = [
  "Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Bharatpur", "Birgunj", "Janakpur", "Butwal", "Hetauda", "Tulsipur", "Dharan", "Nepalgunj", "Kalaiya", "Itahari", "Ghorahi", "Dhangadi", "Jitpursimara", "Bhaktapur", "Bhimdoot", "Budhanilkantha"
];

const BranchDropdown = ({ onBranchChange }: { onBranchChange: (branch: string) => void }) => {
  const [selectedBranch, setSelectedBranch] = useState(branchLocations[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleBranchClick = (branch: string) => {
    setSelectedBranch(branch);
    onBranchChange(branch); // Pass the selected branch to the parent component
    setIsOpen(false); // Close the dropdown after selection
    console.log("Selected Branch:", branch); // Debugging
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev); // Toggle dropdown visibility
    console.log("Dropdown isOpen:", !isOpen); // Debugging
  };

  return (
    <div style={{ position: 'relative', width: '60%', marginTop: '20px', zIndex: 1000 }}>
      {/* Clickable Box */}
      <div
        style={{
          padding: '8px',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer',
          textAlign: 'center',
          fontSize: '16px',
        }}
        onClick={toggleDropdown}
      >
        {selectedBranch}
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            fontSize: '14px',
          }}
        >
          {branchLocations.map((branch, index) => (
            <div
              key={index}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                color: '#000',
              }}
              onClick={() => handleBranchClick(branch)}
            >
              {branch}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchDropdown;