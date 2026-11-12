# WP-07j: Unified One-Page `Tab` Help, Universal `←`/`→` View History, Bottom-Right `Ctrl+D` Frame Hint, Clean Box Chrome & `/rpc` Method Status Matrix

- **Status:** `DONE`
- **Dependencies:** `WP-07f`, `WP-07h`, `WP-07i`, `WP-08a`, `WP-08b` (`DONE`)
- **Primary Goal:** Streamline TUI navigation and visual calm based on live operator testing by (1) putting **every** view (including `/help` and `/live` Plaza) into the `←`/`→` `viewHistory`, (2) replacing the annoying 3-step `Tab` domain-help rotation with a **single unified 1-key `Tab` Command & AI Overview page** (where pressing `Tab` toggles `/help` on and back to the previous view!), (3) removing the cluttered `· Commands | Debug (Ctrl+D)` suffix from the top title bar and placing a subtle **`Ctrl+D debug` hint in the bottom-right corner of the box frame**, (4) removing the trailing `•` dot from `● Economy` / `● State` / `● P2P` and removing `←/→ view history` from the footer hint line, and (5) upgrading `/rpc` into a full **JSON-RPC Method Status & Capability Matrix** with aligned activation indicators (`● active` / `◐ warming` / `○ off`).

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Argon)

### 1.1 Live Usability Findings (Why `WP-07j` Exists)

Hands-on operation of the live TUI surfaced five concrete UX friction points:

1. **Help Pages Outside `viewHistory` Break Mental Navigation (`src/tui/session.ts` & `viewHistory.ts`):**
   - Previously, `/help` views set `showingHelp = true` without pushing an entry onto `viewHistory`. When a user was on `/help`, ran `/peers`, and pressed `←` to go back to `/help`, nothing happened (or it jumped to an older unrelated view).
   - **Rule:** **Every** view shown in the Interaction box (`/live` Plaza, `/help`, `/peers`, `/rpc`, AI queries) must be pushed onto `viewHistory` so `←` and `→` work universally like browser Back/Forward!
2. **3-Way `Tab` Help Rotation Is Tedious (`src/tui/prompt.ts`, `help.ts`, `DomainHelpUIComponent.ts`):**
   - Rotating through 3 separate help screens (`Economy` $\rightarrow$ `State` $\rightarrow$ `P2P`) via repeated `Tab` presses is frustrating when you just want to look up a P2P or State command.
   - Because Ethy has a focused set of ~17 slash commands across all 3 domains, they fit cleanly on **one unified `/help` page**!
   - Pressing **`Tab`** (on an empty prompt) should immediately open the **Unified `/help` Overview** (showing `● Economy`, `● State`, and `● P2P` commands + `◐ AI Examples` on a single screen), and pressing **`Tab` again** while already on `/help` should **toggle right back** to the previous view in `viewHistory`!
3. **Overloaded Top Title Line (`· Commands | Debug (Ctrl+D)`) (`src/tui/interactionContent.ts`, `roundedBox.ts`, `lowerArea.ts`):**
   - Titles like `/help · Economy · Commands | Debug (Ctrl+D)` or `/live · Ethereum Plaza · #12,118,519 · Live | Debug (Ctrl+D)` clutter the top border of the Interaction box.
   - **Fix:** Remove `renderHeaderPageSwitchUIComponent` from `interactionViewTitle` completely. Instead, extend `boxBottom(boxW, rightPlain?)` in `roundedBox.ts` so when a widget has a `debugPage`, the **bottom-right corner of the box border** subtly shows:
     - On `main` page: `╰────────────────────────────────────────────────────── Ctrl+D debug ─╯` (`${DIM}Ctrl+D debug${RESET}`)
     - On `debug` page: `╰──────────────────────────────────────────────────── ● Debug · Ctrl+D ─╯` (`${BOLD}● Debug${RESET}${DIM} · Ctrl+D${RESET}`)
4. **Remove Trailing `•` on Cockpit Titles & Remove `←/→ view history` from Footer (`src/tui/cockpit.ts`, `renderFrame.ts`):**
   - In `cockpitBoxTitle` (`src/tui/cockpit.ts:311`), remove `const focus = view.activeDomain === id ? ... : ''` so the three top boxes are always cleanly titled `● Economy`, `● State`, and `● P2P` with no trailing dot.
   - In `renderFooterHint` (`src/tui/renderFrame.ts:38`), remove `hintSegment('←/→', 'view history')` and change `Tab` prose from `'show domain help'` to `'help'`:
     `Tab help · Enter plaza · / command · Esc exit`
