import { Link } from "react-router";

// /register-success.tsx
export default function RegisterSuccess() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-6 rounded-md shadow-md text-center">
                <h2 className="text-2xl font-semibold text-blue-500 mb-4">Please confirm your email</h2>
                <p className="text-gray-600">We have sent a confirmation link to your email address.</p>
                <p className="text-gray-600 mt-2">Click the link in your inbox to activate your account.</p>
                <p className="text-gray-600 mt-2">If you have confirmed your email <Link
                    to={'/login'}
                    style={{ color: "oklch(62.3% 0.214 259.815)", textDecoration: "underline" }}
                >
                    Sign in here
                </Link></p>
            </div>
        </div>
    );
}
