# AdmissionConsultingChatbot-Mobile

> React Native mobile application for FPTU Admission Consulting Chatbot

## 📱 Project Overview

A cross-platform mobile application built with **React Native** and **Expo**, providing admission consulting chatbot functionality for FPTU students and prospects.

### 🛠️ Tech Stack
- **Framework**: React Native 0.81.5
- **Platform**: Expo SDK ~54.0.25
- **Language**: TypeScript 5.9.2
- **Navigation**: Expo Router 6.0.15
- **UI Library**: Lucide React Native
- **State Management**: Zustand 5.0.8
- **Backend**: Supabase 2.75.1
- **Chat**: React Native Gifted Chat 2.8.1

---

## 🚀 Development Environment Setup

### Prerequisites

Before starting development, ensure you have the following installed:

#### 1. **Node.js** (Required: v20.19.4 or higher)
```powershell
# Check current version
node --version

# If version is below 20.19.4, update Node.js
# Download from: https://nodejs.org/en/download/
```

#### 2. **Git**
```powershell
# Check if Git is installed
git --version

# Download from: https://git-scm.com/downloads
```

#### 3. **VS Code** (Recommended)
- Download from: https://code.visualstudio.com/

### Required VS Code Extensions

Install these extensions for optimal development experience:

```
ms-vscode.vscode-react-native
dsznajder.es7-react-js-snippets
expo.vscode-expo-tools
diemasmichiels.emulate
```

---

## 📲 Mobile Development Setup

### Option 1: Android Emulator (Windows)