5. **`/rpc` Should Show a Complete Method Status & Endpoint Matrix (`src/tools/rpcTools.ts`, `commandAvailability.ts`):**
   - Before any external RPC calls arrive, `rpc.methodStats` is empty, so `/rpc` rendered an empty table. And when `--no-rpc` was passed, `/rpc` was locked instead of showing that RPC methods are disabled.
   - Upgrade `/rpc` so it is **always runnable** (`getCommandAvailability('/rpc')` always returns `{ status: 'ready' }`) and displays a **visually aligned JSON-RPC Method Status & Capability Matrix** covering all 7 method groups (`Chain & Net`, `Head State`, `64b Window`, `Fee Oracle`, `EVM Sandbox`, `Tx Broadcast`, `Ethy Native`), their live activation state (`● active`, `◐ warming`, or `○ off`), the supported methods in each group, and live call/latency counts!

---

### 1.2 Detailed Design Specifications

#### Part A: Universal `viewHistory` & 1-Key `Tab` Help Toggle (`src/tui/viewHistory.ts`, `session.ts`, `prompt.ts`)

1. **Include `/help` and `/live` in `viewHistory`:**
   - Remove the special-case exclusion of `/help` from `viewHistory` (`showingHelp` no longer bypasses `viewHistory`).
   - When `openDomainHelp(view, spine, domain?)` is called, push `{ kind: 'slash', command: domain ? \`/help ${domain}\` : '/help', label: '/help', page: 'main' }` onto `viewHistory` via `pushViewHistory` (which already deduplicates consecutive identical commands).
   - Simplify `historyCanGoLeft(view)` to `view.viewHistoryIndex > 0` and `historyCanGoRight(view)` to `view.viewHistoryIndex < view.viewHistory.length - 1`.
   - Simplify `navigateHistory('left' | 'right')` in `session.ts` to step `viewHistoryIndex - 1` or `viewHistoryIndex + 1` and call `activateHistoryEntry`.
2. **Seed Initial View in `viewHistory`:**
   - When the session boots (on `Welcome` or when flipping to `/live` Plaza), or when the user first navigates away from the initial view, ensure the previous view is in `viewHistory` so pressing `←` after your very first action always takes you back! Specifically, initialize `createInitialViewState` with `viewHistory: [{ kind: 'slash', command: '/welcome', label: 'Welcome', page: 'main' }]` and `viewHistoryIndex: 0` (where `/welcome` renders `{ kind: 'start_page' }` if before head or `/live` if at head).
3. **`Tab` Key = Toggle Unified `/help` On / Back:**
   - When the user presses `Tab` on an empty prompt (`promptDraft.length === 0`):
     - If the current active widget is **not** `domain_help`: open the unified `/help` view and push `/help` onto `viewHistory`.
     - If the current active widget **is already** `domain_help` and `view.viewHistoryIndex > 0`: step back (`navigateHistory('left')`) to the view the user was looking at right before pressing `Tab`! (If there is no prior history entry, open `/live` Plaza if blocks exist, else stay on `/help`).

#### Part B: Unified All-in-One `/help` Layout (`src/tools/help.ts`, `src/tui/components/DomainHelpUIComponent.ts`)

1. **Unified Two-Column Layout in `DomainHelpUIComponent.ts`:**
   - Update `buildHelpWidget(spine)` / `buildDomainHelpWidget(spine, domain?)` so default `/help` (and `Tab`) builds a unified overview containing all three domains in a clean 2-column layout aligned with the upper cockpit columns:
     - **Left Column (`leftColW`):**
       - `● Economy`
         - `/live · /plaza` — `Ethereum Plaza observatory`
         - `/economy` — `64-block gas, TPS & volume`
         - `/contract [N|0x]` — `Contract & ABI microscope`
       - *(blank line)*
       - `● State`
         - `/buckets` — `16-bucket sync & cursors`
         - `/account <0x>` — `Balance, nonce & code`
         - `/bal` — `Latest BAL state diffs`
         - `/cl` — `Beacon finality & BLS %`
         - `/simulate <to> <data>` — `EVM call microscope at head`
         - `/range [hex]` · `/sample` — `Browse or sample accounts`
         - `/pause` · `/resume` · `/reassign` — `Control range sync`
     - **Right Column (`rightColW`):**
       - `● P2P`
         - `/peers` — `Client table, caps & RTT`
         - `/ethy` — `ETHY/0 swarm & serve stats`
         - `/rpc` — `JSON-RPC status & methods`
         - `/diag` — `Diagnostic ring buffer`
         - `/send <txHex>` · `/drop <id>` — `Broadcast tx or drop peer`
       - *(blank line)*
       - `◐ AI Examples`
         - `› "How is base fee trending?"`
         - `› "Explain the hottest contract"`
         - `› "What changed in the latest BAL?"`
         - `› "Show top ETH holders"`
         - `› "Compare Nethermind vs Reth peers"`
         - `› "Any handshake or sync anomalies?"`
   - Each command row continues to use `getCommandAvailability(cmd, spine)` so available commands shine in bold cyan (`${BOLD}${FG.cyan}`) and locked commands dim out (`${DIM}`) with their short reason tag!
   - Title in the top border of the Interaction box: `${BOLD}/help · Commands & AI${RESET}` (no `· Commands | Debug (Ctrl+D)`!).

