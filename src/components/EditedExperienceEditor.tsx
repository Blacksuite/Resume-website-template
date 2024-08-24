import React from 'react';

interface Experience {
  id: number;
  title: { [key: string]: string };
  company: { [key: string]: string };
  period: { [key: string]: string };
  description: { [key: string]: string };
  order_index: number;
}

interface EditedExperienceEditorProps {
  experience: Experience;
  index: number;
  updateExperience: (id: number, updatedExperience: Partial<Experience>) => void;
  removeExperience: (id: number) => void;
  moveExperience: (id: number, direction: 'up' | 'down') => void;
  activeTab: string;
  isFirst: boolean;
  isLast: boolean;
}

const EditedExperienceEditor: React.FC<EditedExperienceEditorProps> = ({
  experience,
  index,
  updateExperience,
  removeExperience,
  moveExperience,
  activeTab,
  isFirst,
  isLast
}) => {
  return (
    <div className="mb-4 p-4 border rounded bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <div className="flex">
          <button
            className="px-2 py-1 mr-2 bg-gray-200 rounded"
            onClick={() => moveExperience(experience.id, 'up')}
            disabled={isFirst}
          >
            ↑
          </button>
          <button
            className="px-2 py-1 mr-2 bg-gray-200 rounded"
            onClick={() => moveExperience(experience.id, 'down')}
            disabled={isLast}
          >
            ↓
          </button>
        </div>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => removeExperience(experience.id)}
        >
          Remove
        </button>
      </div>
      <input
        className="w-full mb-2 p-2 border rounded text-gray-900"
        value={experience.title[activeTab] || ''}
        onChange={(e) => updateExperience(experience.id, { title: { ...experience.title, [activeTab]: e.target.value } })}
        placeholder="Title"
      />
      <input
        className="w-full mb-2 p-2 border rounded text-gray-900"
        value={experience.company[activeTab] || ''}
        onChange={(e) => updateExperience(experience.id, { company: { ...experience.company, [activeTab]: e.target.value } })}
        placeholder="Company"
      />
      <input
        className="w-full mb-2 p-2 border rounded text-gray-900"
        value={experience.period[activeTab] || ''}
        onChange={(e) => updateExperience(experience.id, { period: { ...experience.period, [activeTab]: e.target.value } })}
        placeholder="Period"
      />
      <textarea
        className="w-full mb-2 p-2 border rounded text-gray-900"
        value={experience.description[activeTab] || ''}
        onChange={(e) => updateExperience(experience.id, { description: { ...experience.description, [activeTab]: e.target.value } })}
        placeholder="Description"
        rows={3}
      />
    </div>
  );
};

export default EditedExperienceEditor;