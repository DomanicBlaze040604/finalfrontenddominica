import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AuthTest = () => {
  const [authStatus, setAuthStatus] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Failed to parse user:', e);
    }

    setAuthStatus({
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : null,
      hasUser: !!user,
      user: user,
      timestamp: new Date().toISOString(),
    });
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    checkAuth();
  };

  const testApiCall = async () => {
    try {
      const response = await fetch('https://web-production-af44.up.railway.app/api/live-updates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('API Response:', data);
      alert(`API Call ${response.ok ? 'Success' : 'Failed'}: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('API Error:', error);
      alert(`API Error: ${error}`);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Authentication Test</h1>
          <p className="text-muted-foreground mt-1">
            Check your authentication status and debug login issues
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {authStatus && (
              <>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <div className="font-medium">Token Status</div>
                    <div className="text-sm text-muted-foreground">
                      {authStatus.hasToken ? 'Token found in localStorage' : 'No token found'}
                    </div>
                  </div>
                  {authStatus.hasToken ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>

                {authStatus.hasToken && (
                  <div className="p-4 border rounded bg-muted/30">
                    <div className="font-medium mb-2">Token Preview</div>
                    <code className="text-xs break-all">{authStatus.token}</code>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <div className="font-medium">User Data</div>
                    <div className="text-sm text-muted-foreground">
                      {authStatus.hasUser ? 'User data found' : 'No user data'}
                    </div>
                  </div>
                  {authStatus.hasUser ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>

                {authStatus.hasUser && authStatus.user && (
                  <div className="p-4 border rounded bg-muted/30 space-y-2">
                    <div className="font-medium mb-2">User Information</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">Name:</div>
                      <div>{authStatus.user.fullName || authStatus.user.name || 'N/A'}</div>
                      
                      <div className="font-medium">Email:</div>
                      <div>{authStatus.user.email || 'N/A'}</div>
                      
                      <div className="font-medium">Role:</div>
                      <div>
                        <Badge variant={authStatus.user.role === 'admin' ? 'default' : 'secondary'}>
                          {authStatus.user.role || 'N/A'}
                        </Badge>
                      </div>
                      
                      <div className="font-medium">ID:</div>
                      <div className="text-xs">{authStatus.user.id || authStatus.user._id || 'N/A'}</div>
                    </div>
                  </div>
                )}

                <div className="p-4 border rounded">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium">Authentication Required</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {authStatus.hasToken && authStatus.hasUser ? (
                          <>
                            ✅ You are logged in! You should be able to create live updates.
                            <br />
                            If you're still getting authentication errors, the token might be expired.
                          </>
                        ) : (
                          <>
                            ❌ You are NOT logged in. Please go to{' '}
                            <a href="/admin/login" className="text-primary underline">
                              /admin/login
                            </a>{' '}
                            to log in.
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Last checked: {new Date(authStatus.timestamp).toLocaleString()}
                </div>
              </>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={checkAuth} variant="outline">
                Refresh Status
              </Button>
              <Button onClick={testApiCall} variant="outline">
                Test API Call
              </Button>
              <Button onClick={clearAuth} variant="destructive">
                Clear Auth Data
              </Button>
              <Button onClick={() => window.location.href = '/admin/login'} variant="default">
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded">
              <div className="font-medium">1. Check if you're logged in</div>
              <div className="text-sm text-muted-foreground mt-1">
                Look at the "Authentication Status" above. Both token and user data should be present.
              </div>
            </div>

            <div className="p-3 border rounded">
              <div className="font-medium">2. Log in if needed</div>
              <div className="text-sm text-muted-foreground mt-1">
                If no token/user found, click "Go to Login" button above and log in with your credentials.
              </div>
            </div>

            <div className="p-3 border rounded">
              <div className="font-medium">3. Test API connection</div>
              <div className="text-sm text-muted-foreground mt-1">
                Click "Test API Call" to verify your token works with the backend.
              </div>
            </div>

            <div className="p-3 border rounded">
              <div className="font-medium">4. Try creating live update</div>
              <div className="text-sm text-muted-foreground mt-1">
                If all checks pass, go to Live Updates and try creating an update.
              </div>
            </div>

            <div className="p-3 border rounded bg-yellow-50 dark:bg-yellow-950">
              <div className="font-medium">⚠️ If still not working</div>
              <div className="text-sm text-muted-foreground mt-1">
                1. Log out completely<br />
                2. Clear browser cache<br />
                3. Log in again<br />
                4. Try creating live update
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AuthTest;