#### Part C: Clean Box Chrome & Bottom-Right `Ctrl+D` Frame Hint (`src/tui/roundedBox.ts`, `lowerArea.ts`, `interactionContent.ts`, `cockpit.ts`, `renderFrame.ts`)

1. **Bottom-Right Border Slot in `roundedBox.ts`:**
   - Update `boxBottom(boxW: number, rightPlain?: string): string`:
     ```ts
     export function boxBottom(boxW: number, rightPlain?: string): string {
       const hasRight = rightPlain !== undefined && rightPlain.length > 0
       if (!hasRight) {
         return fixedLine(`${DIM}╰${'─'.repeat(Math.max(0, boxW - 2))}╯${RESET}`, boxW)
       }
       const rightSuffix = ` ${RESET}${rightPlain}${DIM} ─╯${RESET}`
       const rightVis = visibleWidth(rightSuffix)
       const dashes = Math.max(1, boxW - 1 - rightVis)
       return fixedLine(`${DIM}╰${'─'.repeat(dashes)}${rightSuffix}`, boxW)
     }
     ```
   - Pass `bottomRightPlain?: string` through `renderBox` and `buildVariableBox` in `lowerArea.ts`.
   - When `hasDebugPage` is `true`, compute `bottomRight`:
     - `view.interactionPage === 'main'` $\rightarrow$ `${DIM}Ctrl+D debug${RESET}`
     - `view.interactionPage === 'debug'` $\rightarrow$ `${BOLD}● Debug${RESET}${DIM} · Ctrl+D${RESET}`
2. **Clean Top Title in `interactionViewTitle` (`src/tui/interactionContent.ts`):**
   - Remove `renderHeaderPageSwitchUIComponent` call from `interactionViewTitle` so top titles are purely:
     - `/live · Ethereum Plaza · #12,118,519`
     - `/help · Commands & AI`
     - `/rpc · JSON-RPC`
     - `/peers · Connected peers`
3. **Remove `•` from Cockpit Box Titles (`src/tui/cockpit.ts`) & Update Footer (`src/tui/renderFrame.ts`):**
   - `cockpitBoxTitle` returns `${mark} ${BOLD}${label}${RESET}` (no `•`).
   - `renderFooterHint` returns:
     - `hintSegment('Tab', 'help')`
     - `hintSegment('Enter', 'plaza')`
     - `hintSegment('/', 'command')`
     - `hintSegment('Esc', 'exit')`

#### Part D: `/rpc` Method Status & Capability Matrix (`src/tools/rpcTools.ts`, `src/domains/commandAvailability.ts`)

1. **Always Allow `/rpc` in `getCommandAvailability`:**
   - `/rpc` should always return `{ status: 'ready' }` so the user can inspect the RPC status matrix even if `--no-rpc` was passed or the server is warming up.
