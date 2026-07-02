// src/app/page.tsx
import { getProjects } from "./actions/project";
import ProjectForm from "./components/ProjectForm";

// 毎回最新のDB情報を取得するための設定
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">制作物進捗管理（ホーム）</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左側：新規作成フォーム */}
          <div className="md:col-span-1">
            <ProjectForm />
          </div>
          
          {/* 右側：進行中の制作物一覧 */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">進行中の制作物一覧</h2>
            
            {projects.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 border rounded-lg">進行中の制作物はまだありません。</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{project.title}</h3>
                        <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-full shrink-0">
                          {project.status}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                      <span>区分: {project.isTeamProject ? "👥 チーム" : "👤 個人"}</span>
                      <span className="font-medium text-amber-600">
                        ⏳ 〆切: {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}