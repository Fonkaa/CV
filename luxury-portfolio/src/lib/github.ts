export async function getGithubProjects(username: string) {
  if (!username) return [];
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      next: { revalidate: 3600 } // ISR cache for 1 hour
    });
    if (!res.ok) return [];
    const repos = await res.json();
    return repos.map((r: any) => ({
      id: `gh-${r.id}`,
      title: r.name,
      tagline: r.language || "Open Source",
      description: r.description || "Public GitHub repository with automated continuous deployment.",
      tags: [r.language || "Code", `★ ${r.stargazers_count}`],
      githubUrl: r.html_url,
      liveUrl: r.homepage || undefined,
      featured: false
    }));
  } catch (err) {
    console.error("Failed to fetch GitHub repos", err);
    return [];
  }
}