# Troubleshooting Guide for React Native App

## Quick Recovery Steps

### 1. Clean Dependencies
```bash
# Delete node_modules and lock files
rm -rf node_modules
rm package-lock.json # or yarn.lock or bun.lock

# Reinstall dependencies
npm install # or yarn install or bun install

# Clear Metro cache
npx react-native start --reset-cache
# or for Expo
npx expo start --clear
```

### 2. Common TypeScript Errors

#### Type Comparison Errors
- **Error**: `This comparison appears to be unintentional because the types have no overlap`
- **Fix**: Check array length comparisons, use proper type guards
```typescript
// Bad
if (segments.length === 1 && segments.length === 0) // This will never be true

// Good
if (segments.length > 0) {
  // Handle non-empty array
} else {
  // Handle empty array
}
```

#### Missing Export Errors
- **Error**: `Module has no exported member`
- **Fix**: Check imports match exports
```typescript
// In mocks/crews.ts
export const mockCrews = [...];
export const mockMatches = [...]; // Make sure this exists

// In store/matchStore.ts
import { mockMatches } from '@/mocks/crews'; // Import what exists
```

### 3. Error Boundary Implementation

Error boundaries are already implemented in this app:
- `components/ErrorBoundary.tsx` - Catches React errors
- `utils/errorReporting.ts` - Logs errors for debugging
- `utils/logger.ts` - General logging utility

### 4. Common Code Pitfalls to Avoid

#### Null/Undefined Access
```typescript
// Bad
const user = getUser();
console.log(user.name); // Might crash if user is null

// Good
const user = getUser();
if (user) {
  console.log(user.name);
}
// or
console.log(user?.name);
```

#### Async Error Handling
```typescript
// Bad
const fetchData = async () => {
  const response = await api.getData(); // Might throw
  setData(response);
};

// Good
const fetchData = async () => {
  try {
    const response = await api.getData();
    setData(response);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    setError('Failed to load data');
  }
};
```

#### State Updates
```typescript
// Bad
const [items, setItems] = useState([]);
const addItem = (item) => {
  items.push(item); // Mutating state directly
  setItems(items);
};

// Good
const addItem = (item) => {
  setItems(prev => [...prev, item]);
};
```

### 5. Build and Runtime Error Debugging

#### Reading Error Messages
1. **TypeScript Errors**: Check file path and line number
2. **Runtime Errors**: Check browser console or Metro logs
3. **Build Errors**: Check terminal output during build

#### Essential Commands
```bash
# Start development server
npx expo start

# Clear all caches
npx expo start --clear

# Check for TypeScript errors
npx tsc --noEmit

# Run tests
npm test

# Build for production
npx expo build
```

### 6. Environment Setup

#### Required Environment Variables
Create `.env` file if needed:
```
EXPO_PUBLIC_API_URL=your_api_url
```

#### Package.json Scripts
Ensure these scripts exist:
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest"
  }
}
```

### 7. Getting Community Help

When asking for help, provide:
1. **Error message** (full stack trace)
2. **Code snippet** where error occurs
3. **Steps to reproduce**
4. **Environment info** (OS, Node version, package versions)
5. **What you've tried** already

#### Where to Get Help
- GitHub Issues (for specific packages)
- Stack Overflow (tag with react-native, expo)
- Discord/Slack communities
- Reddit r/reactnative

### 8. Prevention Strategies

#### Code Quality
- Use TypeScript strict mode
- Add ESLint and Prettier
- Write tests for critical functions
- Use error boundaries
- Implement proper error handling

#### Development Workflow
- Test on multiple platforms (iOS, Android, Web)
- Use version control (git)
- Keep dependencies updated
- Monitor bundle size
- Use performance profiling tools

### 9. Emergency Recovery

If app is completely broken:
1. Revert to last working commit
2. Check git history for recent changes
3. Disable problematic features temporarily
4. Use error boundaries to isolate issues
5. Implement feature flags for gradual rollout

### 10. Monitoring and Logging

This app includes:
- Error reporting (`utils/errorReporting.ts`)
- Performance monitoring (`utils/performance.ts`)
- Analytics tracking (`utils/analytics.ts`)
- Offline handling (`utils/offline.ts`)

Use these tools to catch issues before they affect users.