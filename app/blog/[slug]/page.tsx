'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPost, addBlogComment } from '@/lib/api'
import { toast } from 'sonner'
import { BlogLayout } from '@/components/blog-layout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Eye, Heart, Clock, User, Tag, MessageCircle, Send, ArrowLeft } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  author: {
    username: string
    first_name: string
    last_name: string
  }
  category: {
    name: string
    slug: string
  }
  tags: Array<{
    name: string
    slug: string
  }>
  published_at: string
  views: number
  likes: number
  read_time: string
  comments: Array<{
    id: number
    name: string
    content: string
    created_at: string
  }>
}

interface CommentForm {
  name: string
  email: string
  content: string
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentForm, setCommentForm] = useState<CommentForm>({
    name: '',
    email: '',
    content: ''
  })
  const [submittingComment, setSubmittingComment] = useState(false)
  
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      const postData = await getBlogPost(slug)
      setPost(postData)
    } catch (error) {
      console.error('Error loading blog post:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      toast.error('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!post || !commentForm.name.trim() || !commentForm.email.trim() || !commentForm.content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setSubmittingComment(true)
      await addBlogComment(post.slug, commentForm)
      
      toast.success('Comment submitted successfully! It will be reviewed before being published.')
      setCommentForm({ name: '', email: '', content: '' })
      
      // Reload post to get updated comments
      loadPost()
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Failed to submit comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <BlogLayout showBackButton backHref="/blog" backLabel="Back to Blog">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </BlogLayout>
    )
  }

  if (!post) {
    return (
      <BlogLayout showBackButton backHref="/blog" backLabel="Back to Blog">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-muted-foreground text-6xl mb-4">📝</div>
            <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">The blog post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout showBackButton backHref="/blog" backLabel="Back to Blog">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <span>→</span>
              <span>{post.category.name}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>By {post.author.first_name} {post.author.last_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.read_time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{post.likes} likes</span>
              </div>
            </div>
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.slug} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            {post.featured_image && (
              <div className="aspect-video relative">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="mt-12">
            <CardHeader>
              <h3 className="text-2xl font-bold flex items-center">
                <MessageCircle className="h-6 w-6 mr-2" />
                Comments ({post.comments.length})
              </h3>
            </CardHeader>
            <CardContent>
              {/* Comments List */}
              {post.comments.length > 0 ? (
                <div className="space-y-6 mb-8">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {comment.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{comment.name}</h4>
                          <p className="text-sm text-muted-foreground">{formatDateTime(comment.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-foreground ml-11">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}

              {/* Comment Form */}
              <div className="border-t border-border pt-8">
                <h4 className="text-lg font-semibold mb-4">Leave a Comment</h4>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name *
                      </label>
                      <Input
                        type="text"
                        id="name"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email *
                      </label>
                      <Input
                        type="email"
                        id="email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">
                      Comment *
                    </label>
                    <Textarea
                      id="content"
                      rows={4}
                      value={commentForm.content}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your thoughts..."
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={submittingComment}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {submittingComment ? 'Submitting...' : 'Submit Comment'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">More from Blog</h3>
              <Button variant="outline" asChild>
                <Link href="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  View All Posts
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <div className="text-muted-foreground mb-2">Related posts would appear here</div>
                <p className="text-sm text-muted-foreground">This feature can be implemented to show related blog posts</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}