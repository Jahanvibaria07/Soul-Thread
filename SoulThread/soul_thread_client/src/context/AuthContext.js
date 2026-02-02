

// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { createContext, useEffect, useState } from "react";


// // export const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [token, setToken] = useState(null);

// //   useEffect(() => {
// //       checkToken();
// //     }, []);

// //   const checkToken = async () => {
// //     try {
// //       const token = await AsyncStorage.getItem("token");
// //       setIsLoggedIn(!!token);
// //     } catch (err) {
// //       console.log("Auth error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }


// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createContext, useEffect, useState } from "react";
// import { clearAuthToken, setAuthToken } from "../services/api";

// export const AuthContext = createContext({
//   isLoggedIn: false,
//   loading: true,
//   setLoggedIn: () => {},
// });

// export function AuthProvider({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // tracks login
//   const [loading, setLoading] = useState(true);        // tracks auth check
//   // const [token, setToken] = useState(null);             // store token globally if needed

//   // Run once on mount to check if token exists
//   // useEffect(() => {
//   //   const checkToken = async () => {
//   //     try {
//   //       const storedToken = await AsyncStorage.getItem("token");

//   //       if (storedToken) {
//   //         setAuthToken(storedToken);
//   //         setIsLoggedIn(true);
//   //         setToken(storedToken);
//   //       } else {
//   //         setIsLoggedIn(false);
//   //         setToken(null);
//   //       }
//   //     } catch (err) {
//   //       console.log("AuthProvider error:", err.message);
//   //       setIsLoggedIn(false);
//   //       setToken(null);
//   //     } finally {
//   //       setLoading(false); // auth check done
//   //     }
//   //   };

//   //   checkToken();
//   // }, []);
//   useEffect(() => {
//     const checkToken = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (token) setIsLoggedIn(true);
//       setLoading(false);
//     };
//     checkToken();
//   }, []);

//   // Optional helper to log in and store token
//   const login = async (newToken) => {
//     try {
//       await AsyncStorage.setItem("token", newToken);
//       setAuthToken(newToken);
//       setToken(newToken);
//       setIsLoggedIn(true);
//     } catch (err) {
//       console.log("Login error:", err.message);
//     }
//   };

//   // Optional helper to log out and remove token
//   const logout = async () => {
//     try {
//       await AsyncStorage.removeItem("token");
//       clearAuthToken(); 
//       setToken(null);
//       setIsLoggedIn(false);
//     } catch (err) {
//       console.log("Logout error:", err.message);
//     }
//   };

//   // return (
//   //   <AuthContext.Provider
//   //     value={{
//   //       isLoggedIn,
//   //       setIsLoggedIn,
//   //       loading,
//   //       token,
//   //       login,
//   //       logout,
//   //     }}
//   //   >
//   //     {children}
//   //   </AuthContext.Provider>
//   // );
//   return (
//     <AuthContext.Provider value={{ isLoggedIn, loading, setLoggedIn: setIsLoggedIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createContext, useEffect, useState } from "react";
// import { setAuthToken, clearAuthToken } from "../services/api";

// export const AuthContext = createContext({
//   isLoggedIn: false,
//   loading: true,
//   // setLoggedIn: () => {},
//   login: async () => {},
//   logout: async () => {},
// });

// export function AuthProvider({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Check token on mount
//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//           setAuthToken(token); // set token for API
//           setIsLoggedIn(true);
//         }
//       } catch (err) {
//         console.log("AuthProvider checkToken error:", err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkToken();
//   }, []);

//   const login = async (token) => {
//     try {
//       await AsyncStorage.setItem("token", token);
//       setAuthToken(token);
//       setIsLoggedIn(true);
//     } catch (err) {
//       console.log("Login error:", err.message);
//     }
//   };

//   const logout = async () => {
//     try {
//       await AsyncStorage.removeItem("token");
//       clearAuthToken();
//       setIsLoggedIn(false);
//     } catch (err) {
//       console.log("Logout error:", err.message);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ isLoggedIn, loading, setLoggedIn: setIsLoggedIn, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }


import { createContext, useState } from "react";
import { setAuthToken, clearAuthToken } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user,setUser] = useState(null);



  const login = (userData) => {
       setUser(userData);
  };

  const logout = () => {
    setUser(null)
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

