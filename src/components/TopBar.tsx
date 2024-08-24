import React from 'react';

interface TopBarProps {
  userName: string;
  onSignOut: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ userName, onSignOut }) => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>Signed in as: {userName}</div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={onSignOut}
      >
        Sign Out
      </button>
    </div>
  );
};

export default TopBar;