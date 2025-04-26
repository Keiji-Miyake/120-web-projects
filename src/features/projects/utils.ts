import type { Project } from './types'
import project001 from './data/001'
import project002 from './data/002'

const projects: Record<string, Project> = {
  '001': project001,
  '002': project002,
}

/**
 * プロジェクトIDに基づいてプロジェクトを取得する
 * @param id - プロジェクトID
 * @returns プロジェクトが存在する場合はProjectオブジェクト、存在しない場合はnull
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
  return projects[id] ?? null
}

/**
 * すべてのプロジェクト一覧を取得する
 * @returns プロジェクト一覧
 */
export const getAllProjects = async (): Promise<Project[]> => {
  return Object.values(projects)
}