import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-12 gap-6 animate-pulse w-full">
      {/* Left Skeleton Panel */}
      <div className="col-span-12 md:col-span-4 bg-white rounded-[32px] p-8 border border-slate-100 h-96 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded-lg w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="h-16 bg-slate-200 rounded-2xl w-2/3 mt-6"></div>
        </div>
        <div className="h-20 bg-slate-100 rounded-2xl"></div>
      </div>

      {/* Right Skeleton Panel */}
      <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-100 h-24 space-y-2">
              <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
              <div className="h-8 bg-slate-200 rounded-lg w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 rounded-[32px] h-40 p-6">
          <div className="h-4 bg-slate-800 rounded-md w-1/4 mb-6"></div>
          <div className="flex justify-between items-center gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800 rounded-xl flex-1"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
