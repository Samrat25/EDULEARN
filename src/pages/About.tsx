import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <PageLayout>
      <div className="container py-10">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/Logo.png" alt="EduLearn Logo" className="h-20 w-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4">About EduLearn</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Transforming education through technology, connecting learners with expert educators worldwide
            </p>
          </div>
          
          {/* About Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                At EduLearn, we are committed to democratizing education by providing accessible, 
                high-quality learning experiences for everyone. We believe that knowledge should be 
                available to all, regardless of geographical or socioeconomic barriers.
              </p>
              <p className="text-muted-foreground">
                Founded in 2023, our platform bridges the gap between passionate educators and 
                eager learners, creating a vibrant community where knowledge flows freely and 
                learning becomes a collaborative journey.
              </p>
            </div>
            
            <div className="bg-primary/5 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Interactive online courses across diverse subjects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Expert instructors with real-world expertise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Flexible learning schedules that adapt to your needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Comprehensive assessments and feedback mechanisms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Personalized learning paths tailored to your goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Community forums for collaborative learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>AI-powered study tools including notes generation and mind maps</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">500+</span>
                <span className="text-sm text-muted-foreground mt-2">Courses</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">100+</span>
                <span className="text-sm text-muted-foreground mt-2">Expert Instructors</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">50k+</span>
                <span className="text-sm text-muted-foreground mt-2">Students</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">25+</span>
                <span className="text-sm text-muted-foreground mt-2">Countries</span>
              </CardContent>
            </Card>
          </div>
          
          <Separator />
          
          {/* Team Section */}
          <div className="py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">JS</span>
                  </div>
                  <CardTitle>John Smith</CardTitle>
                  <CardDescription>Founder & CEO</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  Former education technology executive with a passion for making learning accessible to everyone.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">AP</span>
                  </div>
                  <CardTitle>Amanda Patel</CardTitle>
                  <CardDescription>Head of Education</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  PhD in Educational Technology with 15 years of experience in curriculum development.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">MR</span>
                  </div>
                  <CardTitle>Marcus Rodriguez</CardTitle>
                  <CardDescription>CTO</CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  Tech innovator with expertise in building scalable platforms for educational content delivery.
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Separator />
          
          {/* Contact Section */}
          <div className="py-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Get In Touch</CardTitle>
                  <CardDescription>We'd love to hear from you. Reach out through any of these channels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>support@edulearn.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>123 Education Avenue, Learning City, 10001</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Connect with us on social media</h3>
                    <div className="flex gap-3">
                      <Button variant="outline" size="icon" asChild>
                        <a href="https://linkedin.com/company/edulearn" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="https://twitter.com/edulearn" target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="https://facebook.com/edulearn" target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="https://instagram.com/edulearn" target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href="https://github.com/edulearn" target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stay Connected</CardTitle>
                  <CardDescription>Join our community and stay updated with the latest courses and educational content.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Subscribe to our newsletter for weekly updates on new courses, educational resources, and learning tips.
                      </p>
                      
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          placeholder="Enter your email" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <Button>Subscribe</Button>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-2">Join Our Community</h3>
                      <div className="flex flex-col gap-3">
                        <Button variant="outline" className="justify-start">
                          <img src="https://cdn.cdnlogo.com/logos/d/55/discord.svg" alt="Discord" className="h-4 w-4 mr-2" />
                          <span>EduLearn Discord Server</span>
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <img src="https://static.vecteezy.com/system/resources/previews/018/930/587/original/telegram-logo-telegram-icon-transparent-free-png.png" alt="Telegram" className="h-4 w-4 mr-2" />
                          <span>Telegram Group</span>
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-4 w-4 mr-2" />
                          <span>WhatsApp Community</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
