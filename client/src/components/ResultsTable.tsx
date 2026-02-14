import React from "react";
import { Trophy, User, GraduationCap, ChevronRight } from "lucide-react";
import type { Candidate } from "../types";


interface ResultsTableProps {
  data: Candidate[];
  loading: boolean;
  requestedRank: number; 
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  data,
  loading,
  requestedRank, 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-24 border border-slate-200 flex flex-col items-center justify-center shadow-sm">
        <div className="relative mb-4">
          <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
          <Trophy
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300"
            size={24}
          />
        </div>
        <p className="text-slate-600 font-bold text-lg">Analyzing CVs...</p>
        <p className="text-slate-400 text-sm">
          Matching against your top {requestedRank} criteria.
        </p>
      </div>
    );
  }

  // 2. Empty State (No Data)
  if (data.length === 0) {
    return (
      <div className="bg-slate-100/50 rounded-xl p-24 border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Trophy className="text-slate-200" size={40} />
        </div>
        <h3 className="text-slate-500 font-bold text-lg">Ready to Screen</h3>
        <p className="text-slate-400 max-w-xs mx-auto">
          Upload candidates on the left to see the top {requestedRank} performers ranked by AI.
        </p>
      </div>
    );
  }

  // 3. Data Table State
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="p-5 border-b bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Trophy size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
              The Elite {data.length}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium italic">
              Top {requestedRank} candidates ranked by compatibility
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
            <tr>
              <th className="p-4 w-16 text-center">Rank</th>
              <th className="p-4">Candidate Information</th>
              <th className="p-4">Education</th>
              <th className="p-4 text-center">Compatibility</th>
              <th className="p-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((c, i) => (
              <tr
                key={i}
                className="group hover:bg-blue-50/50 transition-all duration-200"
              >
                <td className="p-4 text-center font-black text-slate-300 group-hover:text-blue-500 transition-colors">
                  {(i + 1).toString().padStart(2, "0")}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shadow-inner">
                      <User size={20} />
                    </div>
                    <span className="font-bold text-slate-700">{c.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-start gap-2">
                    <GraduationCap
                      size={16}
                      className="text-slate-400 mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">
                        {c.eduLevel}
                      </span>
                      <span className="text-xs text-slate-500">
                        {c.eduBackground}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          c.score > 80
                            ? "bg-green-500"
                            : c.score > 60
                              ? "bg-blue-500"
                              : "bg-slate-400"
                        }`}
                        style={{ width: `${c.score}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase italic">
                      {c.score}% Match
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-blue-500 transition-all cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;