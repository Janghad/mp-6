"use client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function ProfilePage() {
    const [userData, setUserData] = useState({
        id: "",
        login: "",
        name: "",
        email: "",
        avatar_url: "",
        html_url: "",
        });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = new URL(window.location.href);
        const login = url.searchParams.get("login");
        const avatar_url = url.searchParams.get("avatar_url");

        if(!login || !avatar_url) {
            redirect("/");
        }

        setUserData({
            id: url.searchParams.get("id") || "",
            login: login,
            name: url.searchParams.get("name") || "",
            email: url.searchParams.get("email") || "",
            avatar_url: avatar_url,
            html_url: url.searchParams.get("bio") || "",
        });

        setLoading(false);
    }, []);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">MP-6 GitHub OAUTH</h1>
                <p className="mb-8 text-center text-gray-600">
                    Welcome {userData.name || userData.login}!
                </p>
                <div className="flex justify-center mb-4">
                    <Image
                        src={userData.avatar_url}
                        alt={userData.login}
                        width={60}
                        height={60}
                        className="rounded-full"
                    />
                </div>
                <div className="mb-4 text-center">
                    <Link href={userData.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View Profile
                    </Link>
                </div>
            </div>
        </main>
    );
}
