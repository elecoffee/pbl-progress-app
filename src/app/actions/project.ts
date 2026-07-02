// src/app/actions/project.ts
'use server';

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// 方針4: Zodによるユーザー入力の検証ルール定義
const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です。")
    .max(50, "タイトルは50文字以内で入力してください。"),
  description: z.string().optional(),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "有効な日付を入力してください。" })
    .transform((val) => new Date(val))
    .refine((date) => date >= new Date(new Date().setHours(0,0,0,0)), {
      message: "最終〆切には今日以降の日付を指定してください。",
    }),
  isTeamProject: z.boolean(),
});

// フロントエンドに返すエラー型の定義
export type FormState = {
  success?: boolean;
  errors?: {
    title?: string[];
    deadline?: string[];
    global?: string[];
  };
};

// 制作物の新規作成（Server Action）
export async function createProject(formData: FormData): Promise<FormState> {
  // フォームデータの取り出しと検証
  const validatedFields = createProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    deadline: formData.get("deadline"),
    isTeamProject: formData.get("isTeamProject") === "true",
  });

  // バリデーション失敗時のエラー返却
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, description, deadline, isTeamProject } = validatedFields.data;

  try {
    // DBへの保存
    await prisma.project.create({
      data: {
        title,
        description,
        deadline,
        isTeamProject,
        status: "進行中",
      },
    });

    // 画面のデータを最新にする
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: { global: ["データベースの保存に失敗しました。再度お試しください。"] },
    };
  }
}

// 制作物一覧の取得
export async function getProjects() {
  return await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}