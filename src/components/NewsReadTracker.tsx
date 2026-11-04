"use client";

import { useEffect } from "react";
import { markAllNewsAsRead } from "@/components/NewBadge";

export default function NewsReadTracker() {
  useEffect(() => {
    // 회원이 소식·일정 페이지를 방문하면 확인 시점을 기록하여 메뉴의 'N' 뱃지 제거
    markAllNewsAsRead();
  }, []);

  return null;
}
