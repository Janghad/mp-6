import { NextRequest, NextResponse } from "next/server"

interface GitHubInfo {
    id: number;
    login: string;
    name: string;
    email: string;
    avatar_url: string;
    bio?: string | null;
    html_url: string;
}

interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
}

interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    error?: string;
    error_description?: string;
}

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) { 
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.REDIRECT_URI
            })
        });

        const tokenData: AccessTokenResponse = await tokenResponse.json();

        if(tokenData.error) {
            throw new Error(tokenData.error_description || tokenData.error);
        }

        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${tokenData.access_token}`,
                "User-Agent": "MP-6 GitHub OAUTH",
                "Accept": "application/json"
            }
        });

        const userData: GitHubInfo = await userResponse.json();

        let primaryEmail: string | null = null;
        if (!primaryEmail) {
            const emailsResponse = await fetch("https://api.github.com/user/emails", {
                headers: {
                    "Authorization": `Bearer ${tokenData.access_token}`,
                    "User-Agent": "MP-6 GitHub OAUTH"
                }
            });
            
            const emailsData: GitHubEmail[] = await emailsResponse.json();
            const primaryEmailData = emailsData.find(email => email.primary && email.verified);
            primaryEmail = primaryEmailData ? primaryEmailData.email : null;
        }

        const userInfo = new URL ("/login", request.url);

        userInfo.searchParams.set("id", userData.id.toString());
        userInfo.searchParams.set("login", userData.login);
        if (userData.name) userInfo.searchParams.set("name", userData.name);
        if (primaryEmail) userInfo.searchParams.set("email", primaryEmail);
        userInfo.searchParams.set("avatar_url", userData.avatar_url);
        if (userData.html_url) userInfo.searchParams.set("bio", userData.html_url);

        return NextResponse.redirect(userInfo);
    } catch (error) {
        console.error("OAuth error", error); 
        return NextResponse.redirect(new URL("/?error=oauth_error", request.url));
    }    
}

