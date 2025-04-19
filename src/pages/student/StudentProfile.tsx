import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student, StudentProfile as StudentProfileType } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon, Trophy, BookOpen, GraduationCap, Plus, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const StudentProfile = () => {
  const { currentUser, login } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [newAchievement, setNewAchievement] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [currentInstitution, setCurrentInstitution] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [socialLinks, setSocialLinks] = useState<{
    linkedin: string;
    twitter: string;
    github: string;
    other: string;
  }>({    
    linkedin: '',
    twitter: '',
    github: '',
    other: ''
  });
  
  // Calculate age based on date of birth
  const calculateAge = (dob: Date | undefined) => {
    if (!dob) return 'Not specified';
    
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };
  
  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      const student = currentUser as Student;
      setProfileData(student);
      setName(student.name || '');
      setBio(student.bio || '');
      setProfilePicture(student.profilePicture);
      setSocialLinks({
        linkedin: student.socialLinks?.linkedin || '',
        twitter: student.socialLinks?.twitter || '',
        github: student.socialLinks?.github || '',
        other: student.socialLinks?.other || ''
      });
      
      if (student.dateOfBirth) {
        setDateOfBirth(new Date(student.dateOfBirth));
      }
      
      if (student.studentProfile) {
        setCurrentInstitution(student.studentProfile.currentInstitution || '');
      }
    }
  }, [currentUser]);
  
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      
      const updatedProfile: StudentProfileType = {
        ...prev.studentProfile,
        achievements: [...(prev.studentProfile?.achievements || []), newAchievement]
      };
      
      return {
        ...prev,
        studentProfile: updatedProfile
      };
    });
    
    setNewAchievement('');
  };
  
  const removeAchievement = (index: number) => {
    setProfileData(prev => {
      if (!prev || !prev.studentProfile?.achievements) return prev;
      
      const updatedAchievements = [...prev.studentProfile.achievements];
      updatedAchievements.splice(index, 1);
      
      return {
        ...prev,
        studentProfile: {
          ...prev.studentProfile,
          achievements: updatedAchievements
        }
      };
    });
  };
  
  const addQualification = () => {
    if (!newQualification.trim()) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      
      const updatedProfile: StudentProfileType = {
        ...prev.studentProfile,
        academicQualifications: [...(prev.studentProfile?.academicQualifications || []), newQualification]
      };
      
      return {
        ...prev,
        studentProfile: updatedProfile
      };
    });
    
    setNewQualification('');
  };
  
  const removeQualification = (index: number) => {
    setProfileData(prev => {
      if (!prev || !prev.studentProfile?.academicQualifications) return prev;
      
      const updatedQualifications = [...prev.studentProfile.academicQualifications];
      updatedQualifications.splice(index, 1);
      
      return {
        ...prev,
        studentProfile: {
          ...prev.studentProfile,
          academicQualifications: updatedQualifications
        }
      };
    });
  };
  
  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      
      const updatedProfile: StudentProfileType = {
        ...prev.studentProfile,
        skills: [...(prev.studentProfile?.skills || []), newSkill]
      };
      
      return {
        ...prev,
        studentProfile: updatedProfile
      };
    });
    
    setNewSkill('');
  };
  
  const removeSkill = (index: number) => {
    setProfileData(prev => {
      if (!prev || !prev.studentProfile?.skills) return prev;
      
      const updatedSkills = [...prev.studentProfile.skills];
      updatedSkills.splice(index, 1);
      
      return {
        ...prev,
        studentProfile: {
          ...prev.studentProfile,
          skills: updatedSkills
        }
      };
    });
  };
  
  const handleSaveProfile = () => {
    if (!profileData) return;
    
    const updatedUser: Student = {
      ...profileData,
      name,
      bio,
      profilePicture,
      dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : undefined,
      socialLinks,
      studentProfile: {
        ...profileData.studentProfile,
        currentInstitution
      }
    };
    
    // In a real app, you would send this to the backend
    // For now, update in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => 
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update current user in localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    storedUser.user = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(storedUser));
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved."
    });
    
    // Update auth context
    login(updatedUser.email, '');
    
    setIsEditing(false);
  };
  
  if (!profileData) {
    return (
      <PageLayout>
        <div className="container py-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p>Loading profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container py-10">
        <div className="flex flex-col gap-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="relative">
                  <Avatar className="h-32 w-32 cursor-pointer border-4 border-primary/20 shadow-md overflow-hidden" onClick={handleProfilePictureClick}>
                    <AvatarImage 
                      src={profilePicture} 
                      className="object-cover aspect-square"
                    />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary font-medium">
                      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={!isEditing}
                  />
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1">
                      <Plus className="h-4 w-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="text-2xl font-bold mb-2"
                      placeholder="Your Name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{name}</h1>
                  )}
                  
                  <div className="flex items-center gap-2 justify-center md:justify-start text-muted-foreground mb-4">
                    <span>Student</span>
                    {dateOfBirth && (
                      <>
                        <span>•</span>
                        <span>{calculateAge(dateOfBirth)} years old</span>
                      </>
                    )}
                    {currentInstitution && (
                      <>
                        <span>•</span>
                        <span>{currentInstitution}</span>
                      </>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <Textarea 
                      value={bio || ''} 
                      onChange={(e) => setBio(e.target.value)} 
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px] mb-4"
                    />
                  ) : (
                    <p className="text-muted-foreground mb-4">{bio || 'No bio provided.'}</p>
                  )}
                  
                  {isEditing ? (
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button onClick={handleSaveProfile}>Save Profile</Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Content */}
          <Tabs defaultValue="info">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic information and social media profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateOfBirth && "text-muted-foreground"
                              )}
                              disabled={!isEditing}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateOfBirth}
                              onSelect={setDateOfBirth}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us about yourself..." 
                        value={bio || ''} 
                        onChange={(e) => setBio(e.target.value)}
                        className="min-h-[100px]"
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentInstitution">Current Institution</Label>
                      <Input 
                        id="currentInstitution" 
                        value={currentInstitution || ''} 
                        onChange={(e) => setCurrentInstitution(e.target.value)} 
                        disabled={!isEditing}
                        placeholder="Where are you currently studying?"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Social Media</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          placeholder="LinkedIn URL" 
                          value={socialLinks.linkedin || ''} 
                          onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                          id="twitter" 
                          placeholder="Twitter URL" 
                          value={socialLinks.twitter || ''} 
                          onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input 
                          id="github" 
                          placeholder="GitHub URL" 
                          value={socialLinks.github || ''} 
                          onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="other">Other</Label>
                        <Input 
                          id="other" 
                          placeholder="Other URL" 
                          value={socialLinks.other || ''} 
                          onChange={(e) => setSocialLinks({...socialLinks, other: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Qualifications</CardTitle>
                  <CardDescription>Your educational background and qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add a qualification..." 
                          value={newQualification} 
                          onChange={(e) => setNewQualification(e.target.value)}
                        />
                        <Button onClick={addQualification} type="button">Add</Button>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {profileData.studentProfile?.academicQualifications && profileData.studentProfile.academicQualifications.length > 0 ? (
                        <ul className="space-y-2">
                          {profileData.studentProfile.academicQualifications.map((qualification, index) => (
                            <li key={index} className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                <span>{qualification}</span>
                              </div>
                              {isEditing && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeQualification(index)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No academic qualifications added yet.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your accomplishments and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add an achievement..." 
                          value={newAchievement} 
                          onChange={(e) => setNewAchievement(e.target.value)}
                        />
                        <Button onClick={addAchievement} type="button">Add</Button>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {profileData.studentProfile?.achievements && profileData.studentProfile.achievements.length > 0 ? (
                        <ul className="space-y-2">
                          {profileData.studentProfile.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                <span>{achievement}</span>
                              </div>
                              {isEditing && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeAchievement(index)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No achievements added yet.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Your skills and competencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add a skill..." 
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <Button onClick={addSkill} type="button">Add</Button>
                      </div>
                    )}
                    
                    <div>
                      {profileData.studentProfile?.skills && profileData.studentProfile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profileData.studentProfile.skills.map((skill, index) => (
                            <div 
                              key={index} 
                              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                              <span>{skill}</span>
                              {isEditing && (
                                <button 
                                  onClick={() => removeSkill(index)}
                                  className="text-red-500 hover:text-red-700 ml-1"
                                >
                                  <Trash className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentProfile;
