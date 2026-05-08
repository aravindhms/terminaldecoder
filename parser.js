/**
 * Parser module for Terminal Decoder
 * Handles tokenization and command analysis
 */

window.COMMAND_DATA = null;

// ── Tool-aware flag conventions ────────────────────────────────────────────────
//
//  posix  (unix, git, jq)
//    → Combined single-dash short flags are valid: -la, -avzr, -am
//    → Split multi-char flags into individual components
//
//  long   (terraform, openssl)
//    → All single-dash flags are long-form: -out=tfplan, -newkey rsa:4096
//    → NEVER split; always look up as a single token
//
//  gnu    (docker, kubernetes, npm, systemctl, aws, azure, gcloud)
//    → Flags are single-char (-n, -o) or double-dash (--name, --region)
//    → Multi-char single-dash combos are not idiomatic — treat as single token
//
const FLAG_CONVENTIONS = {
  posix: new Set(["unix", "git", "jq"]),
  long:  new Set(["terraform", "openssl"]),
  gnu:   new Set(["docker", "kubernetes", "npm", "systemctl", "aws", "azure", "gcloud"]),
};

/**
 * Initialize parser data from JSON
 */
async function initParser() {
  try {
    const response = await fetch('commands.json');
    window.COMMAND_DATA = await response.json();
    return true;
  } catch (err) {
    console.error("Failed to load command database:", err);
    return false;
  }
}

function parseCommand(input) {
  if (!window.COMMAND_DATA) return [];

  const COMMANDS = window.COMMAND_DATA.commands;
  const PIPE_OPERATORS = window.COMMAND_DATA.pipe_operators;

  input = input.trim();
  const tokens = tokenize(input);
  const results = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    // Operator / pipe
    if (PIPE_OPERATORS[token]) {
      results.push({
        type: "operator",
        value: token,
        name: PIPE_OPERATORS[token].name,
        description: PIPE_OPERATORS[token].description
      });
      i++;
      continue;
    }

    const cmdKey = token.toLowerCase();
    if (COMMANDS[cmdKey]) {
      const cmd = COMMANDS[cmdKey];
      const tool = cmd.tool || "unix";
      results.push({ type: "command", value: token, tool, description: cmd.description });
      i++;

      // ── Inner loop: subcommands, flags, arguments ─────────────────────────
      while (i < tokens.length && !PIPE_OPERATORS[tokens[i]]) {
        const t = tokens[i];

        if (t.startsWith("-")) {
          // Combined short flags (e.g. -la, -avzr): one card with sub-rows
          // Skip if this is a long-form single-dash flag for this tool
          if (!t.startsWith("--") && t.length > 2 && !isLongFlag(t, tool)) {
            const flagParts = t.slice(1).split("").map(c => {
              const sf = "-" + c;
              return {
                value: sf,
                description: (cmd.flags && cmd.flags[sf])
                  ? cmd.flags[sf]
                  : `Flag for ${cmdKey} — check official docs for details`
              };
            });
            results.push({ type: "flag", tool, value: t, parts: flagParts });
            i++;
          } else {
            results.push({ type: "flag", tool, value: t, description: explainFlag(cmdKey, t) });
            i++;
          }

        } else {
          // Non-flag token: try two-word compound subcommand first
          // e.g. "audit fix", "cache clean" in npm
          const nextT = tokens[i + 1];
          const nextIsWord = nextT && !nextT.startsWith('-') && !PIPE_OPERATORS[nextT];
          const compound = nextIsWord ? `${t} ${nextT}` : null;

          if (compound && cmd.flags && cmd.flags[compound]) {
            results.push({ type: "subcommand", tool, value: compound, description: cmd.flags[compound] });
            i += 2; // consume both tokens
          } else if (cmd.flags && cmd.flags[t]) {
            results.push({ type: "subcommand", tool, value: t, description: cmd.flags[t] });
            i++;
          } else {
            results.push({ type: "argument", tool, value: t, description: guessArgument(t) });
            i++;
          }
        }
      }

    } else {
      // Unknown command
      if (token.startsWith("-")) {
        results.push({ type: "flag", value: token, description: "Flag/option for the preceding command" });
      } else {
        results.push({ type: "argument", value: token, description: guessArgument(token) });
      }
      i++;
    }
  }

  return results;
}

/**
 * Decide if a single-dash flag should be treated as a long-form token
 * (i.e. NOT split character-by-character as combined POSIX short flags).
 *
 * Universal rules (apply to all tools):
 *   - Contains '=' → -out=tfplan, --lock-timeout=30s
 *   - Contains '-' after the leading dash → -auto-approve, -no-color
 *   - Starts with a digit → -15, -9 (kill signals)
 *
 * Tool-specific rules:
 *   long (terraform, openssl) → always treat as long-form
 *   gnu  (docker, k8s, npm…)  → multi-char single-dash is not a combo: treat as long
 *   posix (unix, git, jq)     → allow combining (return false)
 */
