import { router, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Import global CSS
import "./global.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/services/userService";
import { IUser } from "@/types/types";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <AuthenticatedLayout />
    </AuthProvider>
  );
}

const AuthenticatedLayout = () => {
  const { setAuth, setUserData } = useAuth();

  const updateUser = async (userId: string) => {
    const res = await getUserData(userId)
    if(res.success)
      setUserData?.(res.data)
    console.log("Got user data: ", res.data)
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log("SESSION USER: ", session.user);
        setAuth?.(session.user as IUser);
        updateUser(session.user.id)
        router.replace("/home")
      }else{
        console.log("UNAUTHENTICATED")
        router.replace("/welcome")
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return <Stack screenOptions={{ headerShown: false }}/>;
};
