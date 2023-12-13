"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
export default function Auth() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailSignIn, setEmailSignIn] = useState("");
    const [passwordSignIn, setPasswordSignIn] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("All fields are necessary.");
            return;
        }

        try {
            const resUserExists = await fetch("api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const { user } = await resUserExists.json();

            if (user) {
                setError("User already exists.");
                return;
            }

            const res = await fetch("api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                container.classList.remove('right-panel-active');
                console.log("User Successfully Register")
            } else {
                console.log("User registration failed.");
            }
        } catch (error) {
            console.log("Error during registration: ", error);
        }
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res.error) {
                setError("Invalid User Data");
                return;
            }
            // container.classList.remove('right-panel-active');
            router.replace("dashboard");
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveBtnSignIn = () => {
        container.classList.remove('right-panel-active');
    }
    const handleRemoveBtnSignUp = () => {
        container.classList.add('right-panel-active');
    }
    return (
        <div>
            <div className="body-container">
                <div className="container" id="container">
                    <div>
                        <div className="form-container sign-up-container">
                            <form onSubmit={handleSignUpSubmit} action="#">
                                <h1>Create Account</h1>
                                <input type="text" placeholder="Name" required onChange={(e) => setName(e.target.value)} />
                                <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                                <button className="btn-grad">Sign Up</button>
                            </form>
                        </div>
                        <div className="form-container sign-in-container">
                            <form onSubmit={handleSignInSubmit} action="#">
                                <h1>Sign In</h1>
                                <input type="email" placeholder="Email" required onChange={(e) => setEmailSignIn(e.target.value)} />
                                <input type="password" placeholder="Password" required onChange={(e) => setPasswordSignIn(e.target.value)} />
                                <a href="#">Forgot your password?</a>
                                {error && (
                                    <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                                        {error}
                                    </div>
                                )}
                                <button className="btn-grad">Sign In</button>
                            </form>
                        </div>
                    </div>

                    <div>
                        <div className="overlay-container">
                            <div className="overlay">
                                <div className="overlay-panel overlay-left">
                                    <h1>Welcome Back!</h1>
                                    <p>
                                        Start from where you left
                                    </p>
                                    <p>
                                        Already Have the Account
                                    </p>
                                    <div onClick={handleRemoveBtnSignIn} className="btn-grad" id="signIn">Sign In</div>
                                </div>
                                <div className="overlay-panel overlay-right">
                                    <h1>Hello, Buddy!</h1>
                                    <p>Join Us on a new adventure</p>
                                    <p>
                                        Don't Have the Account
                                    </p>
                                    <div onClick={handleRemoveBtnSignUp} className="btn-grad" id="signUp">Sign Up</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
