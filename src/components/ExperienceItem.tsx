import React from 'react';

interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ title, company, period, description }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold mb-1 text-gray-800">{title}</h3>
      <p className="text-md font-medium text-gray-600 mb-2">{company} | {period}</p>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default ExperienceItem;