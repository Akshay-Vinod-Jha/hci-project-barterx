import React from 'react';

const TestTailwind = () => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg m-4">
      <h2 className="text-2xl font-bold mb-2">Tailwind CSS Test</h2>
      <p className="text-blue-100">
        If you can see this styled component, Tailwind CSS is working correctly!
      </p>
      <button className="bg-white text-blue-500 px-4 py-2 rounded mt-4 hover:bg-gray-100 transition-colors">
        Test Button
      </button>
    </div>
  );
};

export default TestTailwind;
