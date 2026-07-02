// src/app/components/ProjectForm.tsx
'use client';

import { useState } from "react";
import { createProject, FormState } from "../actions/project";

export default function ProjectForm() {
  const [errors, setErrors] = useState<FormState["errors"]>({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const result = await createProject(formData);

    setIsPending(false);

    if (result.success) {
      // 成功したらフォームをリセット
      (event.target as HTMLFormElement).reset();
    } else {
      // 方針4: エラーメッセージを状態にセットして画面に表示
      setErrors(result.errors);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg shadow-sm bg-white max-w-md">
      <h2 className="text-xl font-bold text-gray-800">新規制作物の作成</h2>
      
      {errors?.global && (
        <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{errors.global.join(", ")}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">プロジェクト名 <span className="text-red-500">*</span></label>
        <input type="text" name="title" className="mt-1 block w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
        {errors?.title && <p className="text-red-500 text-xs mt-1">{errors.title.join(", ")}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">説明（任意）</label>
        <textarea name="description" className="mt-1 block w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">最終〆切 <span className="text-red-500">*</span></label>
        <input type="date" name="deadline" className="mt-1 block w-full border rounded p-2" />
        {errors?.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline.join(", ")}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">区分</label>
        <select name="isTeamProject" className="mt-1 block w-full border rounded p-2">
          <option value="false">個人プロジェクト</option>
          <option value="true">チームプロジェクト</option>
        </select>
      </div>

      <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white p-2 rounded lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
        {isPending ? "作成中..." : "制作物を作成"}
      </button>
    </form>
  );
}