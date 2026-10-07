import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext(null);

const API_BASE_URL = "http://localhost:3000/api";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --------------------------------
    // دریافت token
    // --------------------------------

    function getToken() {
        return localStorage.getItem("token");
    }


    // --------------------------------
    // دریافت اطلاعات کاربر
    // --------------------------------

    async function loadUser() {

        const token = getToken();

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/me`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {

                localStorage.removeItem("token");

                setUser(null);

                return;
            }

            const data = await response.json();

            setUser(data.customer);

        }
        catch (error) {

            console.error(
                "Load user error:",
                error
            );

            setUser(null);
        }
        finally {

            setLoading(false);
        }
    }


    // --------------------------------
    // Login
    // --------------------------------

    async function login(phone, password) {

        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    phone,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "خطا در ورود"
            );
        }

        // ذخیره JWT
        localStorage.setItem(
            "token",
            data.token
        );

        // ذخیره اطلاعات کاربر
        setUser(data.customer);

        return data;
    }


    // --------------------------------
    // Logout
    // --------------------------------

    function logout() {

        localStorage.removeItem("token");

        setUser(null);
    }


    // --------------------------------
    // بررسی Login هنگام شروع برنامه
    // --------------------------------

    useEffect(() => {

        loadUser();

    }, []);


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                loadUser,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


// --------------------------------
// Hook
// --------------------------------

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth باید داخل AuthProvider استفاده شود."
        );
    }

    return context;
}