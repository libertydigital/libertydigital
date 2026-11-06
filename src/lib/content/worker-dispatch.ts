/** Best-effort GitHub Actions trigger. Only import from server actions. */
const endpoint = "https://api.github.com/repos/libertydigital/libertydigital/actions/workflows/content-video-worker.yml/dispatches";

type Result = { dispatched: true } | { dispatched: false; reason: string };
type Options = { token?: string; request?: typeof fetch };

export async function dispatchContentVideoWorker(options: Options = {}): Promise<Result> {
  const token = options.token ?? process.env.CONTENT_VIDEO_GITHUB_TOKEN;
  if (!token?.trim()) return { dispatched: false, reason: "GitHub dispatch token not configured" };
  try {
    const response = await (options.request ?? fetch)(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "main" }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (response.status !== 204) return { dispatched: false, reason: `GitHub dispatch HTTP ${response.status}` };
    return { dispatched: true };
  } catch {
    return { dispatched: false, reason: "GitHub dispatch request failed" };
  }
}
