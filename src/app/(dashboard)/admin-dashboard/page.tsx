
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, UserCheck, Shield, AlertTriangle, Mail, Lock, Eye, EyeOff, 
  Settings, Activity, BarChart3, FileText, Database, Server,
  UserPlus, UserMinus, Edit, Trash2, Search, Filter, Download,
  RefreshCw, Bell, CheckCircle, XCircle, Clock, TrendingUp,
  LogOut, Save, X, Plus, Minus, MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { useTrackEvent, useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  lastLogin: Date;
  createdAt: Date;
  totalSessions: number;
  totalTests: number;
  profilePicture?: string;
  phoneNumber?: string;
  location?: string;
  lastActivity?: string;
  subscriptionType?: 'free' | 'premium' | 'enterprise';
  warningsCount: number;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalSessions: number;
  totalTests: number;
  systemHealth: number;
  serverUptime: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  details?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  deviceType?: string;
  location?: string;
}

interface PerformanceMetric {
  id: string;
  metric: string;
  value: number;
  timestamp: Date;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'system' | 'user';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
}

interface NotificationSettings {
  emailAlerts: boolean;
  securityAlerts: boolean;
  performanceAlerts: boolean;
  userActivityAlerts: boolean;
  systemMaintenanceAlerts: boolean;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailAlerts: true,
    securityAlerts: true,
    performanceAlerts: true,
    userActivityAlerts: false,
    systemMaintenanceAlerts: true
  });
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    displayName: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    phoneNumber: '',
    location: ''
  });
  const [bulkActions, setBulkActions] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser] = useAuthState(auth);
  const { trackFeatureUsed, trackAdminAction } = useTrackEvent();
  
  // Track page views automatically
  useGoogleAnalytics();

  // Admin credentials
  const ADMIN_EMAIL = 'abbasmujtaba125@gmail.com';
  const ADMIN_PASSWORD = 'mujtaba110';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminCreds = sessionStorage.getItem('admin-authed');
      if (adminCreds === 'true') {
        setIsAuthenticated(true);
        loadDashboardData();
      }
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin-authed', 'true');
        setIsAuthenticated(true);
        await loadDashboardData();
        
        // Track admin login with enhanced GTags
        trackAdminAction('admin_login_success', 'dashboard', 'Admin Dashboard Authentication');
        trackFeatureUsed('Admin Dashboard Access', 'Admin Authentication');
        
        toast({
          title: 'Authentication Successful',
          description: 'Welcome to the Admin Dashboard!',
        });
      } else {
        toast({
          title: 'Authentication Failed',
          description: 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during authentication.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-authed');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const loadDashboardData = async () => {
    try {
      // Load system statistics
      const stats: SystemStats = {
        totalUsers: 1257,
        activeUsers: 892,
        totalTeachers: 42,
        totalStudents: 1215,
        totalSessions: 15647,
        totalTests: 3429,
        systemHealth: 98.5,
        serverUptime: '15 days, 8 hours'
      };
      setSystemStats(stats);

      // Load users data with enhanced information
      const userData: User[] = [
        {
          id: '1',
          email: 'student1@example.com',
          displayName: 'John Doe',
          role: 'student',
          status: 'active',
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          totalSessions: 45,
          totalTests: 12,
          profilePicture: '/avatars/student1.jpg',
          phoneNumber: '+1 (555) 123-4567',
          location: 'New York, USA',
          lastActivity: 'Completed Math Quiz',
          subscriptionType: 'premium',
          warningsCount: 0
        },
        {
          id: '2',
          email: 'teacher1@example.com',
          displayName: 'Jane Smith',
          role: 'teacher',
          status: 'active',
          lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          totalSessions: 89,
          totalTests: 156,
          profilePicture: '/avatars/teacher1.jpg',
          phoneNumber: '+1 (555) 987-6543',
          location: 'California, USA',
          lastActivity: 'Created Science Test',
          subscriptionType: 'enterprise',
          warningsCount: 0
        },
        {
          id: '3',
          email: 'student2@example.com',
          displayName: 'Bob Johnson',
          role: 'student',
          status: 'suspended',
          lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          totalSessions: 23,
          totalTests: 8,
          profilePicture: '/avatars/student2.jpg',
          phoneNumber: '+1 (555) 456-7890',
          location: 'Texas, USA',
          lastActivity: 'Failed to follow guidelines',
          subscriptionType: 'free',
          warningsCount: 3
        },
        {
          id: '4',
          email: 'admin2@example.com',
          displayName: 'Sarah Wilson',
          role: 'admin',
          status: 'active',
          lastLogin: new Date(Date.now() - 30 * 60 * 1000),
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          totalSessions: 234,
          totalTests: 45,
          profilePicture: '/avatars/admin2.jpg',
          phoneNumber: '+1 (555) 111-2222',
          location: 'Florida, USA',
          lastActivity: 'System Maintenance',
          subscriptionType: 'enterprise',
          warningsCount: 0
        },
        {
          id: '5',
          email: 'teacher2@example.com',
          displayName: 'Michael Brown',
          role: 'teacher',
          status: 'pending',
          lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          totalSessions: 5,
          totalTests: 2,
          profilePicture: '/avatars/teacher2.jpg',
          phoneNumber: '+1 (555) 333-4444',
          location: 'Illinois, USA',
          lastActivity: 'Account verification pending',
          subscriptionType: 'free',
          warningsCount: 0
        }
      ];
      setUsers(userData);

      // Load activity logs with enhanced information
      const logs: ActivityLog[] = [
        {
          id: '1',
          userId: '1',
          userName: 'John Doe',
          action: 'Login',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          details: 'Successful login from mobile device',
          severity: 'low',
          ipAddress: '192.168.1.100',
          deviceType: 'Mobile',
          location: 'New York, USA'
        },
        {
          id: '2',
          userId: '2',
          userName: 'Jane Smith',
          action: 'Test Created',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          details: 'Created mathematics test for Grade 10',
          severity: 'low',
          ipAddress: '192.168.1.101',
          deviceType: 'Desktop',
          location: 'California, USA'
        },
        {
          id: '3',
          userId: '3',
          userName: 'Bob Johnson',
          action: 'Account Suspended',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          details: 'Suspended due to policy violation',
          severity: 'high',
          ipAddress: '192.168.1.102',
          deviceType: 'Desktop',
          location: 'Texas, USA'
        },
        {
          id: '4',
          userId: '4',
          userName: 'Sarah Wilson',
          action: 'System Backup',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          details: 'Initiated daily system backup',
          severity: 'medium',
          ipAddress: '192.168.1.103',
          deviceType: 'Desktop',
          location: 'Florida, USA'
        },
        {
          id: '5',
          userId: '1',
          userName: 'John Doe',
          action: 'Failed Login Attempt',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          details: 'Multiple failed password attempts detected',
          severity: 'medium',
          ipAddress: '192.168.1.100',
          deviceType: 'Mobile',
          location: 'New York, USA'
        },
        {
          id: '6',
          userId: '2',
          userName: 'Jane Smith',
          action: 'Bulk User Export',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          details: 'Exported student data for analysis',
          severity: 'medium',
          ipAddress: '192.168.1.101',
          deviceType: 'Desktop',
          location: 'California, USA'
        }
      ];
      setActivityLogs(logs);

      // Load performance metrics
      const metrics: PerformanceMetric[] = [
        {
          id: '1',
          metric: 'Response Time',
          value: 245,
          timestamp: new Date(),
          threshold: 500,
          status: 'good'
        },
        {
          id: '2',
          metric: 'CPU Usage',
          value: 78,
          timestamp: new Date(),
          threshold: 80,
          status: 'warning'
        },
        {
          id: '3',
          metric: 'Memory Usage',
          value: 65,
          timestamp: new Date(),
          threshold: 85,
          status: 'good'
        },
        {
          id: '4',
          metric: 'Disk Usage',
          value: 42,
          timestamp: new Date(),
          threshold: 90,
          status: 'good'
        },
        {
          id: '5',
          metric: 'Error Rate',
          value: 0.2,
          timestamp: new Date(),
          threshold: 1.0,
          status: 'good'
        }
      ];
      setPerformanceMetrics(metrics);

      // Load system alerts
      const alerts: SystemAlert[] = [
        {
          id: '1',
          type: 'security',
          title: 'Multiple Failed Login Attempts',
          message: 'User John Doe has 3 failed login attempts in the last hour.',
          severity: 'medium',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
          actionRequired: true
        },
        {
          id: '2',
          type: 'performance',
          title: 'High CPU Usage Detected',
          message: 'Server CPU usage has exceeded 75% for the past 10 minutes.',
          severity: 'medium',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: false,
          actionRequired: false
        },
        {
          id: '3',
          type: 'system',
          title: 'Scheduled Maintenance',
          message: 'System maintenance is scheduled for tonight at 2:00 AM EST.',
          severity: 'low',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
          actionRequired: false
        },
        {
          id: '4',
          type: 'user',
          title: 'New Teacher Registration',
          message: 'Michael Brown has registered as a teacher and is pending approval.',
          severity: 'low',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: false,
          actionRequired: true
        }
      ];
      setSystemAlerts(alerts);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Using sample data.',
        variant: 'destructive',
      });
    }
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete' | 'edit' | 'resetPassword' | 'sendMessage') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'suspend':
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'suspended' as const } : u
        ));
        addActivityLog({
          id: Date.now().toString(),
          userId: 'admin',
          userName: 'Admin',
          action: 'User Suspended',
          timestamp: new Date(),
          details: `Suspended user: ${user.displayName}`,
          severity: 'medium',
          ipAddress: 'Admin Panel',
          deviceType: 'Web',
          location: 'Admin Dashboard'
        });
        toast({
          title: 'User Suspended',
          description: `${user.displayName} has been suspended.`,
        });
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'active' as const } : u
        ));
        addActivityLog({
          id: Date.now().toString(),
          userId: 'admin',
          userName: 'Admin',
          action: 'User Activated',
          timestamp: new Date(),
          details: `Activated user: ${user.displayName}`,
          severity: 'low',
          ipAddress: 'Admin Panel',
          deviceType: 'Web',
          location: 'Admin Dashboard'
        });
        toast({
          title: 'User Activated',
          description: `${user.displayName} has been activated.`,
        });
        break;
      case 'delete':
        setUsers(prev => prev.filter(u => u.id !== userId));
        addActivityLog({
          id: Date.now().toString(),
          userId: 'admin',
          userName: 'Admin',
          action: 'User Deleted',
          timestamp: new Date(),
          details: `Deleted user: ${user.displayName}`,
          severity: 'high',
          ipAddress: 'Admin Panel',
          deviceType: 'Web',
          location: 'Admin Dashboard'
        });
        toast({
          title: 'User Deleted',
          description: `${user.displayName} has been deleted.`,
          variant: 'destructive',
        });
        break;
      case 'edit':
        setSelectedUser(user);
        setIsUserDialogOpen(true);
        break;
      case 'resetPassword':
        addActivityLog({
          id: Date.now().toString(),
          userId: 'admin',
          userName: 'Admin',
          action: 'Password Reset',
          timestamp: new Date(),
          details: `Reset password for user: ${user.displayName}`,
          severity: 'medium',
          ipAddress: 'Admin Panel',
          deviceType: 'Web',
          location: 'Admin Dashboard'
        });
        toast({
          title: 'Password Reset',
          description: `Password reset email sent to ${user.email}.`,
        });
        break;
      case 'sendMessage':
        toast({
          title: 'Message Sent',
          description: `Notification sent to ${user.displayName}.`,
        });
        break;
    }
  };

  const addActivityLog = (log: ActivityLog) => {
    setActivityLogs(prev => [log, ...prev]);
  };

  const handleAddUser = () => {
    if (!newUser.email || !newUser.displayName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
      status: 'pending',
      lastLogin: new Date(),
      createdAt: new Date(),
      totalSessions: 0,
      totalTests: 0,
      phoneNumber: newUser.phoneNumber,
      location: newUser.location,
      subscriptionType: 'free',
      warningsCount: 0
    };

    setUsers(prev => [user, ...prev]);
    addActivityLog({
      id: Date.now().toString(),
      userId: 'admin',
      userName: 'Admin',
      action: 'User Created',
      timestamp: new Date(),
      details: `Created new user: ${user.displayName} (${user.role})`,
      severity: 'low',
      ipAddress: 'Admin Panel',
      deviceType: 'Web',
      location: 'Admin Dashboard'
    });

    setNewUser({
      email: '',
      displayName: '',
      role: 'student',
      phoneNumber: '',
      location: ''
    });
    setIsAddUserDialogOpen(false);
    
    toast({
      title: 'User Added',
      description: `${user.displayName} has been added successfully.`,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No Users Selected',
        description: 'Please select users to perform bulk actions.',
        variant: 'destructive',
      });
      return;
    }

    switch (action) {
      case 'suspend':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'suspended' as const } : u
        ));
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' as const } : u
        ));
        break;
      case 'delete':
        setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        break;
    }

    addActivityLog({
      id: Date.now().toString(),
      userId: 'admin',
      userName: 'Admin',
      action: `Bulk ${action}`,
      timestamp: new Date(),
      details: `Performed ${action} on ${selectedUsers.length} users`,
      severity: 'medium',
      ipAddress: 'Admin Panel',
      deviceType: 'Web',
      location: 'Admin Dashboard'
    });

    setSelectedUsers([]);
    toast({
      title: 'Bulk Action Completed',
      description: `${action} action performed on ${selectedUsers.length} users.`,
    });
  };

  const markAlertAsRead = (alertId: string) => {
    setSystemAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
    toast({
      title: 'Settings Updated',
      description: 'Notification preferences have been saved.',
    });
  };

  const refreshData = async () => {
    toast({
      title: 'Refreshing Data',
      description: 'Updating dashboard information...',
    });
    await loadDashboardData();
    toast({
      title: 'Data Refreshed',
      description: 'Dashboard information has been updated.',
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ users, activityLogs, systemStats }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Data Exported',
      description: 'Dashboard data has been exported successfully.',
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'free': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'system': return <Server className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const unreadAlertsCount = systemAlerts.filter(alert => !alert.isRead).length;
  const criticalAlertsCount = systemAlerts.filter(alert => alert.severity === 'critical').length;

  if (!isAuthenticated) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>Please sign in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-xs text-center text-muted-foreground mt-4">
              Authorized access only. All activities are logged.
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header with Alerts */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-headline text-3xl md:text-4xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, system settings, and monitor platform activity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* System Alerts Indicator */}
          {unreadAlertsCount > 0 && (
            <div className="relative">
              <Button variant="outline" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
                {unreadAlertsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                    {unreadAlertsCount}
                  </Badge>
                )}
              </Button>
            </div>
          )}
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlertsCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical System Alerts</AlertTitle>
          <AlertDescription>
            You have {criticalAlertsCount} critical alert{criticalAlertsCount > 1 ? 's' : ''} requiring immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Administrator Access</AlertTitle>
        <AlertDescription>
          You have full administrative privileges. All actions are logged and monitored for security purposes.
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts
            {unreadAlertsCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs ml-1">
                {unreadAlertsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          {systemStats && (
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{systemStats.activeUsers}</span> active users
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">Teaching professionals</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Learning enthusiasts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.systemHealth}%</div>
                  <Progress value={systemStats.systemHealth} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>Recent platform usage statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Sessions</span>
                  <span className="text-2xl font-bold">{systemStats?.totalSessions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tests Generated</span>
                  <span className="text-2xl font-bold">{systemStats?.totalTests.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Server Uptime</span>
                  <span className="text-lg font-semibold text-green-600">{systemStats?.serverUptime}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-3">
                    {activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center space-x-3 p-2 rounded-lg border">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.userName}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* User Management Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">User Management</h2>
              <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedUsers.length} selected
                  </Badge>
                  <Select onValueChange={handleBulkAction}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Bulk actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activate">Activate Selected</SelectItem>
                      <SelectItem value="suspend">Suspend Selected</SelectItem>
                      <SelectItem value="delete">Delete Selected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account with specified role and details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-email">Email *</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="user@example.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Display Name *</Label>
                      <Input
                        id="new-name"
                        placeholder="Full Name"
                        value={newUser.displayName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, displayName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value: 'student' | 'teacher' | 'admin') => setNewUser(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-phone">Phone Number</Label>
                      <Input
                        id="new-phone"
                        placeholder="+1 (555) 123-4567"
                        value={newUser.phoneNumber}
                        onChange={(e) => setNewUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-location">Location</Label>
                      <Input
                        id="new-location"
                        placeholder="City, Country"
                        value={newUser.location}
                        onChange={(e) => setNewUser(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>
                      Create User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="teacher">Teachers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Warnings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(prev => [...prev, user.id]);
                            } else {
                              setSelectedUsers(prev => prev.filter(id => id !== user.id));
                            }
                          }}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            {user.location && (
                              <div className="text-xs text-muted-foreground">{user.location}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSubscriptionColor(user.subscriptionType || 'free')}>
                          {(user.subscriptionType || 'free').charAt(0).toUpperCase() + (user.subscriptionType || 'free').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="text-muted-foreground">
                          {formatDistanceToNow(user.lastLogin, { addSuffix: true })}
                        </div>
                        {user.lastActivity && (
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {user.lastActivity}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.totalSessions} sessions</div>
                          <div className="text-xs text-muted-foreground">{user.totalTests} tests</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.warningsCount > 0 ? (
                          <Badge variant="destructive">
                            {user.warningsCount} warning{user.warningsCount > 1 ? 's' : ''}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'edit')}
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              title="Suspend user"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'activate')}
                              title="Activate user"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'resetPassword')}
                            title="Reset password"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'sendMessage')}
                            title="Send message"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'delete')}
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your filters.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">System Alerts</h2>
              <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setSystemAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))}
                disabled={unreadAlertsCount === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                onClick={() => setSystemAlerts([])}
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Alert Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemAlerts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{unreadAlertsCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <Shield className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalAlertsCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Required</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {systemAlerts.filter(alert => alert.actionRequired).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {systemAlerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium">No alerts</h3>
                      <p className="text-sm">All systems are running smoothly.</p>
                    </div>
                  ) : (
                    systemAlerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className={`flex items-start space-x-4 p-4 border rounded-lg transition-all hover:shadow-md ${
                          alert.isRead ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-500'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          alert.type === 'security' ? 'bg-red-100 text-red-600' :
                          alert.type === 'performance' ? 'bg-yellow-100 text-yellow-600' :
                          alert.type === 'system' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-sm font-medium ${
                                  alert.isRead ? 'text-muted-foreground' : 'text-foreground'
                                }`}>
                                  {alert.title}
                                </h4>
                                <Badge className={getSeverityColor(alert.severity)}>
                                  {alert.severity}
                                </Badge>
                                {alert.actionRequired && (
                                  <Badge variant="destructive" className="text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm ${
                                alert.isRead ? 'text-muted-foreground' : 'text-muted-foreground'
                              }`}>
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {alert.type}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                              {!alert.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAlertAsRead(alert.id)}
                                  title="Mark as read"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dismissAlert(alert.id)}
                                title="Dismiss alert"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Activity Logs</h2>
              <p className="text-muted-foreground">Monitor user activities and system events</p>
            </div>
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-md transition-all">
                      <div className={`p-2 rounded-full ${
                        log.severity === 'critical' ? 'bg-red-100 text-red-600' :
                        log.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                        log.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{log.action}</p>
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                          <span>User: {log.userName} (ID: {log.userId})</span>
                          {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                          {log.deviceType && <span>Device: {log.deviceType}</span>}
                        </div>
                        {log.location && (
                          <div className="text-xs text-muted-foreground mb-1">
                            Location: {log.location}
                          </div>
                        )}
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">System Information</h2>
            <p className="text-muted-foreground">Monitor system health and performance metrics</p>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {performanceMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                  <div className={`h-3 w-3 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.value}{metric.metric.includes('Usage') ? '%' : metric.metric.includes('Time') ? 'ms' : metric.metric.includes('Rate') ? '%' : ''}
                  </div>
                  <Progress 
                    value={metric.metric.includes('Usage') ? metric.value : (metric.value / metric.threshold) * 100} 
                    className={`mt-2 ${
                      metric.status === 'good' ? 'text-green-600' :
                      metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Threshold: {metric.threshold}{metric.metric.includes('Usage') ? '%' : metric.metric.includes('Time') ? 'ms' : ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Server Status</CardTitle>
                <CardDescription>Current server health metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">System Health</span>
                  <div className="flex items-center gap-2">
                    <Progress value={systemStats?.systemHealth || 0} className="w-20" />
                    <span className="text-sm font-bold">{systemStats?.systemHealth}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm font-semibold text-green-600">{systemStats?.serverUptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Active Connections</span>
                  <span className="text-sm font-bold">{systemStats?.activeUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Load Average</span>
                  <Badge className="bg-green-100 text-green-800">Normal</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Network Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Stable
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Status</CardTitle>
                <CardDescription>Database performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Connection Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Records</span>
                  <span className="text-sm font-bold">{(systemStats?.totalSessions || 0) + (systemStats?.totalTests || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Query Performance</span>
                  <span className="text-sm font-semibold text-green-600">Optimal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                  <span className="text-sm font-bold">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Storage Used</span>
                  <div className="flex items-center gap-2">
                    <Progress value={72} className="w-16" />
                    <span className="text-sm">72%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Actions */}
          <Card>
            <CardHeader>
              <CardTitle>System Actions</CardTitle>
              <CardDescription>Quick system maintenance and monitoring actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <RefreshCw className="h-6 w-6 mb-2" />
                  <span className="font-medium">Restart Services</span>
                  <span className="text-xs text-muted-foreground">Restart application services</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <Shield className="h-6 w-6 mb-2" />
                  <span className="font-medium">Security Scan</span>
                  <span className="text-xs text-muted-foreground">Run security vulnerability scan</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span className="font-medium">Performance Test</span>
                  <span className="text-xs text-muted-foreground">Run performance benchmarks</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <Server className="h-6 w-6 mb-2" />
                  <span className="font-medium">Health Check</span>
                  <span className="text-xs text-muted-foreground">Full system health verification</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">System Settings</h2>
            <p className="text-muted-foreground">Configure system preferences and security settings</p>
          </div>

          <div className="grid gap-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure alert and notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Alerts</p>
                    <p className="text-sm text-muted-foreground">Receive system alerts via email</p>
                  </div>
                  <Button
                    variant={notificationSettings.emailAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateNotificationSettings({ emailAlerts: !notificationSettings.emailAlerts })}
                  >
                    {notificationSettings.emailAlerts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">Immediate notifications for security events</p>
                  </div>
                  <Button
                    variant={notificationSettings.securityAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateNotificationSettings({ securityAlerts: !notificationSettings.securityAlerts })}
                  >
                    {notificationSettings.securityAlerts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Performance Alerts</p>
                    <p className="text-sm text-muted-foreground">Notifications for performance issues</p>
                  </div>
                  <Button
                    variant={notificationSettings.performanceAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateNotificationSettings({ performanceAlerts: !notificationSettings.performanceAlerts })}
                  >
                    {notificationSettings.performanceAlerts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">User Activity Alerts</p>
                    <p className="text-sm text-muted-foreground">Notifications for user registration and activities</p>
                  </div>
                  <Button
                    variant={notificationSettings.userActivityAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateNotificationSettings({ userActivityAlerts: !notificationSettings.userActivityAlerts })}
                  >
                    {notificationSettings.userActivityAlerts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Alerts</p>
                    <p className="text-sm text-muted-foreground">Notifications for scheduled maintenance</p>
                  </div>
                  <Button
                    variant={notificationSettings.systemMaintenanceAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateNotificationSettings({ systemMaintenanceAlerts: !notificationSettings.systemMaintenanceAlerts })}
                  >
                    {notificationSettings.systemMaintenanceAlerts ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Activity Logging</p>
                    <p className="text-sm text-muted-foreground">Log all user and admin activities</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Failed Login Protection</p>
                    <p className="text-sm text-muted-foreground">Block IP addresses after failed attempts</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rate Limiting</p>
                    <p className="text-sm text-muted-foreground">Prevent API abuse and spam</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
              </CardContent>
            </Card>

            {/* System Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>General system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="max-users">Maximum Concurrent Users</Label>
                    <Input id="max-users" type="number" value="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" value="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="log-retention">Log Retention (days)</Label>
                    <Input id="log-retention" type="number" value="90" />
                  </div>
                </div>
                <Button className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>

            {/* System Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
                <CardDescription>System maintenance and cleanup options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Database className="h-6 w-6 mb-2" />
                    <span className="font-medium">Database Cleanup</span>
                    <span className="text-xs text-muted-foreground">Remove old logs and optimize database</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <RefreshCw className="h-6 w-6 mb-2" />
                    <span className="font-medium">Cache Refresh</span>
                    <span className="text-xs text-muted-foreground">Clear and rebuild application cache</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <Download className="h-6 w-6 mb-2" />
                    <span className="font-medium">Backup Data</span>
                    <span className="text-xs text-muted-foreground">Create a full system backup</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="font-medium">Generate Report</span>
                    <span className="text-xs text-muted-foreground">Create detailed system report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admin Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Account</CardTitle>
                <CardDescription>Current admin account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    A
                  </div>
                  <div>
                    <h3 className="font-medium">Admin User</h3>
                    <p className="text-sm text-muted-foreground">{ADMIN_EMAIL}</p>
                    <p className="text-xs text-muted-foreground">Last login: {formatDistanceToNow(new Date(), { addSuffix: true })}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Edit Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Modify user information and permissions
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Display Name</Label>
                  <Input id="edit-name" value={selectedUser.displayName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" value={selectedUser.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: 'User Updated',
                description: 'User information has been updated successfully.',
              });
              setIsUserDialogOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
