import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { loginWithGoogle, loginWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await loginWithEmail(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError("Failed to log in. Please check your credentials.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to log in with Google");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await resetPassword(formData.email);
      alert("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address");
      } else {
        setError("Failed to send password reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-900 relative overflow-hidden">
        {/* Professional Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center shadow-trading-lg">
                <ArrowLeftRight className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">BarterX</h1>
                <p className="text-primary-300">
                  Professional Trading Platform
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Trade with
              <br />
              <span className="text-accent-400">Confidence</span>
            </h2>

            <p className="text-xl text-primary-300 mb-8 leading-relaxed">
              Join thousands of verified traders in our secure, professional
              marketplace. Exchange items safely with built-in protection and
              seamless transactions.
            </p>

            <div className="space-y-4 text-primary-300">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Verified user authentication</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Secure transaction processing</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>24/7 trading support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center shadow-trading">
                <ArrowLeftRight className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-900">BarterX</h1>
                <p className="text-sm text-primary-500">Trading Platform</p>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary-900 mb-2">
              {showForgotPassword ? "Reset Password" : "Welcome Back"}
            </h2>
            <p className="text-primary-600">
              {showForgotPassword
                ? "Enter your email to receive reset instructions"
                : "Sign in to your trading account"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {!showForgotPassword ? (
            <>
              {/* Google Sign In */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full border-2 border-primary-200 hover:border-primary-300 text-primary-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 mb-6 bg-white hover:bg-primary-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>
                  {loading ? "Signing in..." : "Continue with Google"}
                </span>
              </motion.button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-primary-500">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-primary-900 placeholder-primary-400 transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-primary-900 placeholder-primary-400 transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg shadow-trading transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-primary-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-accent-600 hover:text-accent-700 font-medium transition-colors"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            /* Password Reset Form */
            <form onSubmit={handlePasswordReset} className="space-y-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors mb-6"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">Back to Sign In</span>
              </button>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-primary-900 placeholder-primary-400 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg shadow-trading transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Email"
                )}
              </motion.button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-primary-500">
              Secure • Professional • Trusted by thousands
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
