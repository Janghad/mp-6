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
    const authCode = request.nextUrl.searchParams.get("code");

    if (!authCode) { //if there is an error getting user info send back to homepage
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        const tokenResponse = await fetch ("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Accept": "application/json", // Accepts header to get JSON response (idea taken from CS391 S1)
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                authCode,
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
                "User-Agent": "MP-6 GitHub OAUTH" 
            }
        });

        const userData: GitHubInfo = await userResponse.json();

        const response = NextResponse.redirect(new URL("/", request.url));

        const userForCookie: GitHubInfo = {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        email: userData.email,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url
        };

        response.cookies.set('github_user', JSON.stringify(userForCookie), {
        httpOnly: true,  
        maxAge: 60 * 60, 
        path: '/',       
        });
        return response;
    } catch (error) {
        console.error("OAUTG error", error);

        return NextResponse.redirect(new URL("/?error=oauth_error", request.url));
    }
}
