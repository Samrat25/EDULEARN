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
import { Teacher, TeacherProfile as TeacherProfileType } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { Briefcase, Award, BookOpen, GraduationCap, Plus, Trash, Building, LibraryBig } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TeacherProfile = () => {
  const { currentUser, login } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [currentStatus, setCurrentStatus] = useState('');
  const [teachingExperience, setTeachingExperience] = useState<number>(0);
  const [newDegree, setNewDegree] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newResearchInterest, setNewResearchInterest] = useState('');
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
  
  useEffect(() => {
    if (currentUser && currentUser.role === 'teacher') {
      const teacher = currentUser as Teacher;
      setProfileData(teacher);
      setName(teacher.name || '');
      setBio(teacher.bio || '');
      setProfilePicture(teacher.profilePicture);
      setSocialLinks({
        linkedin: teacher.socialLinks?.linkedin || '',
        twitter: teacher.socialLinks?.twitter || '',
        github: teacher.socialLinks?.github || '',
        other: teacher.socialLinks?.other || ''
      });
      
      if (teacher.teacherProfile) {
        setCurrentStatus(teacher.teacherProfile.currentStatus || '');
        setTeachingExperience(teacher.teacherProfile.teachingExperience || 0);
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
  
  const addDegree = () => {
    if (!newDegree.trim()) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      
      const updatedProfile: TeacherProfileType = {
        ...prev.teacherProfile,
        degrees: [...(prev.teacherProfile?.degrees || []), newDegree]
      };
      
      return {
        ...prev,
        teacherProfile: updatedProfile
      };
    });
    
    setNewDegree('');
  };
  
  const removeDegree = (index: number) => {
    setProfileData(prev => {
      if (!prev || !prev.teacherProfile?.degrees) return prev;
      
      const updatedDegrees = [...prev.teacherProfile.degrees];
      updatedDegrees.splice(index, 1);
      
      return {
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile,
          degrees: updatedDegrees
        }
      };
    });
  };
  
  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      
      const updatedProfile: TeacherProfileType = {
        ...prev.teacherProfile,
        achievements: [...(prev.teacherProfile?.achievements || []), newAchievement]
      };
      
      return {
        ...prev,
        teacherProfile: updatedProfile
      };
    });
    
    setNewAchievement('');
  };
  
  const removeAchievement = (index: number) => {
    setProfileData(prev => {
      if (!prev || !prev.teacherProfile?.achievements) return prev;
      
      const updatedAchievements = [...prev.teacherProfile.achievements];
      updatedAchievements.splice(index, 1);
      
      return {
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile,
          achievements: updatedAchievements
        }
      };
    });
  };
  
  const addQualification = () => {
    if (!newQualification.trim()) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      
      const updatedProfile: TeacherProfileType = {
        ...prev.teacherProfile,
        qualifications: [...(prev.teacherProfile?.qualifications || []), newQualification]
      };
      
      return {
        ...prev,
        teacherProfile: updatedProfile
      };
    });
    
    setNewQualification('');
  };
  
  const removeQualification = (index: number) => {
    setProfileData(prev => {
      if (!prev || !prev.teacherProfile?.qualifications) return prev;
      
      const updatedQualifications = [...prev.teacherProfile.qualifications];
      updatedQualifications.splice(index, 1);
      
      return {
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile,
          qualifications: updatedQualifications
        }
      };
    });
  };
  
  const addSpecialization = () => {
    if (!newSpecialization.trim()) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      
      const updatedProfile: TeacherProfileType = {
        ...prev.teacherProfile,
        specializations: [...(prev.teacherProfile?.specializations || []), newSpecialization]
      };
      
      return {
        ...prev,
        teacherProfile: updatedProfile
      };
    });
    
    setNewSpecialization('');
  };
  
  const removeSpecialization = (index: number) => {
    setProfileData(prev => {
      if (!prev || !prev.teacherProfile?.specializations) return prev;
      
      const updatedSpecializations = [...prev.teacherProfile.specializations];
      updatedSpecializations.splice(index, 1);
      
      return {
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile,
          specializations: updatedSpecializations
        }
      };
    });
  };
  
  const addResearchInterest = () => {
    if (!newResearchInterest.trim()) return;
    
    setProfileData(prev => {
      if (!prev) return prev;
      
      const updatedProfile: TeacherProfileType = {
        ...prev.teacherProfile,
        researchInterests: [...(prev.teacherProfile?.researchInterests || []), newResearchInterest]
      };
      
      return {
        ...prev,
        teacherProfile: updatedProfile
      };
    });
    
    setNewResearchInterest('');
  };
  
  const removeResearchInterest = (index: number) => {
    setProfileData(prev => {
      if (!prev || !prev.teacherProfile?.researchInterests) return prev;
      
      const updatedInterests = [...prev.teacherProfile.researchInterests];
      updatedInterests.splice(index, 1);
      
      return {
        ...prev,
        teacherProfile: {
          ...prev.teacherProfile,
          researchInterests: updatedInterests
        }
      };
    });
  };
  
  const handleSaveProfile = () => {
    if (!profileData) return;
    
    const updatedUser: Teacher = {
      ...profileData,
      name,
      bio,
      profilePicture,
      socialLinks,
      teacherProfile: {
        ...profileData.teacherProfile,
        currentStatus,
        teachingExperience: Number(teachingExperience) || 0
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
                  <Avatar className="h-32 w-32 cursor-pointer" onClick={handleProfilePictureClick}>
                    <AvatarImage src={profilePicture} />
                    <AvatarFallback className="text-4xl">
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
                    <span>Teacher</span>
                    {teachingExperience > 0 && (
                      <>
                        <span>•</span>
                        <span>{teachingExperience} years experience</span>
                      </>
                    )}
                    {currentStatus && (
                      <>
                        <span>•</span>
                        <span>{currentStatus}</span>
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
                  
                  {profileData.teacherProfile?.specializations && profileData.teacherProfile.specializations.length > 0 && (
                    <div className="mt-2 mb-4">
                      <div className="flex flex-wrap gap-2">
                        {profileData.teacherProfile.specializations.map((specialization, index) => (
                          <Badge key={index} variant="outline" className="px-2 py-1">
                            {specialization}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="specializations">Specializations</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
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
                        <Label htmlFor="experience">Teaching Experience (years)</Label>
                        <Input 
                          id="experience" 
                          type="number" 
                          value={teachingExperience || ''} 
                          onChange={(e) => setTeachingExperience(parseInt(e.target.value) || 0)} 
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentStatus">Current Status</Label>
                      <Input 
                        id="currentStatus" 
                        value={currentStatus || ''} 
                        onChange={(e) => setCurrentStatus(e.target.value)} 
                        disabled={!isEditing}
                        placeholder="e.g., Professor at XYZ University, PhD Candidate, etc."
                      />
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
            
            <TabsContent value="education">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Degrees</CardTitle>
                    <CardDescription>Your academic degrees and certifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {isEditing && (
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Add a degree..." 
                            value={newDegree} 
                            onChange={(e) => setNewDegree(e.target.value)}
                          />
                          <Button onClick={addDegree} type="button">Add</Button>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {profileData.teacherProfile?.degrees && profileData.teacherProfile.degrees.length > 0 ? (
                          <ul className="space-y-2">
                            {profileData.teacherProfile.degrees.map((degree, index) => (
                              <li key={index} className="flex items-center justify-between border p-3 rounded-md">
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-5 w-5 text-primary" />
                                  <span>{degree}</span>
                                </div>
                                {isEditing && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeDegree(index)}
                                  >
                                    <Trash className="h-4 w-4 text-red-500" />
                                  </Button>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">No degrees added yet.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Qualifications</CardTitle>
                    <CardDescription>Your professional qualifications and certifications</CardDescription>
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
                        {profileData.teacherProfile?.qualifications && profileData.teacherProfile.qualifications.length > 0 ? (
                          <ul className="space-y-2">
                            {profileData.teacherProfile.qualifications.map((qualification, index) => (
                              <li key={index} className="flex items-center justify-between border p-3 rounded-md">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-5 w-5 text-blue-500" />
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
                          <p className="text-muted-foreground">No qualifications added yet.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your professional accomplishments and awards</CardDescription>
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
                      {profileData.teacherProfile?.achievements && profileData.teacherProfile.achievements.length > 0 ? (
                        <ul className="space-y-2">
                          {profileData.teacherProfile.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-yellow-500" />
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
            
            <TabsContent value="specializations">
              <Card>
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                  <CardDescription>Your specialized areas of expertise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add a specialization..." 
                          value={newSpecialization} 
                          onChange={(e) => setNewSpecialization(e.target.value)}
                        />
                        <Button onClick={addSpecialization} type="button">Add</Button>
                      </div>
                    )}
                    
                    <div>
                      {profileData.teacherProfile?.specializations && profileData.teacherProfile.specializations.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profileData.teacherProfile.specializations.map((specialization, index) => (
                            <div 
                              key={index} 
                              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                              <span>{specialization}</span>
                              {isEditing && (
                                <button 
                                  onClick={() => removeSpecialization(index)}
                                  className="text-red-500 hover:text-red-700 ml-1"
                                >
                                  <Trash className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No specializations added yet.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="research">
              <Card>
                <CardHeader>
                  <CardTitle>Research Interests</CardTitle>
                  <CardDescription>Your areas of academic research and interest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add a research interest..." 
                          value={newResearchInterest} 
                          onChange={(e) => setNewResearchInterest(e.target.value)}
                        />
                        <Button onClick={addResearchInterest} type="button">Add</Button>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {profileData.teacherProfile?.researchInterests && profileData.teacherProfile.researchInterests.length > 0 ? (
                        <ul className="space-y-2">
                          {profileData.teacherProfile.researchInterests.map((interest, index) => (
                            <li key={index} className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-2">
                                <LibraryBig className="h-5 w-5 text-primary" />
                                <span>{interest}</span>
                              </div>
                              {isEditing && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeResearchInterest(index)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No research interests added yet.</p>
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

export default TeacherProfile;
