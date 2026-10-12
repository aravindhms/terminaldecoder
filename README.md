<div align="center">

<img src="favicon.png" alt="Terminal Decoder logo" width="72" height="72" />

# Terminal Decoder

**Instantly decode any terminal command — token by token.**

Paste a command, get a colour-coded breakdown of every flag, subcommand, argument, pipe, and redirect. No sign-up. No backend. No build step.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-terminaldecoder.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://terminaldecoder.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-aravindhms%2Fterminaldecoder-24292e?style=for-the-badge&logo=github)](https://github.com/aravindhms/terminaldecoder)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

</div>

---

## What is Terminal Decoder?

Terminal Decoder is a lightweight, **fully client-side web app** that turns opaque shell one-liners into plain-English explanations. Hover over any token in the command bar to highlight its matching card. Click an example chip to try a real command in seconds.

It covers **80+ CLI tools and ecosystems** out of the box — from Unix core-utils to cloud CLIs, package managers, and runtimes — powered by a single flat JSON database with zero runtime dependencies.

---

## Features

| Feature | Description |
|---|---|
| 🎨 **Colour-coded token bar** | Each token (command, flag, argument, operator, subcommand, env var) gets a distinct colour and a paired explanation card |
| 🚨 **Hazard & Safety Scanner** | Detects destructive commands (`rm -rf /`, fork bombs, raw disk writes, `git reset --hard`, `terraform destroy`) and warns before execution |
| 🔗 **Shareable URLs** | Direct URL links (`?cmd=...`) let you bookmark or send decoded breakdowns directly to teammates |
| 📋 **Copy Markdown & Summary** | One-click export to formatted GitHub Markdown tables, Slack-ready bullet points, or plain text |
| 👑 **Privilege & Wrapper Aware** | Seamlessly understands wrapper commands like `sudo`, `doas`, `nohup`, `time`, `watch`, and `xargs` |
| ⚙️ **Leading Environment Variables** | Detects and styles prepended environment variables (e.g. `NODE_ENV=production npm run build`) |
| 🧮 **Dynamic Permission Decoder** | Mathematically decodes octal (`755`, `644`) and symbolic (`+x`, `u+rwx`) `chmod` modes into plain English |
| ⚡ **Kill Signal Decoder** | Translates numeric signals (`-9`, `-15`, `-1`) and named signals (`-KILL`, `-TERM`, `-HUP`) into signal descriptions |
| 🔗 **Hover sync** | Hovering a token highlights its card and vice-versa |
| 🧩 **Combined flag expansion** | `-la` and `-czvf` expand into individual flag rows inside one card |
| 🤖 **Smart argument guesser** | Accurately identifies JSON payloads, Git refs, Kubernetes resources, ports, CIDRs, URLs, paths, and env vars |
| 🏷️ **Tool filter pills & recents** | Quick-filter examples by ecosystem and recall past commands via recent command chips |
| ↗️ **Deep docs links** | Command cards deep-link directly to relevant subcommands in official docs and man pages |
| ⚡ **Zero dependencies** | Pure HTML + CSS + JavaScript with automated test suite (`npm test`) |

---

## Supported Tools

| Tool | Highlights |
|---|---|
| 🐧 **Unix & Sudo** | `sudo`, `doas`, `ls`, `grep`, `find`, `curl`, `ssh`, `rsync`, `scp`, `awk`, `sed`, `ps`, `kill`, `tar`, `chmod`, `chown`, `ss`, `dig`, `ip`, `lsof`, `watch`, `journalctl`, `htop`, `free`, `df`, `du`, `vim`, `nano`, `date`, `uname`, `crontab`, `zip`, `unzip`, `ffmpeg`, `ssh-keygen` |
| ⑂ **Git & GitHub** | `commit`, `push`, `pull`, `rebase`, `cherry-pick`, `stash`, `switch`, `restore`, `config`, `reflog`, `worktree`, `submodule`, `blame`, `gh` (PRs, issues, repos, releases) |
| 🐳 **Docker** | `run`, `build`, `push`, `pull`, `exec`, `logs`, `inspect`, `network`, `volume`, `compose`, `system prune`, `-af`, `--volumes` |
| ☸ **Kubernetes & Helm** | `get`, `apply`, `delete`, `describe`, `exec`, `logs`, `rollout restart`, `scale`, `port-forward`, `drain`, `cordon`, `helm` (install, upgrade, repo, template) |
| ◈ **Terraform** | `init`, `plan`, `apply`, `destroy`, `validate`, `fmt`, `output`, `import`, `state`, `workspace`, `-var`, `-var-file`, `-target`, `-auto-approve`, `-recursive` |
| ☁️ **AWS CLI** | `s3`, `ec2`, `iam`, `ecs`, `eks`, `ecr`, `lambda`, `cloudformation`, `rds`, `sts`, `ssm`, `logs`, `secretsmanager`, `describe-instances`, `update-kubeconfig`, `tail` |
| △ **Azure CLI** | `vm`, `aks`, `acr`, `storage`, `keyvault`, `webapp`, `functionapp`, `ad`, `role`, `monitor`, `devops`, `cosmosdb`, `blob upload`, `secret show` |
| ◎ **gcloud** | `compute`, `container`, `run`, `functions`, `storage`, `iam`, `logging`, `builds`, `artifacts`, `pubsub`, `secrets`, `run deploy`, `logging read` |
| ⬡ **JS / TS Ecosystem** | `npm`, `pnpm`, `yarn`, `bun`, `node` |
| 🐍 **Python Ecosystem** | `python`, `python3`, `pip`, `pip3`, `venv`, `pytest` |
| 🦀 **Rust & Go** | `cargo` (build, run, test, clippy), `go` (run, build, test, mod tidy) |
| 📦 **Package Managers** | `apt`, `apt-get`, `brew` (Homebrew formulae and casks) |
| ⚙️ **systemctl** | `start`, `stop`, `restart`, `status`, `enable`, `disable`, `reload`, `mask`, `daemon-reload`, `list-units` |
| {} **jq** | `.field`, `[]`, `\|`, `select`, `map`, `keys`, `length`, `has`, `@base64`, `--arg`, `--slurp`, `--raw-output` |
| 🔐 **openssl** | `genrsa`, `req`, `x509`, `s_client`, `dgst`, `verify`, `enc`, `pkcs12`, `-sign`, `-sha256` |

