import React, { useState } from 'react';
import { Save, Loader2, CheckCircle, Wrench } from 'lucide-react';
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = (name === 'rankLimit' || name === 'workExperienceYears' || name === 'eduacationLevel')
      ? (value === '' ? '' : Number(value))
      : value;
    setCriteria({ ...criteria, [name]: finalValue });
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
      <h2 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2 flex items-center gap-2">1. Set Requirements</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Job Title</label>
          <input id="title" name="title" type="text" value={criteria.title} onChange={handleChange} title="Job Title" placeholder="e.g. Software Engineer" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
        </div>

        <div>
          <label htmlFor="description" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Description</label>
          <textarea id="description" name="description" value={criteria.description} onChange={handleChange} title="Job Description" placeholder="Responsibilities..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-24 text-sm outline-none" />
        </div>

        <div>
          <label htmlFor="skills" className="block text-[10px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1"><Wrench size={10} /> Skills</label>
          <textarea id="skills" name="skills" value={criteria.skills} onChange={handleChange} title="Skills" placeholder="React, Python, etc." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg h-20 text-sm outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="eduacationLevel" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Min Education</label>
            <select id="eduacationLevel" name="eduacationLevel" value={criteria.eduacationLevel} onChange={handleChange} title="Education Level" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
              <option value={1}>Bachelor's</option>
              <option value={2}>Master's</option>
              <option value={3}>PhD</option>
            </select>
          </div>
          <div>
            <label htmlFor="educationField" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Field</label>
            <input id="educationField" name="educationField" type="text" value={criteria.educationField} onChange={handleChange} title="Education Field" placeholder="e.g. CS" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="workExperienceYears" className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Exp (Yrs)</label>
            <input id="workExperienceYears" name="workExperienceYears" type="number" value={criteria.workExperienceYears} onChange={handleChange} title="Experience" className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none" />
          </div>
          <div>
            <label htmlFor="rankLimit" className="block text-[10px] font-bold uppercase text-blue-600 mb-1">Rank Top X</label>
            <input id="rankLimit" name="rankLimit" type="number" value={criteria.rankLimit} onChange={handleChange} title="Rank Limit" className="w-full p-2 bg-blue-50 border-2 border-blue-100 rounded-lg text-sm font-bold text-blue-700 outline-none" />
          </div>
        </div>

        <button type="button" onClick={handleSave} disabled={isSaving || saved} className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all ${saved ? 'bg-green-100 text-green-700' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
          {isSaving ? <Loader2 className="animate-spin" size={18}/> : saved ? <CheckCircle size={18}/> : <Save size={18}/>}
          {saved ? "Job Saved" : "Save Requirements"}
        </button>
      </div>
    </div>
  );
};

export default CriteriaForm;