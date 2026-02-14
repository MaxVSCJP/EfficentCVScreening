import React, { useState } from "react";
import { Save, Loader2, CheckCircle, Plus, X } from "lucide-react";
import { saveRequirementsApi } from "../api/screening";
import type { ScreeningCriteria } from "../types";

interface Props {
  criteria: ScreeningCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<ScreeningCriteria>>;
  onSaveSuccess: (jobId: string | number) => void;
}

const CriteriaForm: React.FC<Props> = ({
  criteria,
  setCriteria,
  onSaveSuccess,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newWeight, setNewWeight] = useState(5);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const finalValue =
      name === "rankLimit" ||
      name === "workExperienceYears" ||
      name === "eduacationLevel"
        ? value === ""
          ? ""
          : Number(value)
        : value;
    setCriteria({ ...criteria, [name]: finalValue });
    setSaved(false);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setCriteria({
      ...criteria,
      skills: { ...criteria.skills, [newSkill.trim()]: newWeight },
    });
    setNewSkill("");
    setSaved(false);
  };

  const removeSkill = (skillName: string) => {
    const updatedSkills = { ...criteria.skills };
    delete updatedSkills[skillName];
    setCriteria({ ...criteria, skills: updatedSkills });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!criteria.title || !criteria.description)
      return alert("Title and Description are required.");
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
      <h2 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">
        1. Set Requirements
      </h2>
      <div className="space-y-4">
        {/* Job Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-[10px] font-bold uppercase text-slate-500 mb-1"
          >
            Job Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={criteria.title}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            title="Enter Job Title"
            className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none"
          />
        </div>

        {/* Skills Section */}
        <div>
          <label
            htmlFor="skillInput"
            className="block text-[10px] font-bold uppercase text-slate-500 mb-1"
          >
            Skills & Weight (1-10)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              id="skillInput"
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Skill (e.g. React)"
              title="Skill Name"
              className="flex-1 p-2 bg-slate-50 border rounded-lg text-sm outline-none"
            />
            <input
              id="weightInput"
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(Number(e.target.value))}
              placeholder="5"
              title="Skill Weight"
              className="w-16 p-2 bg-slate-50 border rounded-lg text-sm outline-none"
              min="1"
              max="10"
            />
            <button
              type="button"
              onClick={addSkill}
              title="Add Skill"
              aria-label="Add Skill"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            {Object.entries(criteria.skills).map(([name, weight]) => (
              <div
                key={name}
                className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm"
              >
                <span className="text-xs font-bold text-slate-700">{name}</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded-full">
                  {weight}
                </span>
                <button
                  type="button"
                  onClick={() => removeSkill(name)}
                  title={`Remove ${name}`}
                  aria-label={`Remove ${name}`}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Education Level */}
          <div>
            <label
              htmlFor="eduacationLevel"
              className="block text-[10px] font-bold uppercase text-slate-500 mb-1"
            >
              Min Education
            </label>
            <select
              id="eduacationLevel"
              name="eduacationLevel"
              value={criteria.eduacationLevel}
              onChange={handleChange}
              title="Select Education Level"
              className="w-full p-2 bg-slate-50 border rounded-lg text-sm"
            >
              <option value={1}>Bachelor's</option>
              <option value={2}>Master's</option>
              <option value={3}>PhD</option>
            </select>
          </div>
          {/* Work Experience */}
          <div>
            <label
              htmlFor="workExperienceYears"
              className="block text-[10px] font-bold uppercase text-slate-500 mb-1"
            >
              Exp (Yrs)
            </label>
            <input
              id="workExperienceYears"
              name="workExperienceYears"
              type="number"
              value={criteria.workExperienceYears}
              onChange={handleChange}
              placeholder="0"
              title="Years of Experience"
              className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || saved}
          title="Save Requirements"
          aria-label="Save Requirements"
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${saved ? "bg-green-100 text-green-700" : "bg-slate-800 text-white hover:bg-slate-900"}`}
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={18} />
          ) : saved ? (
            <CheckCircle size={18} />
          ) : (
            <Save size={18} />
          )}
          {saved ? "Criteria Saved" : "Save Requirements"}
        </button>
      </div>
    </div>
  );
};

export default CriteriaForm;