---

## How It Works

```
Input: "kubectl get pods -n kube-system -o wide"
         │
         ▼
    ┌──────────┐
    │ Tokenizer │  splits on whitespace & operators, respects quoted strings
    └──────────┘
         │
         ▼ tokens: ["kubectl", "get", "pods", "-n", "kube-system", "-o", "wide"]
    ┌──────────┐
    │  Parser  │  identifies command → subcommand → flags → arguments
    └──────────┘
         │
         ▼
    ┌───────────────┐
    │ Flag Expander │  splits combined short flags: -aux → -a, -u, -x
    └───────────────┘
         │
         ▼
    ┌──────────────────┐
    │ Argument Guesser │  labels unknowns: paths, URLs, port maps, image refs …
    └──────────────────┘
         │
         ▼
    ┌──────────┐
    │ Renderer │  colour-coded token bar + explanation cards + hover sync
    └──────────┘
```

### Pipeline steps in detail

1. **Tokenizer** — splits input on spaces, respecting single/double-quoted strings and multi-character operators (`>>`, `&&`, `||`, `2>`, `2>&1`).
2. **Parser** — looks up the leading word in `commands.json`. Classifies each subsequent token as a `subcommand` (registered in the command's `flags` map), a `flag` (starts with `-`), or an `argument`.
3. **Flag Expander** — detects combined short flags (`-la`, `-aux`) and renders each individual flag with its description inside a single grouped card.
4. **Argument Guesser** — applies ordered regex rules to give meaningful labels to positional arguments that aren't in the database.
5. **Renderer** — builds the token bar and card grid; attaches hover-sync listeners so tokens and cards highlight each other.

---

## Project Structure

```
terminaldecoder/
├── index.html        # App shell, meta tags, JSON-LD structured data
├── styles.css        # Design system — CSS variables, dark theme, components
├── commands.json     # Unified command + flag database (12 tools)
├── parser.js         # Tokenizer, parser, flag expander, argument guesser
└── app.js            # UI orchestration, tool pills, example chips, renderer
```

### Key data shape in `commands.json`

```jsonc
{
  "commands": {
    "kubectl": {
      "tool": "kubernetes",
      "description": "Kubernetes command-line controller",
      "flags": {
        "get":          "Retrieve one or more resources",
        "-n":           "Namespace to scope the request",
        "--namespace":  "Namespace to scope the request (long form)",
        "-o":           "Output format (wide, json, yaml, …)"
      }
    }
  },
  "pipe_operators": {
    "|":    { "name": "Pipe",       "description": "Pass stdout of the left command to stdin of the right" },
    "&&":   { "name": "AND",        "description": "Run right command only if the left succeeds (exit 0)" },
    ">>":   { "name": "Append",     "description": "Redirect stdout and append to a file" },
    "2>&1": { "name": "Merge stderr","description": "Redirect stderr into stdout" }
  }
}
```

---

## Running Locally

The app fetches `commands.json` via `fetch()`, so it needs to be served over HTTP (not opened as a `file://` URL).

```bash
git clone https://github.com/aravindhms/terminaldecoder.git
cd terminaldecoder

# Option 1 — npx serve (no install required)
npx serve .

# Option 2 — Python
python -m http.server 3000

# Option 3 — VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then open **http://localhost:3000** (or the port shown in your terminal).

---

## Adding a New Tool

### 1 — Add entries to `commands.json`

```json
"mytool": {
  "tool": "mytool",
  "description": "Short description of what mytool does",
  "flags": {
    "subcommand":  "What this subcommand does",
    "--flag":      "What this flag does",
    "-f":          "Short form of the flag"
  }
}
```

### 2 — Register the tool in `app.js`

```js
// TOOL_CATEGORIES — adds a pill to the filter bar
{ id: "mytool", label: "My Tool", icon: "🛠️" }

// TOOL_EXAMPLES.mytool — example chips shown when the pill is active
mytool: [
  { cmd: "mytool subcommand --flag value", label: "mytool example …" }
]
```

### 3 — Add a docs link in `renderResults()` inside `app.js`

```js
if (tool === 'mytool') return { url: 'https://mytool.dev/docs', label: 'mytool docs' };
```

That's it — no build step required.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS with CSS custom properties (no framework) |
| Logic | Vanilla JavaScript (ES2020, no bundler) |
| Data | Single flat JSON file |
| Hosting | Vercel (static) |

---

## Contributing

1. Fork the repo and create a branch: `git checkout -b feat/add-mytool`
2. Make your changes following the patterns above
3. Run test suite: `npm test`
4. Test locally with `npx serve .`
5. Open a pull request with a short description of what you added or fixed

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/aravindhms/terminaldecoder/issues).

---

## License

[MIT](LICENSE) © [aravindhms](https://github.com/aravindhms)
