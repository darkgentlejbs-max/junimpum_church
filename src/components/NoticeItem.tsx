"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function NoticeItem({ notice }: { notice: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="group flex flex-col py-4 hover:bg-stone-50/60 rounded-xl px-3 -mx-3 transition-colors cursor-pointer"
        onClick={() => notice.content && setIsOpen(!isOpen)}>
      <div className="flex items-start sm:items-center flex-col sm:flex-row justify-between w-full">
        <div className="flex flex-col mb-1.5 sm:mb-0 w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            {notice.type && (
              <span className="bg-amber-100 text-amber-800 border border-amber-200/60 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                {notice.type}
              </span>
            )}
            <span className="text-sm text-stone-700 font-medium group-hover:text-amber-800 transition-colors line-clamp-1">
              {notice.title}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end mt-1 sm:mt-0">
          <span className="text-xs text-stone-400 shrink-0 font-mono">{notice.date}</span>
          {notice.content && (
            <ChevronDown 
              size={16} 
              className={`text-stone-400 ml-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
            />
          )}
        </div>
      </div>
      
      {/* 아코디언 내용 영역 */}
      {notice.content && isOpen && (
        <div className="mt-3 pl-2 sm:pl-[42px] pr-2">
          <p className="text-sm text-stone-600 bg-stone-50 p-4 rounded-lg border border-stone-100 whitespace-pre-wrap leading-relaxed">
            {notice.content}
          </p>
        </div>
      )}
    </li>
  );
}
