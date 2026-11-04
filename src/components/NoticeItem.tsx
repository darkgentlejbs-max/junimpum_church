"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { MasterEditButton, MasterDeleteButton } from "@/components/MasterWriteModal";
import NewBadge, { isNewItem, markNoticeAsRead, isNoticeReadByUser } from "@/components/NewBadge";

export default function NoticeItem({
  notice,
  canWrite = false,
}: {
  notice: any;
  canWrite?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRead, setIsRead] = useState(false);

  // 3일 이내 등록된 글인지 확인
  const isNew = notice.id !== "empty" && isNewItem(notice.date, notice.createdTime, 3);

  useEffect(() => {
    const checkRead = () => {
      if (notice.id && notice.id !== "empty") {
        setIsRead(isNoticeReadByUser(notice.id, notice.createdTime || notice.date));
      }
    };
    checkRead();
    window.addEventListener("news-read-state-change", checkRead);
    return () => window.removeEventListener("news-read-state-change", checkRead);
  }, [notice.id, notice.createdTime, notice.date]);

  const handleClick = () => {
    if (notice.content) {
      setIsOpen(!isOpen);
    }
    if (notice.id && notice.id !== "empty") {
      markNoticeAsRead(notice.id);
      setIsRead(true);
    }
  };

  const showNewBadge = isNew && !isRead;

  return (
    <li
      className="group flex flex-col py-4 hover:bg-stone-50/60 rounded-xl px-3 -mx-3 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start sm:items-center flex-col sm:flex-row justify-between w-full">
        <div className="flex flex-col mb-1.5 sm:mb-0 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            {notice.type && (
              <span className="bg-amber-100 text-amber-800 border border-amber-200/60 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                {notice.type}
              </span>
            )}
            <span className="text-sm text-stone-700 font-medium group-hover:text-amber-800 transition-colors line-clamp-1">
              {notice.title}
            </span>
            {showNewBadge && <NewBadge size="sm" />}
          </div>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end mt-1 sm:mt-0 gap-1.5">
          <span className="text-xs text-stone-400 shrink-0 font-mono">{notice.date}</span>
          {canWrite && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <MasterEditButton menuType="news" item={notice} />
              <MasterDeleteButton id={notice.id} />
            </div>
          )}
          {notice.content && (
            <ChevronDown 
              size={16} 
              className={`text-stone-400 ml-1 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
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
