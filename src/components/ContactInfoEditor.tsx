import React from 'react';

interface ContactInfo {
  id: number;
  type: string;
  value: string;
  label: string;
}

interface ContactInfoEditorProps {
  contactInfo: ContactInfo;
  updateContactInfo: (id: number, updatedInfo: Partial<ContactInfo>) => void;
}

const ContactInfoEditor: React.FC<ContactInfoEditorProps> = ({ contactInfo, updateContactInfo }) => {
  return (
    <div className="mb-4 p-4 border rounded bg-gray-50">
      <div className="font-bold mb-2">{contactInfo.type.charAt(0).toUpperCase() + contactInfo.type.slice(1)}</div>
      <input
        className="w-full p-2 border rounded text-gray-900"
        value={contactInfo.value}
        onChange={(e) => updateContactInfo(contactInfo.id, { value: e.target.value })}
        placeholder={`Enter ${contactInfo.type} ${contactInfo.type === 'phone' ? 'number' : 'address'}`}
      />
    </div>
  );
};

export default ContactInfoEditor;