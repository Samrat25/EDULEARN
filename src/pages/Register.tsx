import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { PageLayout } from '@/components/PageLayout';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
=======
import HeroBackground from '@/components/HeroBackground';
import HeroAnimatedBackground from '@/components/HeroAnimatedBackground';
>>>>>>> bd9dd6ca418db8db917e7f2677edfaf051bf6274

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Registration failed',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = await register({
        name,
        email,
        password,
        role,
      });

      if (user) {
        // Auto login after registration
        await login(email, password);

        toast({
          title: 'Registration successful',
          description: `Welcome, ${user.name}!`,
        });

        // Redirect based on user role
        if (user.role === 'student') {
          navigate('/student/dashboard');
        } else {
          navigate('/teacher/dashboard');
        }
      } else {
        toast({
          title: 'Registration failed',
          description: 'This email may already be registered',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.7,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 15,
        stiffness: 80
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <PageLayout>
<<<<<<< HEAD
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-background/90">
        {/* Background animation */}
        <div className="absolute inset-0 z-0">
          <StarField />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
        </div>
        
        <motion.div 
          className="container relative z-20 flex min-h-screen items-center justify-center px-4 py-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="w-full max-w-md"
            variants={cardVariants}
          >
            <Card className="border border-primary/20 shadow-xl backdrop-blur-md bg-background/70">
              <CardHeader className="space-y-1">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl font-bold text-center">Join EduLearn</CardTitle>
                  <CardDescription className="text-center">
                    Create your account to start learning
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-primary/20 focus:border-primary"
                    />
                  </motion.div>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-primary/20 focus:border-primary"
                    />
                  </motion.div>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-primary/20 focus:border-primary"
                    />
                  </motion.div>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-primary/20 focus:border-primary"
                    />
                  </motion.div>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label>Account Type</Label>
                    <RadioGroup
                      value={role}
                      onValueChange={(value) => setRole(value as 'student' | 'teacher')}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="font-normal">
                          Student
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher" className="font-normal">
                          Teacher
                        </Label>
                      </div>
                    </RadioGroup>
                  </motion.div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <motion.div 
                    className="w-full"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>
                  </motion.div>
                  <motion.div 
                    className="text-center text-sm"
                    variants={itemVariants}
                  >
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Log in
                    </Link>
                  </motion.div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </motion.div>
=======
      <div className="relative container flex h-screen items-center justify-center px-4 py-8">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <HeroBackground />
          <HeroAnimatedBackground />
        </div>
        
        <Card className="w-full max-w-md relative z-10 bg-background/80 backdrop-blur-md border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as 'student' | 'teacher')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="font-normal">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher" className="font-normal">
                      Teacher
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
>>>>>>> bd9dd6ca418db8db917e7f2677edfaf051bf6274
      </div>
    </PageLayout>
  );
};

export default Register;
