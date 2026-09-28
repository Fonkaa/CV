import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // 1. Fetch GitHub User Profile with required User-Agent
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "NextJS-Portfolio-App-Atelier",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (userRes.status === 404) {
      return NextResponse.json({ error: `User "@${username}" not found on GitHub.` }, { status: 404 });
    }

    if (userRes.status === 403) {
      return NextResponse.json(
        { error: "GitHub API rate limit exceeded. Please wait a few moments and try again." },
        { status: 403 }
      );
    }

    if (!userRes.ok) {
      return NextResponse.json({ error: `GitHub error: HTTP ${userRes.status}` }, { status: userRes.status });
    }

    const profile = await userRes.json();

    // 2. Fetch Public Repositories (sorted by recently updated)
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=9`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "NextJS-Portfolio-App-Atelier",
        },
        next: { revalidate: 300 },
      }
    );

    let repos = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    }

    return NextResponse.json({
      profile: {
        login: profile.login,
        name: profile.name || profile.login,
        avatar_url: profile.avatar_url,
        html_url: profile.html_url,
        bio: profile.bio || "Full-stack software engineer active in open source.",
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        location: profile.location || null,
      },
      repos: Array.isArray(repos)
        ? repos.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description || "Public repository with automated version control.",
            html_url: r.html_url,
            language: r.language || "Code",
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
          }))
        : [],
    });
  } catch (error: any) {
    console.error("GitHub API Route Error:", error);
    return NextResponse.json({ error: "Failed to connect to GitHub." }, { status: 500 });
  }
}