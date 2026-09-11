'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import {
  Plus,
  FileText,
  Trash2,
  Copy,
  Download,
  BarChart3,
  Sparkles,
  Upload,
  Settings,
  CreditCard,
  LogOut,
  Search
} from 'lucide-react'

interface Resume {
  id: string
  title: string
  template: string
  atsScore: number
  updatedAt: string
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, getIdToken, signOut } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true)
      const token = await getIdToken()
      if (!token) {
        router.push('/login')
        return
      }
      const response = await fetch('/api/resumes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setResumes(data.resumes || [])
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
    } finally {
      setLoading(false)
    }
  }, [getIdToken, router])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchResumes()
  }, [user, router, fetchResumes])

  const handleDuplicate = async (id: string) => {
    try {
      const token = await getIdToken()
      if (!token) return
      const response = await fetch(`/api/resumes/${id}/duplicate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        fetchResumes()
      }
    } catch (error) {
      console.error('Failed to duplicate resume:', error)
    }
  }

  const handleDeleteClick = (id: string) => {
    setResumeToDelete(id)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!resumeToDelete) return
    try {
      setDeleting(true)
      const token = await getIdToken()
      if (!token) return
      const response = await fetch(`/api/resumes/${resumeToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete))
        setDeleteModalOpen(false)
        setResumeToDelete(null)
      }
    } catch (error) {
      console.error('Failed to delete resume:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleDownload = async (id: string, title: string) => {
    try {
      const token = await getIdToken()
      if (!token) return
      const response = await fetch(`/api/resumes/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace(/\s+/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to download PDF:', error)
    }
  }

  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalResumes = resumes.length
  const averageAts =
    resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / resumes.length)
      : 0

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ResumeForge AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push('/billing')}>
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.displayName || user.email?.split('@')[0] || 'there'}
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your resumes and create new ones with AI-powered assistance.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            onClick={() => router.push('/resumes/new?mode=ai')}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create with AI
          </Button>
          <Button onClick={() => router.push('/resumes/new?mode=scratch')} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create from Scratch
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Resume
          </Button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalResumes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average ATS Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{averageAts}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">Free</div>
              <Button
                variant="link"
                className="mt-1 h-auto p-0 text-sm"
                onClick={() => router.push('/billing')}
              >
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Resumes</h2>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
          <Card className="py-12 text-center">
            <CardContent>
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No resumes yet</h3>
              <p className="mt-2 text-gray-600">
                Create your first resume with AI!
              </p>
              <Button
                onClick={() => router.push('/resumes/new?mode=ai')}
                className="mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Create with AI
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="truncate text-lg">{resume.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {resume.template || 'Default Template'} &middot; {formatDate(resume.updatedAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        (resume.atsScore || 0) >= 80
                          ? 'bg-green-100 text-green-800'
                          : (resume.atsScore || 0) >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      ATS: {resume.atsScore || 0}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/resumes/${resume.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDuplicate(resume.id)}>
                      <Copy className="mr-1 h-3 w-3" />
                      Duplicate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(resume.id, resume.title)}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteClick(resume.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete Resume</h3>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false)
                  setResumeToDelete(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
