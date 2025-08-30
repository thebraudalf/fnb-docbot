# Appwrite Authentication Setup

## Prerequisites
1. Create an Appwrite account at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create a new project in your Appwrite console

## Configuration Steps

### 1. Update Appwrite Configuration
Edit `src/config/appwrite.js` and replace `YOUR_PROJECT_ID` with your actual Appwrite project ID:

```javascript
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_ACTUAL_PROJECT_ID'); // Replace this
```

### 2. Configure Web Platform
In your Appwrite console:
1. Go to **Settings** → **Platforms**
2. Add a new **Web App** platform
3. Set the hostname to: `localhost` (for development)
4. For production, add your actual domain

### 3. Enable Authentication
In your Appwrite console:
1. Go to **Auth** → **Settings**
2. Enable **Email/Password** authentication method
3. Configure any additional settings as needed

## Features Implemented

### ✅ Authentication Components
- **Login Component**: Email/password authentication with validation
- **Register Component**: Account creation with password confirmation
- **AuthPage**: Combined login/register interface with smooth transitions
- **ProtectedRoute**: Wrapper component that redirects unauthenticated users

### ✅ State Management
- **AuthContext**: Centralized authentication state management
- **useAuth Hook**: Easy access to auth state and functions across components
- Automatic session persistence and restoration

### ✅ User Experience
- Loading states during authentication
- Error handling with user-friendly messages
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Welcome message with user name in header
- Logout functionality

### ✅ Security Features
- Password validation (minimum 8 characters)
- Password confirmation matching
- Secure session management via Appwrite
- Automatic token refresh

## Usage

Once configured, the app will:
1. Show login/register screen for unauthenticated users
2. Automatically redirect to main app after successful authentication
3. Persist login sessions across browser refreshes
4. Display user name in header with logout option

## Development
```bash
npm run dev
```

The authentication flow is now fully integrated with your DocBot application!
