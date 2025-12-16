# Better Health Tracker

A comprehensive health and fitness tracking mobile application built with React Native and Expo. Track your daily workouts, water intake, weight, and view detailed reports of your progress.

## Features

### Authentication
- **Email/Password** - Traditional email and password authentication
- **Social Login** - Sign in with Google, Apple, Facebook, or Instagram
- **Development Mode** - Quick dev login for faster testing

### Health Tracking
- **Daily Dashboard** - Track your daily activities at a glance
  - Water intake tracking with progress visualization
  - Workout completion tracking
  - Real-time progress indicators
  - Goal achievement notifications

- **Goals Management** - Set and manage your health goals
  - Workout days per week
  - Daily water bottle intake target
  - Current and target weight tracking

- **Reports & Analytics** - View your progress over time
  - Weekly reports with detailed statistics
  - Monthly reports with comprehensive analytics
  - Progress visualization with charts
  - Goals comparison and achievement tracking

## Tech Stack

- **Framework**: React Native with Expo (~51.0.28)
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Gluestack UI with NativeWind
- **Styling**: Tailwind CSS via NativeWind
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Icons**: Lucide React Native, Expo Vector Icons
- **Date Handling**: date-fns
- **Storage**: AsyncStorage, Expo Secure Store

## Project Structure

```
better-health-tracker/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── dashboard.tsx    # Daily tracking dashboard
│   │   ├── goals.tsx        # Goals management
│   │   ├── reports.tsx      # Reports and analytics
│   │   └── _layout.tsx     # Tab navigation layout
│   ├── login.tsx            # Login page
│   ├── signup.tsx           # Sign up page
│   ├── authContext.tsx      # Authentication context
│   └── _layout.tsx          # Root layout
├── components/              # Reusable UI components
│   └── ui/                  # Gluestack UI components
├── services/                # Business logic and API services
│   ├── auth/               # Authentication service
│   └── api/                # Health tracking API (mocked)
├── types/                   # TypeScript type definitions
└── assets/                  # Images, icons, fonts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd better-health-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   - **Web**: Press `w` in the terminal or run `npm run web`
   - **iOS**: Press `i` in the terminal or run `npm run ios` (macOS only)
   - **Android**: Press `a` in the terminal or run `npm run android`
   - **Physical Device**: Scan the QR code with Expo Go app

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run web` - Start web development server
- `npm run ios` - Start iOS simulator (macOS only)
- `npm run android` - Start Android emulator
- `npm test` - Run tests

### Development Features

- **Quick Dev Login**: In development mode, a "Quick Dev Login" button appears on login/signup pages for instant access
- **Mocked API**: All API calls are currently mocked for development. Replace services in `services/api/` and `services/auth/` with real API calls when ready

### Authentication Flow

1. User can sign up with email/password or social providers
2. Session is stored securely using AsyncStorage
3. Protected routes automatically redirect to login if not authenticated
4. User data is managed through AuthContext

### Data Structure

#### Health Goals
- `workoutDaysPerWeek`: Number of workout days per week
- `waterBottlesPerDay`: Target water bottles per day
- `currentWeight`: Current weight in kg
- `targetWeight`: Target weight in kg

#### Daily Tracking
- `waterBottles`: Number of water bottles consumed
- `workoutsCompleted`: Number of workouts completed
- `weight`: Optional weight measurement
- `date`: ISO date string

## API Services (Currently Mocked)

The app uses mocked API services for development. To connect to a real backend:

1. Update `services/auth/index.ts` with your authentication endpoints
2. Update `services/api/index.ts` with your health tracking endpoints
3. Ensure your API returns data matching the TypeScript interfaces in `types/index.ts`

### Mock Data

- Mock data is initialized per user on first access
- Data persists during the session but resets on page refresh (web) or app restart
- In production, replace with persistent backend storage

## Features in Detail

### Dashboard
- Real-time tracking of daily water intake and workouts
- Visual progress bars showing goal completion
- Quick actions to add water or mark workouts complete
- Summary statistics for the day

### Goals
- Set personalized health and fitness goals
- Update goals at any time
- View current goal status

### Reports
- Switch between weekly and monthly views
- Navigate between different time periods
- View comprehensive statistics including:
  - Total workouts and water intake
  - Average weight
  - Goal achievement percentages
  - Progress visualization

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is private and proprietary.

## Notes

- The app is currently using mocked API services for development
- Social login providers (Google, Apple, Facebook, Instagram) are mocked and need to be configured with actual OAuth credentials for production
- All data is stored locally during development and will need backend integration for production use