#### **Install Android Studio**
1. Download [Android Studio](https://developer.android.com/studio)
2. During installation, ensure these components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device

#### **Configure Android SDK**
1. Open Android Studio
2. Go to `File → Settings → Appearance & Behavior → System Settings → Android SDK`
3. Install the latest Android API (API 34 recommended)
4. Note the SDK path (typically: `C:\Users\{username}\AppData\Local\Android\Sdk`)

#### **Set Environment Variables**
```powershell
# Add to system PATH
$env:ANDROID_HOME = "C:\Users\PC\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools"

# Verify setup
adb --version
```

#### **Create Android Virtual Device (AVD)**
1. In Android Studio, open **AVD Manager**
2. Click **"Create Virtual Device"**
3. Select **"Pixel 9"** or **"Pixel 8"**
4. Download and select latest **Android API**
5. Configure:
   - **RAM**: 4GB minimum
   - **Storage**: 8GB minimum
   - **Graphics**: Automatic

### Option 2: Physical Device (Recommended)

#### **Install Expo Go**
- **Android**: [Google Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)

---

## 📁 Project Setup

### 1. **Clone Repository**
```powershell
git clone https://github.com/hiber-neet/AdmissionConsultingChatbot-Mobile.git
cd AdmissionConsultingChatbot-Mobile
```

### 2. **Install Dependencies**
```powershell
# Install all project dependencies
npm install

# Verify Expo CLI is available
npx expo --version
```

### 3. **Install Expo CLI Globally** (Optional)
```powershell
npm install -g @expo/cli
```

---

## 🏃‍♂️ Running the Application

### **Start Development Server**
```powershell
# Standard development server
npm run dev

# Or with Expo CLI
npx expo start

# Clear cache if needed
npx expo start --clear

# Disable telemetry
npm run dev:no-telemetry
```

### **Platform-Specific Commands**

#### **Android Emulator**
1. Start your Android emulator from Android Studio
2. In Expo terminal, press **`a`** to open on Android
3. Or run: `npx expo run:android`

#### **Physical Device**
1. Ensure device and computer are on same Wi-Fi
2. Open **Expo Go** app on your phone
3. Scan the QR code from terminal

#### **Web Browser**
- In Expo terminal, press **`w`** to open in browser
- Or visit: `http://localhost:8081`

---

## 📂 Project Structure

```
AdmissionConsultingChatbot-Mobile/
├── app/                     # App screens (Expo Router)
│   ├── (tabs)/             # Bottom tab navigation
│   │   ├── chat.tsx        # Main chat interface
│   │   ├── index.tsx       # Home screen
│   │   ├── profile.tsx     # User profile
│   │   └── settings.tsx    # App settings
│   ├── admissions.tsx      # Admission information
│   ├── contact.tsx         # Contact page
│   ├── login.tsx           # Authentication
│   ├── programs.tsx        # FPTU programs
│   └── register.tsx        # User registration
├── assets/                 # Static assets
│   └── images/            # Image resources
├── components/            # Reusable UI components
│   ├── common/           # Shared components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── constants/            # App constants
├── contexts/             # React contexts
├── hooks/               # Custom React hooks
├── services/            # External services
│   ├── api.ts          # API endpoints
│   └── supabase.ts     # Supabase client
├── styles/              # Global styles
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

---

## 🔧 Development Commands

```powershell
# Development
npm run dev                    # Start Expo development server
npm run dev:no-telemetry      # Start without analytics

# Building
npm run build:web             # Build for web platform

# Code Quality
npm run lint                  # Run ESLint
npm run typecheck            # Run TypeScript checking

# Expo Commands
npx expo start                # Start development server
npx expo start --clear        # Start with cleared cache
npx expo install              # Install compatible dependencies
npx expo run:android          # Run on Android
npx expo run:ios              # Run on iOS (macOS only)
```

---

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. Worklets Version Mismatch**
```
ERROR: Mismatch between JavaScript part and native part of Worklets
```

**Solution:**
```powershell
npx expo install react-native-worklets@0.5.1
npx expo start --clear
```

#### **2. Node.js Version Issues**
```
npm WARN EBADENGINE Unsupported engine
```

**Solution:** Update to Node.js 20.19.4 or higher

#### **3. Android Emulator Won't Start**
- Use Android Studio AVD Manager instead of command line
- Ensure Hardware Acceleration is enabled
- Try different AVD configurations

#### **4. Metro Bundler Issues**
```powershell
# Clear all caches
npx expo start --clear
npm start -- --reset-cache
```

#### **5. Port Already in Use**
```powershell
# Kill process on port 8081
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

---

## 🌐 Environment Configuration

### **Required Environment Variables**

Create `.env` file in project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
EXPO_PUBLIC_API_URL=your_api_endpoint
```

### **Network Configuration**

Ensure your development machine and mobile device are on the same network:

```powershell
# Check your IP address
ipconfig | findstr IPv4
```

---

## 📱 Testing

### **Device Testing Checklist**

- [ ] Authentication flow works
- [ ] Chat interface responsive
- [ ] Camera permissions (if used)
- [ ] Network connectivity handling
- [ ] Offline mode (if implemented)
- [ ] Push notifications (if implemented)

### **Platform Testing**

- [ ] **Android**: Test on emulator and physical device
- [ ] **iOS**: Test on simulator (macOS required)
- [ ] **Web**: Test in Chrome, Safari, Firefox

---

## 🔐 Dependencies

### **Core Dependencies**
- `expo@~54.0.25` - Expo framework
- `react-native@0.81.5` - React Native
- `react@19.1.0` - React library
- `typescript@~5.9.2` - TypeScript

### **Navigation**
- `expo-router@~6.0.15` - File-based routing
- `@react-navigation/native@^7.1.8` - Navigation library

### **UI & Styling**
- `@expo/vector-icons@^15.0.2` - Icon library
- `lucide-react-native@^0.544.0` - Lucide icons
- `react-native-svg@15.12.1` - SVG support

### **Backend & State**
- `@supabase/supabase-js@^2.75.1` - Backend services
- `zustand@^5.0.8` - State management

### **Chat & Communication**
- `react-native-gifted-chat@^2.8.1` - Chat UI
- `react-native-webview@13.15.0` - Web view component

---

## 👥 Team Development Guidelines

### **Code Standards**
- Use **TypeScript** for all new files
- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Write component documentation

### **Git Workflow**
```powershell
# Feature development
git checkout -b feature/your-feature-name
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### **Branch Naming**
- `feature/feature-name` - New features
- `bugfix/issue-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `chore/task-description` - Maintenance tasks

### **Testing Requirements**
- Test on both Android and iOS
- Verify responsive design on different screen sizes
- Test network error scenarios
- Validate form inputs and error states

---

## 📞 Support & Resources

### **Documentation Links**
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)

### **Troubleshooting Resources**
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
- [React Native Debugging](https://reactnative.dev/docs/debugging)

### **Team Contact**
For development questions or issues, contact the development team through project channels.

---

**Last Updated**: November 22, 2025  
**Project Version**: 1.0.0  
**Minimum Node.js**: 20.19.4  
**Expo SDK**: ~54.0.25
