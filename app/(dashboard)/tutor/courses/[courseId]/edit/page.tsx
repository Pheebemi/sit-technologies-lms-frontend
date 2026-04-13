"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { updateCourse, getCourse, getCategories, Category, Course } from '@/lib/api'
import RichTextEditor from '@/components/rich-text-editor'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Upload, 
  DollarSign, 
  Clock, 
  Globe, 
  BookOpen,
  Star,
  Save,
  Eye
} from 'lucide-react'

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    category: '',
    price: 0,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration_hours: 0,
    language: 'English',
    preview_video_url: '',
    status: 'draft' as 'draft' | 'published',
    is_featured: false
  })

  useEffect(() => {
    if (courseId) {
      loadData()
    }
  }, [courseId])

  const loadData = async () => {
    try {
      setInitialLoading(true)
      const [courseData, categoriesData] = await Promise.all([
        getCourse(courseId),
        getCategories()
      ])
      
      setCourse(courseData)
      setCategories(categoriesData)
      
      // Pre-fill form with existing course data
      setFormData({
        title: courseData.title || '',
        description: courseData.description || '',
        short_description: courseData.short_description || '',
        category: courseData.category?.id?.toString() || '',
        price: courseData.price || 0,
        difficulty: courseData.difficulty || 'beginner',
        duration_hours: courseData.duration_hours || 0,
        language: courseData.language || 'English',
        preview_video_url: courseData.preview_video_url || '',
        status: courseData.status || 'draft',
        is_featured: courseData.is_featured || false
      })
      
      // Set existing thumbnail preview if available
      if (courseData.thumbnail_url) {
        setThumbnailPreview(courseData.thumbnail_url)
      }
    } catch (error) {
      console.error('Failed to load course data:', error)
      toast.error('Failed to load course data')
      router.push('/tutor/courses')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else if (name === 'duration_hours') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Course title is required')
      return
    }
    
    if (!formData.description.trim()) {
      toast.error('Course description is required')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Updating course...', {
      description: 'Please wait while we update your course'
    })

    try {
      const courseData = {
        ...formData,
        category: formData.category ? parseInt(formData.category) : undefined,
        thumbnail: thumbnail || undefined
      }

      await updateCourse(courseId, courseData)
      
      toast.success('Course updated successfully!', {
        description: 'Your course changes have been saved'
      })
      
      router.push(`/tutor/courses/${courseId}`)
    } catch (error: any) {
      console.error('Course update error:', error)
      
      let errorMessage = 'Failed to update course'
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

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading course data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Course not found</h3>
              <p className="text-muted-foreground mb-6">The course you're trying to edit doesn't exist or you don't have access to it.</p>
              <Button onClick={() => router.push('/tutor/courses')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold">Edit Course</h1>
            <p className="text-muted-foreground">Update your course information and settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Title *</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter course title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description</label>
                <Input
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  placeholder="Brief description for course cards"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Description *</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                  placeholder="Write a detailed course description — use headings, bullet lists, and bold text to make it easy to read"
                  minHeight="180px"
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Course Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (Hours)</label>
                  <Input
                    name="duration_hours"
                    type="number"
                    value={formData.duration_hours}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Input
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    placeholder="English"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={difficultyColors[formData.difficulty]}>
                  {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formData.duration_hours} hours • {formData.language}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Price (₦)</label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Set to ₦0 for a free course
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_featured" className="text-sm font-medium">
                  Feature this course
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Thumbnail</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="thumbnail"
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Upload className="w-4 h-4" />
                    {thumbnail ? 'Change Image' : 'Choose New Image'}
                  </label>
                  {thumbnailPreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                {course.thumbnail_url && !thumbnail && (
                  <p className="text-xs text-muted-foreground">
                    Current thumbnail will be kept if no new image is selected
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preview Video (YouTube URL)</label>
                <Input
                  name="preview_video_url"
                  value={formData.preview_video_url}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Add a YouTube URL for course preview video
                </p>
              </div>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Publishing Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Now</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Draft courses are only visible to you. Published courses are visible to students.
                </p>
              </div>
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Course
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
