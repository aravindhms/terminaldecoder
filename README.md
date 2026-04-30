# Terminal Decoder

> **Decode any terminal command — instantly.**

A fast, client-side web app that breaks down terminal commands token by token, explaining every flag, argument, subcommand, and pipe operator. No backend, no dependencies — just open and use.

🔗 **[Live Demo](https://terminaldecoder.vercel.app/)** &nbsp;|&nbsp; **[GitHub](https://github.com/aravindhms/terminaldecoder)**

---

## Features

- **Multi-tool support** — Unix, Git, Terraform, Docker, Kubernetes, AWS CLI, Azure CLI, gcloud, npm, systemctl, jq, openssl
- **Smart tokenizer** — detects commands, subcommands, flags, arguments, pipe operators, and redirects
- **Combined flag expansion** — `-la` shows `-l` and `-a` explained line-by-line inside one card
- **Intelligent argument guesser** — auto-labels paths, URLs, port mappings (`8080:80`), container images (`nginx:latest`), env vars (`KEY=VALUE`), file types (`.yaml`, `.pem`, `.tf`, …)
- **Official docs link** — every command card links to its man page or official documentation
- **Tool filter pills** — filter example chips and quickly jump to a specific ecosystem
- **No install, no build step** — pure HTML + CSS + JavaScript

---

## Supported Tools

| Tool | Commands / Flags |
|------|-----------------|
| 🐧 **Unix** | `ls`, `grep`, `find`, `curl`, `ssh`, `wget`, `rsync`, `scp`, `awk`, `sed`, `ps`, `kill`, `tar`, `chmod`, `chown`, `ss`, `dig`, `ip`, `lsof`, `watch`, `journalctl`, `htop`, `free`, `df`, `du`, `vim`, `nano`, `date`, `uname`, `crontab`, `zip`, `unzip` + more |
| ⑂ **Git** | `commit`, `push`, `pull`, `rebase`, `cherry-pick`, `stash`, `config`, `reflog`, `worktree`, `submodule`, `blame`, `--force-with-lease`, `--no-verify`, `--autosquash` + more |
| ◈ **Terraform** | `init`, `plan`, `apply`, `destroy`, `validate`, `fmt`, `output`, `import`, `state`, `workspace`, `-var`, `-var-file`, `-target`, `-auto-approve` + more |
| 🐳 **Docker** | `run`, `build`, `push`, `pull`, `exec`, `logs`, `inspect`, `network`, `volume`, `compose` + all major flags |
| ☸ **Kubernetes** | `get`, `apply`, `delete`, `describe`, `exec`, `logs`, `rollout`, `drain`, `cordon`, `wait`, `api-resources`, `explain` + more |
| ☁ **AWS CLI** | `s3`, `ec2`, `iam`, `ecs`, `eks`, `ecr`, `lambda`, `cloudformation`, `rds`, `sts`, `ssm`, `logs`, `secretsmanager` + global flags |
| △ **Azure CLI** | `vm`, `aks`, `acr`, `storage`, `keyvault`, `webapp`, `functionapp`, `ad`, `role`, `monitor`, `devops`, `cosmosdb` + global flags |
| ◎ **GCloud** | `compute`, `container`, `run`, `functions`, `storage`, `iam`, `logging`, `builds`, `artifacts`, `pubsub`, `secrets` + global flags |
| ⬡ **npm** | `install`, `run`, `publish`, `audit`, `ci`, `link`, `pack`, `exec` + flags |
| ⚙ **systemctl** | `start`, `stop`, `restart`, `status`, `enable`, `disable`, `reload`, `mask`, `daemon-reload`, `list-units` |
| {} **jq** | `.field`, `[]`, `|`, `select`, `map`, `keys`, `length`, `has`, `@base64`, `--arg`, `--slurp`, `--raw-output` |
| 🔐 **openssl** | `genrsa`, `req`, `x509`, `s_client`, `dgst`, `verify`, `enc`, `pkcs12` |

---

## Project Structure

```
terminaldecoder/
├── index.html          # App shell, layout, meta tags
├── styles.css          # Design system (CSS variables, components)
├── commands.json       # Unified command database (JSON)
├── parser.js           # Core tokenization and command analysis logic
└── app.js              # UI logic, rendering, and filtering
```

---

## How It Works

1. **Tokenizer** splits the input on spaces, respecting quoted strings and operators (`|`, `>`, `&&`, etc.)
2. **Parser** identifies the leading command, then classifies each subsequent token as a subcommand, flag, or argument
3. **Flag expander** splits combined short flags (`-aux` → `-a`, `-u`, `-x`) and renders each with its description inside a single card
4. **Argument guesser** uses regex heuristics to label ambiguous positional arguments (paths, URLs, port maps, image refs, env vars, file types)
5. **Renderer** outputs colour-coded cards with a shared token bar that highlights on hover

---

## Running Locally

No build step needed — just open the file in a browser:

```bash
git clone https://github.com/aravindhms/terminaldecoder.git
cd terminaldecoder
# Open index.html in your browser, or serve with any static server:
npx serve .
```

---

## Adding a New Tool

1. Open `commands.json`
2. Add an entry to the `commands` object following the existing schema:
```json
"mytool": {
  "tool": "mytool",
  "description": "What this tool does",
  "flags": {
    "subcommand": "Description of subcommand",
    "--flag":     "Description of flag"
  }
}
```
3. Add a pill to `TOOL_CATEGORIES`, a colour to `TOOL_COLORS`, a label to `TOOL_LABELS`, and example chips to `TOOL_EXAMPLES` in `app.js`

---

## License

MIT
