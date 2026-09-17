"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Video } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-[600px] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-white">
        {/* Left: Church Image */}
        <div className="w-full lg:w-1/2 relative bg-secondary-900 min-h-[40vh] lg:min-h-full">
          <Image
            src="/images/church-exterior.jpg"
            alt="주님품교회 전경"
            fill
            className="object-contain lg:object-cover object-center"
            priority
          />
        </div>

        {/* Right: Text and Navigation Bar */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-20 py-16 bg-gray-50 text-secondary-900">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
              믿음 소망 사랑으로<br />
              <span className="text-primary-600">세워가는 공동체</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-lg">
              대한예수교장로회(통합) 주님품교회에 오신 여러분을 진심으로 환영합니다.
            </p>

            {/* Navigation Menu (Right side) */}
            <nav className="flex flex-col space-y-4 max-w-md">
              <Link href="/about" className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group">
                <span className="font-bold text-lg group-hover:text-primary-600 transition-colors">교회 소개 및 새가족 안내</span>
                <span className="text-primary-500 text-xl font-light">&rarr;</span>
              </Link>
              <Link href="/sermons" className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group">
                <span className="font-bold text-lg group-hover:text-primary-600 transition-colors">예배 및 최신 설교 말씀</span>
                <span className="text-primary-500 text-xl font-light">&rarr;</span>
              </Link>
              <Link href="/ministries" className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group">
                <span className="font-bold text-lg group-hover:text-primary-600 transition-colors">사역 및 기관 안내</span>
                <span className="text-primary-500 text-xl font-light">&rarr;</span>
              </Link>
              <Link href="/news" className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group">
                <span className="font-bold text-lg group-hover:text-primary-600 transition-colors">교회 소식 및 나눔</span>
                <span className="text-primary-500 text-xl font-light">&rarr;</span>
              </Link>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* Quick Links / Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">예배 안내</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">주일 대예배, 수요예배, 금요기도회 등 예배 시간을 안내해 드립니다.</p>
              <Link href="/about#worship-times" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                자세히 보기 &rarr;
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Video size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">온라인 예배</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">유튜브 채널을 통해 주일 설교와 다양한 영상을 확인하실 수 있습니다.</p>
              <Link href="/sermons" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                설교 영상 보기 &rarr;
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">오시는 길</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">주님품교회로 오시는 길을 상세히 안내해 드립니다.</p>
              <Link href="/about#location" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
                지도 보기 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
