import { octokit } from "./githubClient";
import { reviewCode } from "../agent/reviewAgent";
import { parsePatch } from "../analysis/patchParser";

type ReviewCommentParams = {
  owner: string;
  repo: string;
  pull_number: number;
  path: string;
  line: number;
  body: string;
  commit_id: string;
};

export async function processPR(pr: any) {
  const owner = pr.base.repo.owner.login;
  const repo = pr.base.repo.name;
  const pull_number = pr.number;
  const commit_id = pr.head.sha;

  console.log("OWNER:", owner);
  console.log("REPO:", repo);
  console.log("PR:", pull_number);
  console.log("COMMIT ID:", commit_id);

  // PR Diff
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number,
    
  });

  for (const file of files) {
    console.log("FILE:", file.filename);

    if (!file.patch) continue;

    const changes = parsePatch(file.patch);

    for (const change of changes) {
      const review = await reviewCode(change.code);

      if (!review) continue;

      const comment: ReviewCommentParams = {
        owner,
        repo,
        pull_number,
        path: file.filename,
        line: change.line,
        body: review,
        commit_id,
      };

      await octokit.pulls.createReviewComment(comment);
    }    
  }
}