import { octokit } from "./githubClient";
import { reviewCode } from "../agent/reviewAgent";
import { splitDiff } from "../analysis/diffParser";

export async function processPR(pr: any) {
  const owner = pr.base.repo.owner.login;
  const repo = pr.base.repo.name;
  const pull_number = pr.number;

  console.log("OWNER:", owner);
  console.log("REPO:", repo);
  console.log("PR:", pull_number);

  // PR Diff
  const { data } = await octokit.pulls.get({
    owner: owner.login,
    repo,
    pull_number,
    mediaType: {
      format: "diff",
    },
  });

  const diff = data as unknown as string;

  // Divide in chunks
  const chunks = splitDiff(diff);

  let finalReview = "";

  for (const chunk of chunks) {
    const review = await reviewCode(chunk);
    finalReview += review + "\n\n";
  }

  // PR Comment
  await octokit.issues.createComment({
    owner: owner.login,
    repo,
    issue_number: pull_number,
    body: finalReview,
  });
}