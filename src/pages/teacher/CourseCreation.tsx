
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { createCourse } from '@/services/courseService';
import { Lecture } from '@/types/course';

interface LectureInput extends Omit<Lecture, 'id'> {}

const CourseCreation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [lectures, setLectures] = useState<LectureInput[]>([
    {
      title: '',
      description: '',
      videoUrl: '',
      duration: 0,
      order: 1
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLectureChange = (index: number, field: keyof LectureInput, value: string | number) => {
    const updatedLectures = [...lectures];
    
    // If the field is videoUrl, convert YouTube URLs to embed format
    if (field === 'videoUrl' && typeof value === 'string') {
      let embedUrl = value;
      if (value.includes('youtube.com/watch?v=')) {
        const videoId = value.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        value = embedUrl;
      } else if (value.includes('youtu.be/')) {
        const videoId = value.split('youtu.be/')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        value = embedUrl;
      }
    }
    
    updatedLectures[index] = {
      ...updatedLectures[index],
      [field]: value
    };
    setLectures(updatedLectures);
  };

  const addLecture = () => {
    setLectures([
      ...lectures,
      {
        title: '',
        description: '',
        videoUrl: '',
        duration: 0,
        order: lectures.length + 1
      }
    ]);
  };

  const removeLecture = (index: number) => {
    if (lectures.length <= 1) return;
    
    const updatedLectures = lectures.filter((_, i) => i !== index);
    // Update order for remaining lectures
    updatedLectures.forEach((lecture, i) => {
      lecture.order = i + 1;
    });
    
    setLectures(updatedLectures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a course.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!title || !description) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate lectures
    if (lectures.some(lecture => !lecture.title || !lecture.videoUrl)) {
      toast({
        title: 'Validation error',
        description: 'Please fill in all lecture details.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add IDs to lectures
      const lecturesWithIds = lectures.map(lecture => ({
        ...lecture,
        id: `lecture_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      }));
      
      const courseData = {
        title,
        description,
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
        lectures: lecturesWithIds,
        assignments: [],
        tests: [],
        students: []
      };
      
      const createdCourse = createCourse(courseData);
      
      toast({
        title: 'Course created',
        description: 'Your course has been created successfully.',
      });
      
      navigate('/teacher/dashboard');
    } catch (error) {
      toast({
        title: 'Error creating course',
        description: 'There was an error creating your course.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">Fill in the details to create your course</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Enter the basic information about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Introduction to Web Development"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of your course..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="URL to your course thumbnail image"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL for your course thumbnail. If left blank, a default image will be used.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Add lectures to your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {lectures.map((lecture, index) => (
                <div key={index} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Lecture {index + 1}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLecture(index)}
                      disabled={lectures.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`lecture-title-${index}`}>Lecture Title *</Label>
                      <Input
                        id={`lecture-title-${index}`}
                        value={lecture.title}
                        onChange={(e) => handleLectureChange(index, 'title', e.target.value)}
                        placeholder="e.g., Getting Started with HTML"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lecture-description-${index}`}>Lecture Description</Label>
                      <Textarea
                        id={`lecture-description-${index}`}
                        value={lecture.description}
                        onChange={(e) => handleLectureChange(index, 'description', e.target.value)}
                        placeholder="Describe what students will learn in this lecture..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lecture-video-${index}`}>Video URL *</Label>
                      <Input
                        id={`lecture-video-${index}`}
                        value={lecture.videoUrl}
                        onChange={(e) => handleLectureChange(index, 'videoUrl', e.target.value)}
                        placeholder="e.g., https://www.youtube.com/embed/dQw4w9WgXcQ"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter a YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lecture-duration-${index}`}>Duration (minutes) *</Label>
                      <Input
                        id={`lecture-duration-${index}`}
                        type="number"
                        min="1"
                        value={lecture.duration}
                        onChange={(e) => handleLectureChange(index, 'duration', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addLecture}
                className="w-full"
              >
                Add Another Lecture
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/teacher/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default CourseCreation;
