import Link from "next/link";

export default function Home() {

  const gitHubURL = new URL ("https://github.com/login/oauth/authorize")

  gitHubURL.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID || "");
  gitHubURL.searchParams.set("redirect_uri", process.env.REDIRECT_URI || "");
  gitHubURL.searchParams.set("scope", "read:user user:email");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100">
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">MP-6 GitHub OAUTH</h1>
      <p className="mb-8 text-center text-gray-600">
        Click the button below to sign in!
      </p>
      <div className="flex justify-center">
        <Link
          href={gitHubURL.toString()}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
        >
          Sign in with GitHub
        </Link>
      </div>
    </div>
  </main>
);
}