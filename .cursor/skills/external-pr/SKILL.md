---
name: external-pr
description: >-
  Review an incoming EthereumJS pull request (usually a fork): judge the bug,
  the fix layer, tests, workflow-run safety, and whether to continue; post
  that report on the PR and locally, with contributor notes kept local.
  Use when the user asks to review, triage, or continue an external or
  contributor PR, approve its workflow runs, or decide whether to merge it.
---

# External pull request

Incoming pull request review. Our own branches follow [git.mdc](../../rules/git.mdc) directly. This skill does not merge and does not write a decline comment.

Labels and test bars: [git.mdc](../../rules/git.mdc). Trust tiers: [security.mdc](../../rules/security.mdc). CI: [ci.mdc](../../rules/ci.mdc).

## Gates

| Phase | When | Then |
| --- | --- | --- |
| **1 — Report** | Any review or triage ask | Post the public comment, give the local report, **stop** |
| **2 — Integrate** | Explicit **GO** in this session ("go", "continue", "integrate") | Do the four steps below, then a status report, **stop** |

"Look at", "review", or "is this worth it" is phase 1 only. Do not label, push, approve workflows, or merge in phase 1. A GO does not include merge. The human merges, or supplies a decline sentence and asks to post it.

## Phase 1 — Report

Read the pull request (`gh pr view`, diff, reviews, comments), the call sites of the changed code, and whether the head is a fork with maintainer edit rights (`maintainerCanModify`). Reproduce a behavior claim locally when that is cheap. Do not start a full execution-spec download unless the human asked.

Judge the diff, not the author's story. Prefer production code over the pull request text when they disagree.

### Signals

Each core check is **Green**, **Yellow**, or **Red**. Use those words in both reports. Green means sound. Yellow means continue only with the named follow-up. Red means stop, or a manual step before any GO.

| Check | Green | Yellow | Red |
| --- | --- | --- | --- |
| Problem is real | Reproduced or clearly true | Plausible, not reproduced | Claim is wrong |
| Worth fixing | Real user or consensus impact | Narrow, still worth a small patch | Noise, or behavior we must keep |
| Right place | Earliest shared function that owns the rule | Works, but a wider or earlier fix is better | Wrong layer (would break other callers, or misses them) |
| Clean, tested, practices | Matches the codebase; the test fails before the fix | Sound, with a named gap (docs, one case) | Wrong, untested, or against our practices |
| Workflow approval | `pull_request` only, no workflow or dependency edits, no secret access | Needs a closer look at one job | `pull_request_target`, workflow edits, install scripts, or a payload |
| Continue | GO can proceed | GO only after the named follow-up or a manual step | Do not integrate |

**Right place** means two things: as general as the problem allows, and as early as possible in the call chain so later callers inherit it. Do not widen past the problem (do not "fix" a shared encoder for one caller's rule).

**Manual step first** when a check is Red or when the trust tier needs a human pass the agent should not skip (signature, hash, or consensus behavior that was not reproduced). Name the step. Do not start phase 2.

### Work on top

If the patch needs more than a trivial note, outline what phase 2 would change, in a few lines, not a patch. State whether we can push: fork and `maintainerCanModify` true means yes. Otherwise say the author has to apply it. Do not open a second pull request.

### Reports

Same sections, same order, same signals. The GitHub comment and the local report match. The local report adds one section the comment never has.

Header, first line, model name you are actually running and today's date:

`**PR analysis done by [model], YYYY-MM-DD:**`

Then, in order:

1. **Recommendation** — signal, then one of **Continue**, **Manual step first**, or **Stop**, then one sentence.
2. **Verdict** — table with columns Check, Signal, Finding, one row per check above.
3. **Problem** — what is wrong, with the reproduction when there is one.
4. **Worth fixing** — who is affected. Say if our own callers already avoid it.
5. **Right place** — why this function, and why not the layer above or below.
6. **Code and tests** — what the diff does, what the test locks, any gap that is not a blocker.
7. **Workflow approval** — safe or not, and why. Recommend only. Do not approve in this phase.
8. **Work on top** — none, or the outline plus whether we can push.
9. **What a GO would do** — the phase 2 steps that apply, or "do not GO".

Post that comment with `gh pr comment`. Then give the same markdown locally.

### Contributor (local only)

After the local report, a separate section titled **Contributor (local only)**. Start with one line: this section is not on the pull request. Never put it in the comment, a label, or a later status report.

Cover: human, agent-assisted human, or unattended agent; whether assistance was disclosed; a short note on likely intention; a clear **Green / Yellow / Red** on scam or danger. Green means the diff is not hostile. Yellow means the account pattern is noisy and the next pull request is judged on its own diff. Red means do not continue and do not approve workflows. One pull request does not create trust for the next.

## Phase 2 — Integrate

Only after GO, and only when Continue is Green or Yellow with the follow-up included in the GO. If the recommendation was Manual step first or Stop, remind the human and stop.

Do these in one pass. If the checkout has unrelated uncommitted work, stop before switching branches.

1. **Update the branch** when it is behind the base and the follow-up or CI needs the new base. Fetch, then merge the base into the pull request head. Push only when `maintainerCanModify` is true. Do not force-push a contributor branch unless the human explicitly asks.
2. **Labels**, as when opening our own pull request ([git.mdc](../../rules/git.mdc)): one or more `package:` labels, exactly one `PR state:`, the matching `type:` labels, and the `test:` labels the same bars would set on `gh pr create`. `PR state: merge ready` when nothing remains. `PR state: WIP` when phase 2 still leaves known follow-up. Replace a previous `PR state:` label when switching.
3. **Well-scoped follow-up** named in phase 1. Implement it, commit, and push to the pull request branch. If it grows past that outline, stop and report instead of expanding it. Commit only; the push in this step is part of the GO.
4. **Workflow runs** still `action_required` on the head that should be tested. Approve those runs only. Skip this step when the workflow-approval signal is Red. A fork `pull_request` run does not receive repository secrets.

Leave the checkout on the branch the work landed on.

### Status report

Short, after phase 2. What was pushed, which labels are set, which workflow runs were approved (URLs), and that CI is still running if it is. The human merges, or writes the decline sentence. Do not merge. Do not draft that sentence unless asked to post words the human already wrote.
