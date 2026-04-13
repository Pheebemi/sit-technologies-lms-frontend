"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Users, 
  Award, 
  TrendingUp, 
  Star, 
  Target, 
  Zap, 
  Globe, 
  Shield, 
  Lightbulb,
  ArrowRight,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SuccessStoriesPage() {
  const router = useRouter()

  const achievements = [
    {
      year: "2024",
      title: "1000+ Students Trained",
      description: "Successfully trained over 1000 students in various technology programs",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      stats: "1000+"
    },
    {
      year: "2024",
      title: "50+ Solar Installations",
      description: "Completed over 50 solar energy installations across Taraba State",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      stats: "50+"
    },
    {
      year: "2024",
      title: "200+ CCTV Systems",
      description: "Installed and maintained over 200 CCTV security systems",
      icon: Shield,
      color: "from-purple-500 to-indigo-500",
      stats: "200+"
    },
    {
      year: "2024",
      title: "95% Success Rate",
      description: "Maintained 95% success rate in all our training programs",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      stats: "95%"
    }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "ALGADDAF Technology Hub was established with a vision to bridge the digital divide in Northern Nigeria",
      icon: Lightbulb,
      highlight: true
    },
    {
      year: "2021",
      title: "First Training Center",
      description: "Opened our first training center in Jalingo, Taraba State",
      icon: MapPin
    },
    {
      year: "2022",
      title: "Solar Division Launch",
      description: "Expanded into renewable energy solutions with our solar installation services",
      icon: Zap
    },
    {
      year: "2023",
      title: "Security Services",
      description: "Added CCTV installation and security system services to our portfolio",
      icon: Shield
    },
    {
      year: "2024",
      title: "LMS Platform Launch",
      description: "Launched our comprehensive Learning Management System for online education",
      icon: Globe
    }
  ]

  const testimonials = [
    {
      name: "Aisha Mohammed",
      role: "Web Developer",
      company: "Tech Solutions Ltd",
      content: "ALGADDAF Technology Hub transformed my career. Their comprehensive training program gave me the skills I needed to land my dream job as a web developer.",
      rating: 5,
      image: "👩‍💻"
    },
    {
      name: "Ibrahim Tanko",
      role: "Solar Engineer",
      company: "Green Energy Co.",
      content: "The solar installation training at ALGADDAF was exceptional. I now run my own solar installation business and have completed over 30 projects.",
      rating: 5,
      image: "👨‍🔧"
    },
    {
      name: "Fatima Usman",
      role: "Cybersecurity Analyst",
      company: "SecureTech Nigeria",
      content: "The cybersecurity program at ALGADDAF opened doors I never knew existed. I'm now working with top companies to secure their digital assets.",
      rating: 5,
      image: "👩‍💻"
    },
    {
      name: "Mohammed Bello",
      role: "Business Owner",
      company: "Bello Enterprises",
      content: "ALGADDAF's CCTV installation service has been a game-changer for my business. The security system they installed has given me peace of mind.",
      rating: 5,
      image: "👨‍💼"
    }
  ]

  const awards = [
    {
      title: "Best Tech Training Center 2024",
      organization: "Taraba State Government",
      year: "2024",
      description: "Recognized for excellence in technology education and training"
    },
    {
      title: "Innovation in Education Award",
      organization: "Northern Nigeria Tech Summit",
      year: "2023",
      description: "Awarded for innovative approaches to technology education"
    },
    {
      title: "Community Impact Award",
      organization: "Jalingo Business Association",
      year: "2023",
      description: "Recognized for positive impact on local community development"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">ALGADDAF</span>
                <div className="text-xs text-muted-foreground -mt-1">Technology Hub</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/success-stories" className="text-sm font-medium text-foreground">
                Success Stories
              </Link>
              <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </nav>

            {/* Theme Toggle */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button size="sm" onClick={() => router.push('/sign-up')}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/20">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-6">Our Success Stories</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Celebrating milestones, achievements, and the impact we've made in transforming lives through technology education and innovative solutions.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Students Trained</div>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Solar Projects</div>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
                <div className="text-sm text-muted-foreground">CCTV Systems</div>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Key Achievements</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our commitment to excellence has resulted in remarkable achievements across all our service areas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon
              return (
                <Card key={index} className="text-center p-6 group hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">{achievement.stats}</div>
                    <p className="text-muted-foreground text-sm">{achievement.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From humble beginnings to becoming a leading technology hub in Northern Nigeria.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon
                return (
                  <div key={index} className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      milestone.highlight 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="text-sm">{milestone.year}</Badge>
                        {milestone.highlight && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">Milestone</Badge>}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Success Gallery</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Visual stories of our achievements, training sessions, installations, and the impact we've made in our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Training Sessions */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Web Development Training</h3>
                  <p className="text-sm opacity-90">Students learning modern web technologies</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-blue-500 text-white mb-2">Training</Badge>
                  <p className="text-sm">2024 - 50+ students graduated</p>
                </div>
              </div>
            </div>

            {/* Solar Installation */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Zap className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Solar Installation</h3>
                  <p className="text-sm opacity-90">Commercial solar panel installation</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-yellow-500 text-black mb-2">Solar</Badge>
                  <p className="text-sm">2024 - 5kW system installed</p>
                </div>
              </div>
            </div>

            {/* CCTV Installation */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Shield className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">CCTV Security System</h3>
                  <p className="text-sm opacity-90">Advanced surveillance installation</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-purple-500 text-white mb-2">Security</Badge>
                  <p className="text-sm">2024 - 16-camera system</p>
                </div>
              </div>
            </div>

            {/* Graduation Ceremony */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Trophy className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Graduation Ceremony</h3>
                  <p className="text-sm opacity-90">Celebrating student achievements</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-green-500 text-white mb-2">Graduation</Badge>
                  <p className="text-sm">2024 - 200+ graduates</p>
                </div>
              </div>
            </div>

            {/* Cybersecurity Training */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Shield className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Cybersecurity Training</h3>
                  <p className="text-sm opacity-90">Advanced security protocols</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-red-500 text-white mb-2">Cybersecurity</Badge>
                  <p className="text-sm">2024 - 30+ certified professionals</p>
                </div>
              </div>
            </div>

            {/* Award Ceremony */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Award className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Award Ceremony</h3>
                  <p className="text-sm opacity-90">Best Tech Training Center 2024</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-yellow-400 text-black mb-2">Award</Badge>
                  <p className="text-sm">2024 - Taraba State Government</p>
                </div>
              </div>
            </div>

            {/* Digital Marketing Training */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Digital Marketing</h3>
                  <p className="text-sm opacity-90">Social media and online marketing</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-indigo-500 text-white mb-2">Marketing</Badge>
                  <p className="text-sm">2024 - 40+ entrepreneurs trained</p>
                </div>
              </div>
            </div>

            {/* Computer Appreciation */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Globe className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Computer Appreciation</h3>
                  <p className="text-sm opacity-90">Basic computer skills training</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-teal-500 text-white mb-2">Basic Training</Badge>
                  <p className="text-sm">2024 - 100+ beginners trained</p>
                </div>
              </div>
            </div>

            {/* Community Outreach */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="aspect-[4/3] bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Community Outreach</h3>
                  <p className="text-sm opacity-90">Free training for underserved communities</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Badge className="bg-rose-500 text-white mb-2">Community</Badge>
                  <p className="text-sm">2024 - 5 communities reached</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from our students and clients who have transformed their lives and businesses with our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Awards & Recognition</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by various organizations and government bodies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{award.title}</CardTitle>
                  <CardDescription>{award.organization}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="mb-3">{award.year}</Badge>
                  <p className="text-sm text-muted-foreground">{award.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4">Be Part of Our Success Story</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students and clients who have transformed their lives with ALGADDAF Technology Hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => router.push('/sign-up')} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/#contact')}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ALGADDAF Technology Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering communities through technology education, solar solutions, and security systems.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Services</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">Tech Training</li>
                <li className="text-muted-foreground">Solar Installation</li>
                <li className="text-muted-foreground">CCTV Systems</li>
                <li className="text-muted-foreground">LMS Platform</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>+234 803 937 6179</p>
                <p>+234 706 352 3802</p>
                <p>info@algaddaftech.com</p>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Locations</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>No. 46 Barde Way, Technology Incubation Centre Jalingo, Unit II Block One</p>
                <p>No. 3 Karofi Road Jalingo & Muslim Council</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 ALGADDAF Technology Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
