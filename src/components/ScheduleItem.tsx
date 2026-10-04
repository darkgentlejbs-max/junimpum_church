"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScheduleItem({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const dateObj = new Date(item.date);
  const isInvalidDate = isNaN(dateObj.getTime());
  const month = isInvalidDate ? "-" : dateObj.getMonth() + 1;
  const day = isInvalidDate ? "-" : dateObj.getDate();
  const days = ["주일(일요일)", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const dayName = isInvalidDate ? "" : days[dateObj.getDay()];

  return (
    <div
      className={`flex flex-col p-4 rounded-2xl border transition-colors group cursor-pointer ${
        isOpen ? "bg-white border-amber-200/60 shadow-sm" : "border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-amber-200/60"
      }`}
      onClick={() => item.content && setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 bg-white rounded-xl shadow-sm border border-stone-200/60 group-hover:border-amber-300 transition-colors">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{month}월</span>
          <span className="text-xl font-bold text-stone-800 leading-none mt-0.5">{day}</span>
        </div>
        
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-stone-200/70 text-stone-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {item.type}
            </span>
            <span className="text-xs text-stone-400 font-medium">{item.location}</span>
          </div>
          <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
            {item.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex text-sm text-stone-400 font-medium w-auto min-w-[3rem] justify-end whitespace-nowrap">
            {dayName}
          </div>
          {item.content && (
            <ChevronDown
              size={18}
              className={`text-stone-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-600" : ""}`}
            />
          )}
        </div>
      </div>

      {isOpen && item.content && (
        <div className="mt-4 pt-4 border-t border-stone-100 pl-[76px] pr-4">
          <p className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed">
            {item.content}
          </p>
        </div>
      )}
    </div>
  );
}
