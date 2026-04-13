'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts, getBlogCategories, getBlogTags, getBlogStats } from '@/lib/api'
import { toast } from 'sonner'
import { BlogLayout } from '@/components/blog-layout'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Calendar, Eye, Heart, Clock, User, Tag, BookOpen, TrendingUp } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  slug: string
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
}

interface Category {
  id: number
  name: string
  slug: string
  post_count: number
}

interface Tag {
  id: number
  name: string
  slug: string
  post_count: number
}

interface BlogStats {
  total_posts: number
  total_categories: number
  total_tags: number
  total_views: number
  popular_posts: BlogPost[]
  recent_posts: BlogPost[]
  categories_with_counts: Category[]
}

function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const searchParams = useSearchParams()

  useEffect(() => {
    loadBlogData()
  }, [currentPage, selectedCategory, selectedTag, searchQuery])

  useEffect(() => {
    const page = searchParams.get('page')
    if (page) {
      setCurrentPage(parseInt(page))
    }
  }, [searchParams])

  const loadBlogData = async () => {
    try {
      setLoading(true)
      
      const [postsData, categoriesData, tagsData, statsData] = await Promise.all([
        getBlogPosts({
          page: currentPage,
          category: selectedCategory || undefined,
          tag: selectedTag || undefined,
          search: searchQuery || undefined
        }),
        getBlogCategories(),
        getBlogTags(),
        getBlogStats()
      ])

      setPosts(postsData.results || [])
      setCategories(categoriesData || [])
      setTags(tagsData || [])
      setStats(statsData)

      if (postsData.count) {
        setTotalPages(Math.ceil(postsData.count / 12))
      }
    } catch (error) {
      console.error('Error loading blog data:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      toast.error('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadBlogData()
  }

  const handleCategoryFilter = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? '' : categorySlug)
    setCurrentPage(1)
  }

  const handleTagFilter = (tagSlug: string) => {
    setSelectedTag(tagSlug === selectedTag ? '' : tagSlug)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedTag('')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <BlogLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-primary mr-4" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Blog
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Discover insights, tutorials, and updates from our learning community
            </p>
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total_posts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total_categories}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                {/* <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total_views}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div> */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total_tags}</div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Search */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" className="w-full">
                      Search
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Categories</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.slug ? "default" : "ghost"}
                        onClick={() => handleCategoryFilter(category.slug)}
                        className="w-full justify-start"
                      >
                        {category.name} ({category.post_count})
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Tags
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTag === tag.slug ? "default" : "secondary"}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleTagFilter(tag.slug)}
                      >
                        {tag.name} ({tag.post_count})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Posts */}
              {stats?.popular_posts && stats.popular_posts.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Popular Posts
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.popular_posts.slice(0, 3).map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="block hover:bg-muted p-2 rounded-md transition-colors"
                        >
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Eye className="h-3 w-3 mr-1" />
                            {post.views}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Clear Filters */}
              {(selectedCategory || selectedTag || searchQuery) && (
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category.name}</Badge>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        
                        <h2 className="text-xl font-bold mb-3 line-clamp-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {post.author.first_name} {post.author.last_name}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {post.read_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {post.views}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.slug} variant="outline" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory || selectedTag
                    ? 'Try adjusting your search or filters'
                    : 'No blog posts have been published yet'
                  }
                </p>
                {(searchQuery || selectedCategory || selectedTag) && (
                  <Button onClick={clearFilters}>Clear Filters</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <BlogLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </BlogLayout>
    }>
      <BlogContent />
    </Suspense>
  )
}