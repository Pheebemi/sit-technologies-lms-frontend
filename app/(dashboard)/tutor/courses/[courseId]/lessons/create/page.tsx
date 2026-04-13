"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createLesson, getLessons } from '@/lib/api'
import RichTextEditor from '@/components/rich-text-editor'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  Video, 
  FileText,
  Clock,
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react'

export default function CreateLessonPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  
  const [loading, setLoading] = useState(false)
  const [lessons, setLessons] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1,
    content: '',
    video_url: '',
    duration_minutes: 0,
    resources: [] as string[],
    is_published: false
  })
  
  const [newResource, setNewResource] = useState('')

  useEffect(() => {
    loadLessons()
  }, [courseId])

  const loadLessons = async () => {
    try {
      const data = await getLessons(courseId)
      setLessons(data)
      // Set the next order number
      const maxOrder = Math.max(...data.map(l => l.order), 0)
      setFormData(prev => ({ ...prev, order: maxOrder + 1 }))
    } catch (error) {
      console.error('Failed to load lessons:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'duration_minutes' || name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addResource = () => {
    if (newResource.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }))
      setNewResource('')
    }
  }

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }))
  }

  const getVideoId = (url: string) => {
    if (!url) return null
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0]
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0]
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Lesson title is required')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Creating lesson...', {
      description: 'Please wait while we create your lesson'
    })

    try {
      const lesson = await createLesson(courseId, formData)
      
      toast.success('Lesson created successfully!', {
        description: 'Your lesson has been created and saved'
      })
      
      // Redirect back to the course overview page instead of individual lesson
      router.push(`/tutor/courses/${courseId}`)
    } catch (error: any) {
      console.error('Lesson creation error:', error)
      
      let errorMessage = 'Failed to create lesson'
      let errorDescription = 'Please try again'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
        errorDescription = error.response.data.message || 'Please check your input and try again'
      } else if (error.response?.data?.title) {
        errorMessage = 'Validation error'
        errorDescription = error.response.data.title[0] || 'Please check your input'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        description: errorDescription
      })
    } finally {
      toast.dismiss(loadingToast)
      setLoading(false)
    }
  }

  const videoId = getVideoId(formData.video_url)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/tutor/courses/${courseId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Lesson</h1>
            <p className="text-muted-foreground">Add a new lesson to your course</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Lesson Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lesson Title *</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter lesson title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lesson Order</label>
                  <Input
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of what students will learn"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[80px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Minutes)</label>
                <Input
                  name="duration_minutes"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Video Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">YouTube Video URL</label>
                <Input
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Paste a YouTube video URL to embed it in your lesson
                </p>
              </div>

              {videoId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Preview</label>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="Lesson Video Preview"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Text Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Lesson Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lesson Notes/Content</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                  placeholder="Write your lesson notes here — use headings, bullet lists, bold text, and quotes to structure the content clearly for students"
                  minHeight="220px"
                />
                <p className="text-xs text-muted-foreground">
                  Students will see this content exactly as you format it
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resource Links</label>
                <div className="flex gap-2">
                  <Input
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    placeholder="https://example.com/resource"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
                  />
                  <Button type="button" onClick={addResource} disabled={!newResource.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add helpful resources, documents, or links for this lesson
                </p>
              </div>

              {formData.resources.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Added Resources</label>
                  <div className="space-y-2">
                    {formData.resources.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-sm text-blue-600 hover:underline truncate"
                        >
                          {resource}
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResource(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Publishing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_published" className="text-sm font-medium">
                  Publish this lesson immediately
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Published lessons are visible to enrolled students. You can always change this later.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tutor/courses/${courseId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Lesson
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}



