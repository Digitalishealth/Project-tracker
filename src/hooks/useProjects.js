import { useState, useEffect } from 'react'
import { initProjects, saveProjects } from '../utils/storage'

export function useProjects() {
  const [projects, setProjects] = useState(() => initProjects())

  useEffect(() => {
    saveProjects(projects)
  }, [projects])

  function addProject(data) {
    const project = { id: crypto.randomUUID(), ...data }
    setProjects(prev => [...prev, project])
    return project
  }

  function updateProject(id, data) {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)))
  }

  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  function importProjects(imported) {
    setProjects(imported)
  }

  return { projects, addProject, updateProject, deleteProject, importProjects }
}
