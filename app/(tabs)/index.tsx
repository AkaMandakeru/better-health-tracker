import { Redirect } from 'expo-router';
import { useSession } from '../authContext';

export default function IndexScreen() {
  const { session, isLoading } = useSession();

  // Show loading state while checking session
  if (isLoading) {
    return null;
  }

  // Redirect based on authentication status
  if (session) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/login" />;
}
