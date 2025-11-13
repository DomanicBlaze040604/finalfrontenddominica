import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  console.log('🔐 ========== AdminLogin Component Mounted ==========');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  
  console.log('🔐 Initial credentials state:', credentials);

  const loginMutation = useMutation({
    mutationFn: (creds: typeof credentials) => {
      console.log('🔐 Login mutation called with:', creds);
      return authService.login(creds);
    },
    onSuccess: (data) => {
      console.log('🔐 Login successful:', data);
      
      // Double-check localStorage
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      console.log('🔐 Final verification - Token:', savedToken ? 'EXISTS' : 'MISSING');
      console.log('🔐 Final verification - User:', savedUser ? 'EXISTS' : 'MISSING');
      
      if (!savedToken || !savedUser) {
        console.error('❌ CRITICAL: Token or user not saved to localStorage!');
        toast({
          title: "Login Error",
          description: "Failed to save login data. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Check user role from response
      const userRole = data?.data?.user?.role || 'user';
      const canAccessAdmin = userRole === 'admin' || userRole === 'editor';
      
      console.log('🔐 User role:', userRole);
      console.log('🔐 Can access admin:', canAccessAdmin);
      
      toast({
        title: "Welcome back!",
        description: "Redirecting to dashboard...",
      });
      
      // Use window.location.href for hard navigation
      console.log('🔐 Redirecting to:', canAccessAdmin ? '/admin' : '/');
      setTimeout(() => {
        window.location.href = canAccessAdmin ? '/admin' : '/';
      }, 300);
    },
    onError: (error: unknown) => {
      console.error('🔐 Login error:', error);
      
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔐 ========== FORM SUBMIT TRIGGERED ==========');
    console.log('🔐 Form submitted with credentials:', { 
      email: credentials.email, 
      passwordLength: credentials.password.length,
      hasEmail: !!credentials.email,
      hasPassword: !!credentials.password
    });
    
    // Validate credentials
    if (!credentials.email || !credentials.password) {
      console.log('❌ Validation failed: Missing email or password');
      toast({
        title: "Validation Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(credentials.email)) {
      console.log('❌ Validation failed: Invalid email format');
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    console.log('✅ Validation passed, calling mutation...');
    console.log('🔐 About to call loginMutation.mutate()');
    
    try {
      loginMutation.mutate(credentials);
      console.log('🔐 loginMutation.mutate() called successfully');
    } catch (error) {
      console.error('❌ Error calling mutation:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`🔐 Input changed: ${field} = ${value.substring(0, 3)}...`);
    setCredentials(prev => {
      const newCreds = { ...prev, [field]: value };
      console.log('🔐 New credentials state:', { email: newCreds.email, passwordLength: newCreds.password.length });
      return newCreds;
    });
  };

  // Check if already authenticated and redirect
  const isAuth = authService.isAuthenticated();
  if (isAuth && !loginMutation.isPending) {
    console.log('🔐 Already authenticated, redirecting to admin');
    return <Navigate to="/admin" replace />;
  }
  
  console.log('🔐 AdminLogin rendered');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-xl mb-4 shadow-lg">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Access your Dominica News account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={credentials.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>



              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loginMutation.isPending}
                onClick={(e) => {
                  console.log('🔐 ========== BUTTON CLICKED ==========');
                  console.log('🔐 Button type:', e.currentTarget.type);
                  console.log('🔐 Form will submit...');
                }}
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
                  Register here
                </Link>
              </p>

              <Button
                variant="link"
                onClick={() => navigate("/")}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Website
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2024 Dominica News. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;