2. **Structured Method Status Matrix in `rpcMicroscopeWidget(spine)` (`src/tools/rpcTools.ts`):**
   - Define the 7 canonical Ethy JSON-RPC method groups, the methods belonging to each group, and how each group's status is derived from `spine`:
     | Group | Methods | Activation Condition |
     | --- | --- | --- |
     | `Chain & Net` | `eth_chainId, eth_syncing, eth_blockNumber, net_*, web3_*` | Active whenever `rpc.listening === true` |
     | `Head State` | `eth_getBalance, eth_getCode, eth_getStorageAt, eth_getTransactionCount` | Active when `rpc.listening` and (`totalAccountsSynced > 0` or `isNodeAtChainHead(spine)`); otherwise `◐ warming` |
     | `64b Window` | `eth_getBlockBy*, eth_getTxBy*, eth_getTransactionReceipt, eth_getLogs` | Active when `rpc.listening` and `economy.hasBlocks === true`; otherwise `◐ awaiting blocks` |
     | `Fee Oracle` | `eth_gasPrice, eth_maxPriorityFeePerGas, eth_blobBaseFee, eth_feeHistory` | Active when `rpc.listening` and `economy.hasBlocks === true`; otherwise `◐ awaiting blocks` |
     | `EVM Sandbox` | `eth_call, eth_estimateGas, eth_createAccessList` | Active when `rpc.listening` and (`totalAccountsSynced > 0` or `isNodeAtChainHead(spine)`); otherwise `◐ warming` |
     | `Tx Broadcast` | `eth_sendRawTransaction` | Active when `rpc.listening` and (`peers.size > 0` or `demoClock`); otherwise `◐ no peers` |
     | `Ethy Native` | `eth_getBlockAccessListBy*, ethy_status, ethy_economy` | Active whenever `rpc.listening === true` |
   - Format the **Status** column with visually aligned colored indicators:
     - `${FG.green}● active${RESET}` when ready
     - `${FG.yellow}◐ warming${RESET}` (or `${FG.yellow}◐ awaiting${RESET}`) when syncing/warming
     - `${DIM}○ off${RESET}` when `rpc?.listening !== true`
   - Sum the `calls` and `errors` from `rpc.methodStats` across the methods in each group so the table shows `['Group', 'Status', 'Methods', 'Calls']`!
   - If individual methods have been called (`Object.keys(rpc.methodStats).length > 0`), include a `secondaryTable` (`title: 'Called methods'`) or `debugPage` section showing per-method `['Method', 'Calls', 'Errors', 'Last ms']` plus `Recent calls` and `curl` / `cast` examples on `Ctrl+D`!

---

### 1.3 Acceptance Criteria

- [x] Every view (`/welcome`, `/live`, `/help`, slash commands, AI queries) is recorded in `viewHistory`, and `←`/`→` navigates seamlessly back and forth across `/help`, `/live`, and slash commands.
- [x] Pressing `Tab` on an empty prompt opens a single unified `/help · Commands & AI` page showing all 3 domains (`Economy`, `State`, `P2P`) + `AI Examples` at once; pressing `Tab` while already on `/help` toggles back to the previous view.
- [x] Top Interaction box titles no longer include `· Commands | Debug (Ctrl+D)`; instead, widgets with a `debugPage` render `Ctrl+D debug` (or `● Debug · Ctrl+D`) in the bottom-right corner of the box border (`boxBottom`).
- [x] The trailing `•` dot on `● Economy` / `● State` / `● P2P` cockpit box titles is removed, and the bottom-left footer hint reads `Tab help · Enter plaza · / command · Esc exit` (without `←/→ view history`).
- [x] `/rpc` renders the 7-group JSON-RPC Method Status & Capability Matrix with aligned `● active` / `◐ warming` / `○ off` indicators, method lists, and call counters (plus per-method latency and `curl`/`cast` examples on `Ctrl+D`).
- [x] Unit tests in `test/tui.spec.ts`, `test/rpc.spec.ts`, and `test/intent.spec.ts` are updated and green; `npm run tsc`, `npm test`, and `npm run spellcheck` pass with 0 errors.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**Ethy only.** Decision **D-114** (planner locks on **D-113**). Order: view history + Tab toggle → unified help → box chrome → `/rpc` matrix → tests.

**Design locks:** empty `Tab`/`Shift+Tab` → `helpToggle` (no domain cycle); bare `/help` unified, scoped `/help <domain>` kept; keep `←`/`→` top-right, drop title `Commands | Debug`; `showingHelp` syncs with `domain_help`; help live-refresh; `/welcome` seeds history and refreshes to plaza; `/rpc` always ready + 7-group matrix.

**Files:** `viewHistory.ts`, `prompt.ts`, `session.ts`, `interactionChrome.ts`, `deterministicEngine.ts`, `help.ts`, `DomainHelpUIComponent.ts`, `interactionContent.ts`, `roundedBox.ts`, `lowerArea.ts`, `cockpit.ts`, `renderFrame.ts`, `commandAvailability.ts`, `rpcTools.ts`, `spine/types.ts`, copy in `usagePlaybook.ts`, `overviewNarrator.ts`, `StartPageUIComponent.ts`, `ethy-tui.mdc`, root `ethy-architecture.mdc`, tests `tui.spec.ts`, `intent.spec.ts`, `rpc.spec.ts`, `commandAvailability.spec.ts`.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- Shipped **D-113** / planner **D-114**: `/welcome` seeds `viewHistory`; `Tab` toggles unified `/help`; bottom `Ctrl+D debug` border hint; cockpit titles without focus dot; footer `Tab help · Enter plaza · / command · Esc exit`; `/rpc` always ready with 7-group matrix + called-methods table.
- `Shift+Tab` on empty draft also toggles help (same as `Tab`).
- Gates: `npm run tsc`, **304** tests, `spellcheck:ts` green (`spellcheck:md` still flags historical `PROGRESS.md` terms unrelated to this WP).
