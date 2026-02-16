import React, { useState } from 'react';
import { Save, Loader2, CheckCircle, Plus, X, Wrench } from 'lucide-react';
import { saveRequirementsApi } from '../api/screening';
import type { ScreeningCriteria } from '../types';

interface Props {
  criteria: ScreeningCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<ScreeningCriteria>>;
  onSaveSuccess: (jobId: string | number) => void;
}

const CriteriaForm: React.FC<Props> = ({ criteria, setCriteria, onSaveSuccess }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [rating, setRating] = useState<number | ''>(5);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = (name === 'rankLimit' || name === 'workExperienceYears' || name === 'eduacationLevel')
      ? (value === '' ? '' : Number(value))
      : value;
    setCriteria({ ...criteria, [name]: finalValue });
    setSaved(false);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setRating('');
      return;
    }
    let numValue = parseInt(value, 10);
    // Strict Keyboard Clamping
    if (numValue > 10) numValue = 10;
    if (numValue < 1) numValue = 1;
    setRating(numValue);
  };

  const handleAddSkill = () => {
    if (!skillInput.trim() || rating === '') return;
    setCriteria({
      ...criteria,
      skills: { ...criteria.skills, [skillInput.trim()]: rating }
    });
    setSkillInput('');
    setRating(5);
    setSaved(false);
  };

  const removeSkill = (key: string) => {
    const newSkills = { ...criteria.skills };
    delete newSkills[key];
    setCriteria({ ...criteria, skills: newSkills });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!criteria.title || !criteria.description) return alert("Title and Description are required.");
    setIsSaving(true);
    try {
      const data = await saveRequirementsApi(criteria);
      onSaveSuccess(data.jobId);
      setSaved(true);
    } catch (error) {
      alert("Error saving to database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">
        1. Set Requirements
      </h2>
      
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Job Title</label>
          <input 
            id="title" name="title" type="text" value={criteria.title} onChange={handleChange} 
            placeholder="e.g. Senior Developer" title="Job Title"
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" 
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Job Description</label>
          <textarea 
            id="description" name="description" value={criteria.description} onChange={handleChange}
            placeholder="Main responsibilities..." title="Job Description"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-24 text-sm outline-none resize-none"
          />
        </div>

        {/* Skills & Rating */}
        <div>
          <label htmlFor="skillInput" className="block text-[10px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
            <Wrench size={10} /> Key Skills (Rate 1-10)
          </label>
          <div className="flex gap-2">
            <input 
              id="skillInput" type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} 
              placeholder="Skill (e.g. React)" title="Skill Name"
              className="flex-1 p-2 bg-slate-50 border rounded-lg text-sm outline-none" 
            />
            <input 
              id="ratingInput" type="number" value={rating} onChange={handleWeightChange} 
              onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
              min="1" max="10" title="Rating 1 to 10" placeholder="5"
              className="w-16 p-2 bg-slate-50 border rounded-lg text-sm font-bold text-blue-600 outline-none" 
            />
            <button 
              type="button" onClick={handleAddSkill} title="Add Skill" aria-label="Add Skill"
              className="p-2 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2 min-h-[32px]">
            {Object.entries(criteria.skills).map(([skill, val]) => (
              <div key={skill} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">
                <span className="text-xs font-bold text-blue-700">{skill} ({val}/10)</span>
                <button type="button" onClick={() => removeSkill(skill)} title={`Remove ${skill}`} aria-label={`Remove ${skill}`} className="text-blue-400 hover:text-red-500">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="eduacationLevel" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Min Education</label>
            <select 
              id="eduacationLevel" name="eduacationLevel" value={criteria.eduacationLevel} onChange={handleChange} title="Education Level"
              className="w-full p-2 bg-slate-50 border rounded-lg text-sm"
            >
              <option value={1}>Bachelor's</option>
              <option value={2}>Master's</option>
              <option value={3}>PhD</option>
            </select>
          </div>
          <div>
            <label htmlFor="educationField" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Education Field</label>
            <input 
              id="educationField" name="educationField" type="text" value={criteria.educationField} onChange={handleChange} 
              placeholder="e.g. CS" title="Field of Study"
              className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none" 
            />
          </div>
        </div>

        {/* Exp and Rank */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="workExperienceYears" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Exp (Yrs)</label>
            <input 
              id="workExperienceYears" name="workExperienceYears" type="number" value={criteria.workExperienceYears} onChange={handleChange} 
              placeholder="0" title="Experience" className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none" 
            />
          </div>
          <div>
            <label htmlFor="rankLimit" className="block text-[10px] font-bold uppercase text-blue-600 mb-1">Rank Top X</label>
            <input 
              id="rankLimit" name="rankLimit" type="number" value={criteria.candidateCount} onChange={handleChange} 
              placeholder="5" title="Rank Limit" className="w-full p-2 bg-blue-50 border-2 border-blue-100 rounded-lg text-sm font-bold text-blue-700 outline-none" 
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          type="button" onClick={handleSave} disabled={isSaving || saved} title="Save Job Requirements"
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            saved ? 'bg-green-100 text-green-700' : 'bg-slate-800 text-white hover:bg-slate-900'
          }`}
        >
          {isSaving ? <Loader2 className="animate-spin" size={18}/> : saved ? <CheckCircle size={18}/> : <Save size={18}/>}
          {saved ? "Criteria Saved" : "Save Requirements"}
        </button>
      </div>
    </div>
  );
};

export default CriteriaForm;