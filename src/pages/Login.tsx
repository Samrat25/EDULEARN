import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/PageLayout';
import StarField from '@/components/StarField';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password);
      
      if (user) {
        toast({
          title: 'Login successful',
          description: `Welcome back, ${user.name}!`,
        });
        
        // Redirect based on user role
        if (user.role === 'student') {
          navigate('/student/dashboard');
        } else {
          navigate('/teacher/dashboard');
        }
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An error occurred during login',
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
                  <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                  <CardDescription className="text-center">
                    Login to your account to continue
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-primary underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-primary/20 focus:border-primary"
                    />
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
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                  </motion.div>
                  <motion.div 
                    className="text-center text-sm"
                    variants={itemVariants}
                  >
                    Don&apos;t have an account?{' '}
                    <Link
                      to="/register"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Register
                    </Link>
                  </motion.div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Login;
