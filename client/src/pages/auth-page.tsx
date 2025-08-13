import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import { Heart, ArrowRight, Shield, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = loginSchema;
const registerFormSchema = registerSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginFormSchema>;
type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      setLocation("/");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
      setLocation("/");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset functionality will be implemented soon.",
    });
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Heart className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">HealthTracker</h1>
            <p className="text-slate-600 mt-1">Your Digital Health Record</p>
          </div>

          <Card className="shadow-xl border-slate-100">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Reset Password</CardTitle>
              <p className="text-slate-600 text-sm">Enter your email to receive a password reset link</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input 
                  id="reset-email" 
                  type="email" 
                  placeholder="Enter your email" 
                  data-testid="input-reset-email"
                />
              </div>
              <Button 
                onClick={handleForgotPassword} 
                className="w-full" 
                data-testid="button-send-reset"
              >
                Send Reset Link
              </Button>
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsForgotPassword(false)}
                  data-testid="button-back-to-signin"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Form */}
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <Heart className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">HealthTracker</h1>
              <p className="text-slate-600 mt-1">Your Digital Health Record</p>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <Card className="shadow-xl border-slate-100">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                data-testid="input-login-email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your password" 
                                data-testid="input-login-password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="remember" 
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-600"
                            data-testid="checkbox-remember"
                          />
                          <Label htmlFor="remember" className="text-sm text-slate-600">Remember me</Label>
                        </div>
                        <Button 
                          type="button" 
                          variant="link" 
                          className="text-sm text-blue-600 p-0"
                          onClick={() => setIsForgotPassword(true)}
                          data-testid="button-forgot-password"
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                        data-testid="button-login-submit"
                      >
                        {loginMutation.isPending ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-6 text-center">
                    <span className="text-slate-600">Don't have an account? </span>
                    <Button 
                      variant="link" 
                      className="text-blue-600 p-0"
                      onClick={() => setIsLogin(false)}
                      data-testid="button-switch-to-signup"
                    >
                      Sign up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Signup Form */
              <Card className="shadow-xl border-slate-100">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John" 
                                  data-testid="input-signup-firstname"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Doe" 
                                  data-testid="input-signup-lastname"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="john@example.com" 
                                data-testid="input-signup-email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+1 (555) 123-4567" 
                                data-testid="input-signup-phone"
                                {...field}
                                value={field.value ?? ""} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Create a strong password" 
                                data-testid="input-signup-password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm your password" 
                                data-testid="input-signup-confirm-password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                        data-testid="button-signup-submit"
                      >
                        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-6 text-center">
                    <span className="text-slate-600">Already have an account? </span>
                    <Button 
                      variant="link" 
                      className="text-blue-600 p-0"
                      onClick={() => setIsLogin(true)}
                      data-testid="button-switch-to-login"
                    >
                      Sign in
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Hero Section */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-600 to-green-600 text-white p-8">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Take Control of Your Health</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Securely track your vitals, manage medications, and share your health data with healthcare providers.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Activity className="text-white" size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Track Vitals</h3>
                  <p className="text-blue-100 text-sm">Monitor blood pressure, glucose, and weight</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Secure Sharing</h3>
                  <p className="text-blue-100 text-sm">Share data securely with doctors</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Comprehensive Records</h3>
                  <p className="text-blue-100 text-sm">Upload and organize medical documents</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-2 text-blue-100">
              <span>Get started today</span>
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
