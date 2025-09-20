// Mock Supabase client for local development
// This simulates Supabase functionality without requiring a real backend

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface AuthResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
  error: Error | null;
}

// Test users that match the database test_user_credentials table
// These will automatically get developer profiles when signing up
const TEST_USERS: Array<{ email: string; password: string; name: string; id: string }> = [
  {
    id: 'test-user-1',
    email: 'developer@test.com',
    password: 'password123',
    name: 'Test Developer'
  },
  {
    id: 'test-user-2',
    email: 'admin@test.com',
    password: 'admin123',
    name: 'Test Admin'
  },
  {
    id: 'test-user-3',
    email: 'user@test.com',
    password: 'user123',
    name: 'Test User'
  }
];

class MockSupabaseAuth {
  private currentUser: User | null = null;
  private currentSession: Session | null = null;

  constructor() {
    // Check if there's a stored session
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem('mock-supabase-session');
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession);
          this.currentSession = parsed;
          this.currentUser = parsed.user;
        } catch (e) {
          // Invalid stored session, ignore
        }
      }
    }
  }

  async signUp({ email, password, options }: { 
    email: string; 
    password: string; 
    options?: { data?: { name?: string } } 
  }): Promise<AuthResponse> {
    console.log('🧪 [MOCK] Sign up attempt:', { email, name: options?.data?.name });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = TEST_USERS.find(u => u.email === email);
    if (existingUser) {
      return {
        data: { user: null, session: null },
        error: new Error('User already registered')
      };
    }

    // Create new user
    const newUser: User = {
      id: `mock-user-${Date.now()}`,
      email,
      name: options?.data?.name || 'New User',
      created_at: new Date().toISOString()
    };

    const session: Session = {
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
      user: newUser
    };

    // Store session
    this.currentUser = newUser;
    this.currentSession = session;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock-supabase-session', JSON.stringify(session));
    }

    console.log('✅ [MOCK] User created successfully:', newUser);

    return {
      data: { user: newUser, session },
      error: null
    };
  }

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
    console.log('🧪 [MOCK] Sign in attempt:', { email });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check credentials against test users
    const testUser = TEST_USERS.find(u => u.email === email && u.password === password);
    
    if (!testUser) {
      return {
        data: { user: null, session: null },
        error: new Error('Invalid login credentials')
      };
    }

    const user: User = {
      id: testUser.id,
      email: testUser.email,
      name: testUser.name,
      created_at: new Date().toISOString()
    };

    const session: Session = {
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`,
      user
    };

    // Store session
    this.currentUser = user;
    this.currentSession = session;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock-supabase-session', JSON.stringify(session));
    }

    console.log('✅ [MOCK] User signed in successfully:', user);

    return {
      data: { user, session },
      error: null
    };
  }

  async signOut(): Promise<{ error: Error | null }> {
    console.log('🧪 [MOCK] Sign out');
    
    this.currentUser = null;
    this.currentSession = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock-supabase-session');
    }

    return { error: null };
  }

  async getUser(): Promise<{ data: { user: User | null }; error: Error | null }> {
    return {
      data: { user: this.currentUser },
      error: null
    };
  }

  async getSession(): Promise<{ data: { session: Session | null }; error: Error | null }> {
    return {
      data: { session: this.currentSession },
      error: null
    };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    // For mock purposes, we don't need to implement this
    return {
      data: { subscription: { unsubscribe: () => {} } }
    };
  }
}

class MockSupabaseClient {
  auth: MockSupabaseAuth;
  __mock: boolean = true; // Flag to identify this as a mock client

  constructor() {
    this.auth = new MockSupabaseAuth();
  }

  from(table: string) {
    // Mock database operations - return empty results for now
    return {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        }),
        limit: () => Promise.resolve({ data: [], error: null })
      }),
      insert: (data: any) => Promise.resolve({ data, error: null }),
      update: (data: any) => ({
        eq: () => Promise.resolve({ data, error: null })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null })
      })
    };
  }
}

export function createMockClient() {
  return new MockSupabaseClient();
}

// Export test credentials for documentation
export const TEST_CREDENTIALS = TEST_USERS.map(u => ({
  email: u.email,
  password: u.password,
  name: u.name
}));