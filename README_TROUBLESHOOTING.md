# React Native App Troubleshooting Guide

This comprehensive guide will help you diagnose, fix, and prevent common issues in your React Native app.

## 🚨 Emergency Quick Fixes

### App Won't Start
```bash
# 1. Clear Metro cache
npx react-native start --reset-cache
# or for Expo
expo start -c

# 2. Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. For iOS (if using React Native CLI)
cd ios && pod install && cd ..

# 4. Reset simulator/emulator
# iOS: Device > Erase All Content and Settings
# Android: Wipe data in AVD Manager
```

### App Crashes on Launch
```bash
# 1. Check for TypeScript errors
npx tsc --noEmit

# 2. Check for syntax errors
npm run lint

# 3. Clear all app data
# Use the troubleshooting panel in the app or manually clear AsyncStorage
```

## 📋 Systematic Troubleshooting

### 1. Dependency Issues

**Common Symptoms:**
- Build failures
- Module not found errors
- Version conflicts
- Metro bundler errors

**Solutions:**
```bash
# Step 1: Clean installation
rm -rf node_modules
rm package-lock.json  # or yarn.lock
npm install

# Step 2: Clear caches
npm start -- --reset-cache
# For Expo:
expo start -c

# Step 3: Check for peer dependency issues
npm ls
# Look for UNMET PEER DEPENDENCY warnings

# Step 4: Update outdated packages
npm outdated
npm update

# Step 5: For React Native CLI projects
cd ios && pod install && cd ..
npx react-native clean
```

**Prevention:**
- Pin exact versions in package.json for critical dependencies
- Use `npm ci` instead of `npm install` in CI/CD
- Regularly update dependencies in controlled batches
- Test on multiple platforms after updates

### 2. Runtime Errors

**Common Patterns:**
```javascript
// ❌ Bad: Accessing undefined properties
const name = user.profile.name;

// ✅ Good: Safe property access
const name = user?.profile?.name ?? 'Unknown';

// ❌ Bad: Unhandled async operations
const fetchData = async () => {
  const response = await api.getData();
  setData(response.data);
};

// ✅ Good: Proper error handling
const fetchData = async () => {
  try {
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    logger.error('Failed to fetch data', { error: error.message });
    setError('Failed to load data');
  }
};

// ❌ Bad: Array access without checking
const firstItem = items[0].name;

// ✅ Good: Safe array access
const firstItem = items.length > 0 ? items[0]?.name : null;
```

### 3. State Management Issues

**Zustand Store Debugging:**
```javascript
// Add logging to your stores
const useStore = create((set, get) => ({
  // ... your state
  
  // Add debug action
  _debug: () => {
    console.log('Current state:', get());
  }
}));

// Use in components
const debug = useStore(state => state._debug);
debug(); // Log current state
```

**Common Store Issues:**
- Store not initialized before use
- Circular dependencies between stores
- State mutations instead of immutable updates
- Missing error handling in async actions

### 4. Navigation Issues

**Common Problems:**
```javascript
// ❌ Bad: Navigation without checking if navigator is ready
router.push('/some-route');

// ✅ Good: Check navigation state
const navigationState = useRootNavigationState();
if (navigationState?.key) {
  router.push('/some-route');
}

// ❌ Bad: Accessing route params without validation
const { id } = useLocalSearchParams();
const data = await fetchData(id);

// ✅ Good: Validate params
const { id } = useLocalSearchParams();
if (!id || typeof id !== 'string') {
  // Handle invalid params
  return;
}
const data = await fetchData(id);
```

## 🛠 Built-in Debugging Tools

### 1. Error Boundaries
The app includes error boundaries that catch and display errors gracefully:

```javascript
// Wrap components that might fail
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

### 2. Logging System
Use the built-in logger for debugging:

```javascript
import { logger } from '@/utils/logger';

// Different log levels
logger.debug('Debug info', { userId: '123' });
logger.info('User action', { action: 'login' });
logger.warn('Potential issue', { memoryUsage: '85%' });
logger.error('Error occurred', { error: error.message });
```

### 3. Error Reporting
Automatic error capture and reporting:

```javascript
import { errorReporting } from '@/utils/errorReporting';

// Manual error reporting
errorReporting.captureError(error, 'error', {
  context: 'user_action',
  userId: user.id
});

