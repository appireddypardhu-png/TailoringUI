import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuthenticated }) {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        setLoading(true);

        setError("");

        try {

            const response = await API.post(
                "/auth/login",
                {
                    username,
                    password
                }
            );

            const token = response.data;
            if (token === "Invalid Username or Password") {
                throw (token);
            }

            localStorage.setItem("token", token);

            localStorage.setItem(
                "isAuthenticated",
                "true"
            );

            setIsAuthenticated(true);

            navigate("/customers");

        }
        catch (error) {

            console.log(error);

            setError(
                "Invalid username or password"
            );
        }
        finally {

            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen bg-[#FFF2E1] flex items-center justify-center">

            <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">

                <h1 className="text-4xl font-bold text-[#A79277] mb-10 text-center">
                    Admin Login
                </h1>

                <div className="space-y-6">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full border rounded-2xl px-5 py-4"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            className="w-full border rounded-2xl px-5 py-4 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    {
                        error && (
                            <p className="text-red-500 text-center">
                                {error}
                            </p>
                        )
                    }

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{ cursor: "pointer" }}
                        className="
        w-full
        bg-[#A79277]
        text-white
        py-4
        rounded-2xl
        text-lg
        font-semibold
        flex
        justify-center
        items-center
    "
                    >

                        {
                            loading
                                ?
                                (
                                    <div className="
                w-6
                h-6
                border-4
                border-white
                border-t-transparent
                rounded-full
                animate-spin
            "></div>
                                )
                                :
                                (
                                    "Login"
                                )
                        }

                    </button>

                </div>

            </div>

        </div>
    );
}