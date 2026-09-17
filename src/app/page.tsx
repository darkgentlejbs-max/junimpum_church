"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Video } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-secondary-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/church-exterior.jpg"
            alt="주님품교회 전경"
            fill
            className="object-contain object-center"
            priority
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-secondary-900/60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
          >
            믿음 소망 사랑으로<br />
            <span className="text-primary-yellow">세워가는 공동체</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl"
          >
            대한예수교장로회(통합) 주님품교회에 오신 여러분을 진심으로 환영합니다.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/about" className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-medium transition-colors shadow-lg">
              새가족 안내
            </Link>
            <Link href="/sermons" className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full font-medium transition-colors border border-white/30">
              최신 설교 보기
            </Link>
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