// Capture messages
errorReporting.captureMessage('User performed risky action', 'warning');
```

### 4. Troubleshooting Panel
Access the built-in troubleshooting panel:
- Add a debug button in development builds
- Run diagnostics to check system health
- Export diagnostic data for support
- Perform recovery actions

## 🔍 Platform-Specific Debugging

### iOS Debugging
```bash
# View iOS logs
npx react-native log-ios

# Debug in Xcode
open ios/YourApp.xcworkspace

# Common iOS issues:
# - Code signing problems
# - Missing permissions in Info.plist
# - Native module linking issues
```

### Android Debugging
```bash
# View Android logs
npx react-native log-android
# or
adb logcat

# Debug in Android Studio
# Open android/ folder in Android Studio

# Common Android issues:
# - Gradle build failures
# - Missing permissions in AndroidManifest.xml
# - ProGuard/R8 optimization issues
```

### Web Debugging
```bash
# Start web development
npm run start-web-dev

# Common web issues:
# - React Native components not supported on web
# - Missing web-specific polyfills
# - CSS/styling differences
```

## 📊 Performance Debugging

### Memory Leaks
```javascript
// Check for common memory leak patterns
useEffect(() => {
  const subscription = someService.subscribe();
  
  // ✅ Always cleanup
  return () => {
    subscription.unsubscribe();
  };
}, []);

// ✅ Cleanup timers
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

### Performance Monitoring
```javascript
// Use the performance utility
import { performanceMonitor } from '@/utils/performance';

const MyComponent = () => {
  useEffect(() => {
    performanceMonitor.startTimer('component_mount');
    
    return () => {
      performanceMonitor.endTimer('component_mount');
    };
  }, []);
};
```

## 🤝 Getting Community Help

### Before Asking for Help
1. **Run diagnostics** using the built-in troubleshooting panel
2. **Check logs** for specific error messages
3. **Try recovery actions** to fix common issues
4. **Search existing issues** in the project repository

### What to Include in Bug Reports
```markdown
## Bug Report

### Environment
- Platform: iOS/Android/Web
- Device: [Device model]
- App Version: [Version]
- React Native Version: [Version]

### Steps to Reproduce
1. Step one
2. Step two
3. Step three

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Error Messages
```
[Paste error messages here]
```

### Diagnostic Data
[Export from troubleshooting panel]

### Screenshots/Videos
[If applicable]
```

### Where to Get Help
1. **GitHub Issues** - For bugs and feature requests
2. **Stack Overflow** - For general React Native questions
3. **Discord/Slack Communities** - For real-time help
4. **React Native Documentation** - For official guidance

## 🔧 Development Best Practices

### Code Quality
```bash
# Set up pre-commit hooks
npm install --save-dev husky lint-staged

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### Testing Strategy
```javascript
// Unit tests for utilities
import { troubleshootingUtils } from '@/utils/troubleshooting';

test('should detect storage issues', async () => {
  const diagnostics = await troubleshootingUtils.runDiagnostics();
  expect(diagnostics.storageHealth).toBeDefined();
});

// Integration tests for stores
import { useAuthStore } from '@/store/authStore';

test('should handle sign in errors gracefully', async () => {
  const { signIn } = useAuthStore.getState();
  
  await expect(signIn(null)).rejects.toThrow();
  
  const { error } = useAuthStore.getState();
  expect(error).toBeTruthy();
});
```

### Monitoring in Production
```javascript
// Set up crash reporting
import crashlytics from '@react-native-firebase/crashlytics';

// Log non-fatal errors
crashlytics().recordError(error);

// Set user context
crashlytics().setUserId(user.id);

// Custom logging
crashlytics().log('User performed action');
```

## 📱 Device-Specific Issues

### Low-End Devices
- Reduce image sizes and quality
- Implement lazy loading
- Use FlatList for large lists
- Minimize animations

### Different Screen Sizes
- Test on various screen sizes
- Use responsive design patterns
- Handle safe areas properly
- Test landscape orientation

### Network Conditions
- Implement offline support
- Add retry mechanisms
- Show loading states
- Cache critical data

## 🚀 Deployment Troubleshooting

### Build Issues
```bash
# Clean builds
# iOS
cd ios && xcodebuild clean && cd ..

# Android
cd android && ./gradlew clean && cd ..

# Check for environment issues
npx react-native doctor
```

### Store Submission
- Test on physical devices
- Check app permissions
- Validate app icons and metadata
- Test in release mode
- Review store guidelines

Remember: Most issues can be prevented with proper error handling, testing, and monitoring. The built-in troubleshooting tools in this app will help you diagnose and fix issues quickly.