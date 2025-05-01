import { notFound } from "next/navigation"; //Learnt in CS391 S1
import Link from "next/link";
import Image from "next/image";

type PageProps = { //needed for vercel to pass deployment
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export default function ProfilePage({ searchParams }: PageProps){
    if (!searchParams.login || !searchParams.avatar_url) {
        notFound();
    }

    const userData = {
        id: searchParams.id,
        login: searchParams.login as string,
        name: searchParams.name as string || "",
        email: searchParams.email as string || "",
        avatar_url: searchParams.avatar_url as string,
        html_url: searchParams.bio as string || "",
    };

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


