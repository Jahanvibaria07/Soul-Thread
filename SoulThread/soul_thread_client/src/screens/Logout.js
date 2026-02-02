import { useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

export default function Logout() {
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem("token");
      setIsLoggedIn(false);
    };
    logout();
  }, []);

  return null;
}