function isLongFlag(flag, tool) {
  const body = flag.slice(1); // strip leading '-'

  // Universal signals
  if (body.includes('=')) return true;
  if (body.includes('-')) return true;
  if (/^\d/.test(body))   return true;

  // Tool-specific conventions
  if (FLAG_CONVENTIONS.long.has(tool))                      return true; // terraform, openssl
  if (FLAG_CONVENTIONS.gnu.has(tool) && body.length >= 2)  return true; // docker -it etc.

  // posix / unknown: allow combining
  return false;
}

function explainFlag(cmd, flag) {
  if (!window.COMMAND_DATA) return "Option flag";
  const cmdData = window.COMMAND_DATA.commands[cmd];
  if (!cmdData) return "Option flag for the command";

  // Direct match
  if (cmdData.flags[flag]) return cmdData.flags[flag];

  // For -out=tfplan or --lock-timeout=30s, try just the key part
  if (flag.includes('=')) {
    const keyPart = flag.split('=')[0];
    if (cmdData.flags[keyPart]) return cmdData.flags[keyPart];
  }

  return `Flag for ${cmd} — check official docs for details`;
}

function guessArgument(token) {
  // Strip surrounding quotes before matching and displaying (Bug 5 fix)
  const t = token.replace(/^(['"])(.*)\1$/, '$2');

  if (/^\//.test(t))  return `Absolute path: ${t}`;
  if (/^~/.test(t))   return `Home directory path: ${t}`;

  if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+(:[0-9]+)?$/.test(t)) return `IPv4 address / host:port: ${t}`;
  if (/^:?\d+:\d+$/.test(t))        return `Port mapping (host:container): ${t}`;
  if (/^[A-Z_][A-Z0-9_]*=/.test(t)) return `Environment variable assignment: ${t}`;
  // Bug E fix: crypto key specs (e.g. rsa:4096) before the container image regex
  if (/^(rsa|ec|ed25519|dsa):\d+$/i.test(t)) return `Cryptographic key type and size: ${t}`;
  // Bug F fix: S3, GCS, and HTTP/S URLs
  if (/^s3:\/\//.test(t))     return `S3 bucket or object path: ${t}`;
  if (/^gs:\/\//.test(t))     return `GCS bucket or object path: ${t}`;
  if (/^https?:\/\//.test(t)) return `URL: ${t}`;
  if (/^[a-z0-9._/-]+:[a-z0-9._-]+$/.test(t) && !t.startsWith('-')) return `Container image reference: ${t}`;
  if (/^v?\d+\.\d+(\.\d+)?(-[a-z0-9.]+)?$/.test(t)) return `Version string: ${t}`;
  if (/[*?{}]/.test(t))  return `Glob / wildcard pattern: ${t}`;
  if (/@/.test(t))       return `User@host address: ${t}`;
  if (/^\d+$/.test(t))   return `Numeric value: ${t}`;

  // File type detection — Bug 2 fix: all dots are now properly escaped
  if (/\.ya?ml$/.test(t))                      return `YAML file: ${t}`;
  if (/\.json$/.test(t))                        return `JSON file: ${t}`;
  if (/\.tfvars$/.test(t))                      return `Terraform variables file: ${t}`;
  if (/\.tf$/.test(t))                          return `Terraform configuration file: ${t}`;
  if (/\.(pem|crt|cer|key|p12|pfx)$/.test(t))  return `TLS/SSL certificate or key file: ${t}`;
  if (/\.(sh|bash|zsh)$/.test(t))              return `Shell script: ${t}`;
  if (/\.(tar|gz|bz2|xz|zip|tgz)$/.test(t))   return `Archive file: ${t}`;
  if (/\.log$/.test(t))                         return `Log file: ${t}`;
  if (/\.conf$|\.ini$|\.cfg$/.test(t))          return `Configuration file: ${t}`; // Bug 2 fixed
  if (/\./.test(t))                             return `File or path: ${t}`;

  return `Argument: ${t}`;
}

function tokenize(input) {
  const tokens = [];
  let current = "";
  let inQuote = null;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inQuote) {
      if (ch === inQuote) { inQuote = null; } // closing quote — skip the char (Bug 5 fix)
      else { current += ch; }
      continue;
    }

    // Opening quote — mark start, skip quote char itself (Bug 5 fix)
    if (ch === '"' || ch === "'") { inQuote = ch; continue; }

    // Bug 4 fix: renamed 'three' → 'fourCharOp' (it reads 4 chars, not 3)
    const fourCharOp = input.slice(i, i + 4);
    if (fourCharOp === "2>&1") {
      if (current) { tokens.push(current); current = ""; }
      tokens.push("2>&1"); i += 3; continue;
    }

    const twoCharOp = input.slice(i, i + 2);
    if ([">>", "&&", "||", "2>"].includes(twoCharOp)) {
      if (current) { tokens.push(current); current = ""; }
      tokens.push(twoCharOp); i++; continue;
    }

    if (["|", ">", "<", "&", ";"].includes(ch)) {
      if (current) { tokens.push(current); current = ""; }
      tokens.push(ch); continue;
    }

    // Bug G fix: treat \n and \r as whitespace so pasted multi-line commands don't fuse tokens
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      if (current) { tokens.push(current); current = ""; }
      continue;
    }

    current += ch;
  }

  if (current) tokens.push(current);
  return tokens;
}
