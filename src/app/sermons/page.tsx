import { PlayCircle, Calendar, User } from "lucide-react";

export default function SermonsPage() {
  const sermons = [
    { id: 1, title: "믿음으로 세워지는 삶", date: "2026-09-13", preacher: "담임목사", passage: "히브리서 11:1-3" },
    { id: 2, title: "소망 중에 즐거워하며", date: "2026-09-06", preacher: "담임목사", passage: "로마서 12:12" },
    { id: 3, title: "사랑은 언제나 오래참고", date: "2026-08-30", preacher: "담임목사", passage: "고린도전서 13:4-7" },
    { id: 4, title: "주님의 품안에서", date: "2026-08-23", preacher: "담임목사", passage: "시편 91:1-4" },
    { id: 5, title: "성령의 열매", date: "2026-08-16", preacher: "담임목사", passage: "갈라디아서 5:22-23" },
    { id: 6, title: "반석 위에 지은 집", date: "2026-08-09", preacher: "담임목사", passage: "마태복음 7:24-27" },
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-secondary-900">예배/말씀</h1>
        
        {/* Latest Sermon Highlight */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 flex flex-col lg:flex-row cursor-pointer group">
            <div className="w-full lg:w-2/3 aspect-video bg-gray-900 relative flex items-center justify-center group-hover:bg-gray-800 transition-colors">
               <div className="absolute inset-0 opacity-40 bg-[url('/images/church-exterior.jpg')] bg-cover bg-center"></div>
               <PlayCircle className="text-white opacity-90 group-hover:scale-110 transition-transform relative z-10 drop-shadow-lg" size={80} />
            </div>
            <div className="w-full lg:w-1/3 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4 w-max">최신 설교</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{sermons[0].title}</h2>
              <div className="space-y-2 text-gray-600 mb-6">
                <p className="flex items-center"><Calendar size={18} className="mr-2 text-primary-500"/> {sermons[0].date}</p>
                <p className="flex items-center"><User size={18} className="mr-2 text-primary-500"/> {sermons[0].preacher}</p>
                <p className="flex items-center font-serif text-secondary-600 mt-2">"{sermons[0].passage}"</p>
              </div>
              <button className="bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-500 transition-colors mt-auto">
                영상 보기
              </button>
            </div>
          </div>
        </section>

        {/* Sermon List */}
        <h3 className="text-2xl font-bold mb-6 text-gray-900">지난 설교</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons.slice(1).map((sermon) => (
            <div key={sermon.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer flex flex-col">
              <div className="aspect-video bg-gray-200 relative flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <PlayCircle className="text-primary-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-sm" size={48} />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">{sermon.title}</h3>
                <p className="text-sm text-secondary-600 font-serif mb-4 flex-1">{sermon.passage}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span className="flex items-center"><Calendar size={14} className="mr-1"/> {sermon.date}</span>
                  <span className="flex items-center"><User size={14} className="mr-1"/> {sermon.preacher}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination placeholder */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-600 text-white font-medium">1</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">2</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
