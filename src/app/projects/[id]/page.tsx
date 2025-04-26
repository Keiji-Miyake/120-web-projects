import type { FC } from 'react'
import { getProjectById } from '@/features/projects/utils'

type PageProps = {
  params: { id: string }
}

const Page: FC<PageProps> = async ({ params }) => {
  // paramsをawaitしてから使用する
  const awaitedParams = await params
  const project = await getProjectById(awaitedParams.id)
  if (!project) return null

  const Component = project.component
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      {Component ? <Component /> : <div>コンポーネントが見つかりません</div>}
    </div>
  )
}

export default Page