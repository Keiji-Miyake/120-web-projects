import type { ComponentType } from 'react'

export interface Project {
  id: string
  title: string
  description: string
  component?: ComponentType
  route?: string
  technologies?: string[]
  features?: string[]
  imageUrl?: string
}
