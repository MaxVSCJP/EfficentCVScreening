import React from "react";
import { Trophy, User, RefreshCcw, Download } from "lucide-react";
import type { Candidate } from "../types";


interface ResultsTableProps {
  data: Candidate[];
  loading: boolean;
  requestedRank: number; 
  onRefresh: () => Promise<void>;
  canRefresh: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  data,
  loading,
  requestedRank, 
  onRefresh,
  canRefresh,
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
        <button
          type="button"
          onClick={() => {
            void onRefresh();
          }}
          disabled={!canRefresh || loading}
          className="mt-5 inline-flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Results
        </button>
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
        <button
          type="button"
          onClick={() => {
            void onRefresh();
          }}
          disabled={!canRefresh || loading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
            <tr>
              <th className="p-4 w-16 text-center">Rank</th>
              <th className="p-4">Candidate Information</th>
              <th className="p-4 text-center">Skills Score</th>
              <th className="p-4 text-center">Work Exp Score</th>
              <th className="p-4 text-center">Education Score</th>
              <th className="p-4 text-center">Compatibility</th>
              <th className="p-4 text-center">Resume</th>
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
                    <div>
                      <span className="font-bold text-slate-700 block">{c.name}</span>
                      {c.email ? (
                        <span className="text-xs text-slate-500">{c.email}</span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-bold text-slate-700">{c.skillScore.toFixed(1)}/10.0</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-bold text-slate-700">{c.workScore.toFixed(1)}/10.0</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-bold text-slate-700">{c.educationScore.toFixed(1)}/10.0</span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          c.averageScore * 10 > 80
                            ? "bg-green-500"
                            : c.averageScore * 10 > 60
                              ? "bg-blue-500"
                              : "bg-slate-400"
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, c.averageScore * 10))}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase italic">
                      {(c.averageScore * 10).toFixed(0)}% Match
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {c.resumeUrl ? (
                    <a
                      href={c.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      download={`${(c.name || "resume").replace(/\s+/g, "_")}.pdf`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Unavailable</span>
                  )}
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