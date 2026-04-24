import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest = () => {
  const { user, userProfile, loading, signIn, signOut } = useAuth();

  const handleTestLogin = async () => {
    try {
      // Test with the demo credentials from the database migration
      const result = await signIn('buyer@example.com', 'password123');
      console.log('Login result:', result);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleTestLogout = async () => {
    try {
      const result = await signOut();
      console.log('Logout result:', result);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Authentication Test</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
        {user && (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </>
        )}
        {userProfile && (
          <>
            <p><strong>Name:</strong> {userProfile.full_name}</p>
            <p><strong>Role:</strong> {userProfile.role}</p>
            <p><strong>Phone:</strong> {userProfile.phone || 'Not set'}</p>
          </>
        )}
      </div>

      <div className="space-x-2">
        {!user ? (
          <button
            onClick={handleTestLogin}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Test Login (buyer@example.com)
          </button>
        ) : (
          <button
            onClick={handleTestLogout}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            Test Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthTest; 