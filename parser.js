/**
 * Parser module for Terminal Decoder v3.0
 * Architecture:
 * - Hierarchical subcommand & scoped flag resolution
 * - Data-driven schema (wrapper commands, flag conventions, typed flags)
 * - True AST tokenization: quotes, escapes, subshells $(...), process substitutions <(...)
 * - Smart CLI structural inference for unrecognized / custom tools
 * - Hazard / safety scanner
 */

if (typeof window === 'undefined') {
  global.window = {};
}
window.COMMAND_DATA = window.COMMAND_DATA || null;

// Fallback value-flag detection heuristic if a tool or flag is custom/unregistered
const HEURISTIC_VALUE_FLAGS = new Set([
  "-n", "--name", "--namespace",
  "-m", "--message",
  "-p", "--port", "--publish",
  "-u", "--user", "--unit",
  "-f", "--file", "--values",
  "-o", "--output", "--out",
  "-i", "--identity", "--input",
  "-t", "--tag", "--target",
  "-b", "--branch",
  "-c", "--config", "--command",
  "-e", "--eval", "--env",
  "-d", "--data",
  "-s", "--signal", "--stack",
  "-r", "--requirement",
  "-w", "--workspace",
  "-l", "--location",
  "-g", "--resource-group",
  "-v", "--volume",
  "-X", "--request",
  "-type", "-name", "--title",
  "--region", "--cluster", "--profile", "--secret-id", "--runtime",
  "--replicas", "--tail", "--format", "--query", "--limit", "--context",
  "--account-name", "--vault-name", "--registry", "--image",
  "--index-url", "--extra-index-url", "--max-old-space-size", "--env-file"
]);

function isFallbackValueFlag(flagKey) {
  return HEURISTIC_VALUE_FLAGS.has(flagKey);
}

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

/**
 * Resolve flag definition with subcommand scoping support
 * Checks subcommand scope first, then root command flags
 */
function resolveFlagMeta(cmd, activeSubcommand, flagKey) {
  if (!cmd) return null;

  // 1. Try scoped subcommand flags
  if (activeSubcommand && cmd.subcommands && cmd.subcommands[activeSubcommand] && cmd.subcommands[activeSubcommand].flags) {
    const scoped = cmd.subcommands[activeSubcommand].flags[flagKey];
    if (scoped) {
      return typeof scoped === 'string'
        ? { description: scoped, takes_arg: isFallbackValueFlag(flagKey) }
        : scoped;
    }
  }

  // 2. Try root command flags
  if (cmd.flags && cmd.flags[flagKey]) {
    const root = cmd.flags[flagKey];
    return typeof root === 'string'
      ? { description: root, takes_arg: isFallbackValueFlag(flagKey) }
      : root;
  }

  return null;
}

/**
 * Determine if a command acts as a privilege / execution wrapper
 */
function isWrapperCommand(cmdKey, cmd) {
  if (cmd && cmd.is_wrapper) return true;
  return ["sudo", "doas", "nohup", "time", "xargs", "env", "exec", "watch", "timeout", "nice", "ionice"].includes(cmdKey);
}

/**
 * Decide if a flag should be treated as an atomic token (long flag) rather than split
 */
function isLongFlag(flag, tool, cmd) {
  const body = flag.startsWith("--") ? flag.slice(2) : flag.slice(1);
  if (flag.startsWith("--")) return true;
  if (body.includes('=')) return true;
  if (body.includes('-')) return true;
  if (/^\d/.test(body)) return true;
  if (cmd && cmd.flag_convention === "long") return true;
  if (tool === "terraform" || tool === "openssl") return true;
  if (cmd && cmd.flags && cmd.flags[flag]) return true;
  return false;
}

/**
 * Parse a full terminal command string into categorized tokens
 * @param {string} input Raw terminal input string
 * @returns {Array} Array of token objects with .hazard property attached
 */
function parseCommand(input) {
  if (!window.COMMAND_DATA) return [];

  const COMMANDS = window.COMMAND_DATA.commands || {};
  const PIPE_OPERATORS = window.COMMAND_DATA.pipe_operators || {};

  const rawInput = input.trim();
  const hazard = scanHazards(rawInput);
  const tokens = tokenize(rawInput);
  const results = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    // 1. Pipe / Redirection operator
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

    // 2. Leading Environment Variable Assignment (e.g. NODE_ENV=production or PORT=8080)
    const isLeadingOrAfterPipe = (results.length === 0) || (results[results.length - 1].type === "operator");
    if (isLeadingOrAfterPipe && /^[A-Za-z_][A-Za-z0-9_]*=/.test(token)) {
      results.push({
        type: "env_var",
        value: token,
        description: `Environment variable set for command execution: ${token}`
      });
      i++;
      continue;
    }

    // 3. Command identification
    const cmdKey = token.toLowerCase();
    const isKnownCmd = !!COMMANDS[cmdKey];

    if (isKnownCmd) {
      const cmd = COMMANDS[cmdKey];
      const tool = cmd.tool || "unix";

      results.push({
        type: "command",
        value: token,
        tool,
        description: cmd.description
      });
      i++;

      let activeSubcommand = null;
      let lastExpectingFlag = null;

      // ── Inner loop: subcommands, flags, arguments for this command ───────
      while (i < tokens.length && !PIPE_OPERATORS[tokens[i]]) {
        const t = tokens[i];

        // 3a. Separator '--' (signals end of options)
        if (t === "--") {
          results.push({
            type: "operator",
            value: "--",
            name: "End-of-Options Separator",
            description: "Signals the end of flags/options; subsequent tokens are treated strictly as positional arguments or child command"
          });
          lastExpectingFlag = null;
          i++;

          // If followed by words, allow subsequent recognized command
          if (i < tokens.length && COMMANDS[tokens[i].toLowerCase()]) {
            break;
          }
          continue;
        }

        // 3b. Wrapper command transition (e.g. sudo apt install, watch -n 2 df -h)
        if (isWrapperCommand(cmdKey, cmd) && !t.startsWith("-") && COMMANDS[t.toLowerCase()]) {
          break; // break to outer loop to parse target command with its full ecosystem
        }

        // 3c. Flags (starts with - or chmod +x)
        if (t.startsWith("-") || (t.startsWith("+") && cmdKey === "chmod")) {
          // Special: chmod symbolic permission like +x, -w
          if (cmdKey === "chmod" && /^[+-][rwxXst]+$/.test(t)) {
            const symDesc = decodeChmod(t);
            results.push({
              type: "subcommand",
              tool,
              value: t,
              description: symDesc || `File permission change: ${t}`
            });
            i++;
            continue;
          }

          // Special: kill signals like -9, -15, -TERM, -KILL
          if (cmdKey === "kill") {
            const sigDesc = decodeKillSignal(t);
            if (sigDesc) {
              results.push({
                type: "flag",
                tool,
                value: t,
                description: sigDesc
              });
              i++;
              continue;
            }
          }

          // Flag with '=' notation (e.g. --replicas=3 or -out=tfplan or --region=us-east-1)
          if (t.includes("=")) {
            const [flagKey, ...valParts] = t.split("=");
            const flagVal = valParts.join("=");
            const meta = resolveFlagMeta(cmd, activeSubcommand, flagKey);
            const flagDesc = meta ? meta.description : `Option flag: ${flagKey}`;

            results.push({
              type: "flag",
              tool,
              value: t,
              description: `${flagDesc} (assigned value: ${flagVal})`,
              flagKey,
              flagVal
            });
            lastExpectingFlag = null;
            i++;
            continue;
          }

          // Numeric count flags like head -20 or tail -50
          if (/^-\d+$/.test(t) && (cmdKey === "head" || cmdKey === "tail")) {
            const count = t.slice(1);
            results.push({
              type: "flag",
              tool,
              value: t,
              description: `Line count: output ${count} lines (shorthand for -n ${count})`
            });
            lastExpectingFlag = null;
            i++;
            continue;
          }

          // Check if it's a combined short flag (e.g. -la, -czvf, -it, -af)
          const isLong = isLongFlag(t, tool, cmd);

          if (!t.startsWith("--") && t.length > 2 && !isLong) {
            const flagParts = t.slice(1).split("").map(c => {
              const sf = "-" + c;
              const meta = resolveFlagMeta(cmd, activeSubcommand, sf);
              return {
                value: sf,
                description: meta ? meta.description : `Flag ${sf} for ${cmdKey}`
              };
            });

            results.push({
              type: "flag",
              tool,
              value: t,
              parts: flagParts
            });

            // Check if the last flag character expects an argument
            const lastChar = "-" + t.slice(-1);
            const lastMeta = resolveFlagMeta(cmd, activeSubcommand, lastChar);
            lastExpectingFlag = (lastMeta && lastMeta.takes_arg) || isFallbackValueFlag(lastChar) ? lastChar : null;
            i++;
            continue;
          }

          // Standard flag: resolve with subcommand scoping
          const flagMeta = resolveFlagMeta(cmd, activeSubcommand, t);
          let desc = flagMeta ? flagMeta.description : `Flag for ${cmdKey} — check official docs for details`;

          results.push({
            type: "flag",
            tool,
            value: t,
            description: desc
          });

          // Check if this flag expects an argument value next
          const expectsArg = (flagMeta && flagMeta.takes_arg) || isFallbackValueFlag(t);
          lastExpectingFlag = expectsArg ? t : null;
          i++;
          continue;
        }

        // 3d. Non-flag tokens (Subcommands or Arguments)

        // Try 3-word compound subcommand (e.g. "storage blob upload")
        const t2 = tokens[i + 1];
        const t3 = tokens[i + 2];
        const compound3 = (t2 && t3 && !t2.startsWith('-') && !t3.startsWith('-') && !PIPE_OPERATORS[t2] && !PIPE_OPERATORS[t3])
          ? `${t} ${t2} ${t3}`
          : null;

        if (compound3 && ((cmd.flags && cmd.flags[compound3]) || (cmd.subcommands && cmd.subcommands[compound3]))) {
          const subDesc = (cmd.subcommands && cmd.subcommands[compound3] && cmd.subcommands[compound3].description) ||
                          (cmd.flags && cmd.flags[compound3]);
          results.push({
            type: "subcommand",
            tool,
            value: compound3,
            description: subDesc
          });
          activeSubcommand = compound3;
          lastExpectingFlag = null;
          i += 3;
          continue;
        }

        // Try 2-word compound subcommand (e.g. "audit fix", "system prune", "stash pop", "rollout restart")
        const compound2 = (t2 && !t2.startsWith('-') && !PIPE_OPERATORS[t2]) ? `${t} ${t2}` : null;
        if (compound2 && ((cmd.flags && cmd.flags[compound2]) || (cmd.subcommands && cmd.subcommands[compound2]))) {
          const subDesc = (cmd.subcommands && cmd.subcommands[compound2] && cmd.subcommands[compound2].description) ||
                          (cmd.flags && cmd.flags[compound2]);
          results.push({
            type: "subcommand",
            tool,
            value: compound2,
            description: subDesc
          });
          activeSubcommand = compound2;
          lastExpectingFlag = null;
          i += 2;
          continue;
        }

        // Try single-word subcommand (e.g. "commit", "push", "plan", "install", "run")
        if ((cmd.subcommands && cmd.subcommands[t]) || (cmd.flags && cmd.flags[t])) {
          const subDesc = (cmd.subcommands && cmd.subcommands[t] && cmd.subcommands[t].description) ||
                          (cmd.flags && cmd.flags[t]);
          results.push({
            type: "subcommand",
            tool,
            value: t,
            description: typeof subDesc === 'object' ? subDesc.description : subDesc
          });
          activeSubcommand = t;
          lastExpectingFlag = null;
          i++;
          continue;
        }

        // Special: tar options without dash (e.g. czvf, xvf)
        if (cmdKey === "tar" && /^[ctxzjvfp]+$/i.test(t)) {
          const parts = t.split("").map(c => ({
            value: c,
            description: (cmd.flags && cmd.flags["-" + c]) ? (cmd.flags["-" + c].description || cmd.flags["-" + c]) : `Tar option: ${c}`
          }));
          results.push({
            type: "flag",
            tool,
            value: t,
            parts,
            description: `Archive flags: ${t}`
          });
          lastExpectingFlag = t.includes("f") ? "-f" : null;
          i++;
          continue;
        }

        // Special: ps options without dash (e.g. aux)
        if (cmdKey === "ps" && cmd.flags && cmd.flags[t]) {
          const pDesc = cmd.flags[t].description || cmd.flags[t];
          results.push({
            type: "flag",
            tool,
            value: t,
            description: pDesc
          });
          lastExpectingFlag = null;
          i++;
          continue;
        }

        // Special: chmod octal / symbolic permissions
        if (cmdKey === "chmod") {
          const chmodDesc = decodeChmod(t);
          if (chmodDesc) {
            results.push({
              type: "subcommand",
              tool,
              value: t,
              description: chmodDesc
            });
            lastExpectingFlag = null;
            i++;
            continue;
          }
        }

        // Special: systemctl service/unit name argument
        if (cmdKey === "systemctl" && !lastExpectingFlag && results.some(r => r.type === "subcommand")) {
          results.push({
            type: "argument",
            tool,
            value: t,
            description: `Systemd service or unit: ${t}`
          });
          i++;
          continue;
        }

        // Special: awk script pattern-action block
        if (cmdKey === "awk" && t.startsWith("{") && t.endsWith("}")) {
          results.push({
            type: "argument",
            tool,
            value: t,
            description: `Awk pattern-action script block: ${t}`
          });
          i++;
          continue;
        }

        // Context-aware Argument handling (flag value vs generic argument)
        let argDesc = guessArgument(t, cmdKey);

        if (lastExpectingFlag) {
          if (argDesc.startsWith("Argument: ")) {
            argDesc = `Value for flag ${lastExpectingFlag}: ${t}`;
          } else {
            argDesc = `${argDesc} (value for ${lastExpectingFlag})`;
          }
          lastExpectingFlag = null; // consumed
        }

        results.push({
          type: "argument",
          tool,
          value: t,
          description: argDesc
        });
        i++;
      }

    } else {
      // ── Smart Structural Inference for Unknown / Custom CLI Tools ─────────
      // When an unrecognized tool is typed (e.g. pulumi, ansible, custom-script),
      // infer its command -> subcommand -> flags -> arguments structure.

      results.push({
        type: "command",
        value: token,
        description: `Executable command / CLI tool: ${token}`
      });
      i++;

      let inferredSubcommand = false;
      let lastExpectingFlag = null;

      while (i < tokens.length && !PIPE_OPERATORS[tokens[i]]) {
        const t = tokens[i];

        if (t === "--") {
          results.push({
            type: "operator",
            value: "--",
            name: "End-of-Options Separator",
            description: "Signals the end of flags/options"
          });
          lastExpectingFlag = null;
          i++;
          continue;
        }

        if (t.startsWith("-")) {
          if (t.includes("=")) {
            const [fKey, ...vParts] = t.split("=");
            const fVal = vParts.join("=");
            results.push({
              type: "flag",
              value: t,
              description: `Option flag: ${fKey} (assigned value: ${fVal})`
            });
            lastExpectingFlag = null;
            i++;
            continue;
          }

          results.push({
            type: "flag",
            value: t,
            description: `Option flag for command: ${t}`
          });
          lastExpectingFlag = isFallbackValueFlag(t) ? t : null;
          i++;
          continue;
        }

        // First non-flag token after command is likely a subcommand (action)
        if (!inferredSubcommand && !lastExpectingFlag && !t.includes("/") && !t.includes(".")) {
          results.push({
            type: "subcommand",
            value: t,
            description: `Subcommand / action: ${t}`
          });
          inferredSubcommand = true;
          i++;
          continue;
        }

        // Argument / value
        let argDesc = guessArgument(t);
        if (lastExpectingFlag) {
          argDesc = `Value for flag ${lastExpectingFlag}: ${t}`;
          lastExpectingFlag = null;
        }

        results.push({
          type: "argument",
          value: t,
          description: argDesc
        });
        i++;
      }
    }
  }

  // Attach hazard scan result to the returned array
  results.hazard = hazard;
  return results;
}

/**
 * Tokenize input string preserving quoted strings, escapes, subshells $(...), and multi-char operators
 */
function tokenize(input) {
  const tokens = [];
  let current = "";
  let inQuote = null;
  let isEscaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (isEscaped) {
      current += ch;
      isEscaped = false;
      continue;
    }

    if (ch === '\\') {
      isEscaped = true;
      continue;
    }

    if (inQuote) {
      if (ch === inQuote) {
        inQuote = null;
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inQuote = ch;
      continue;
    }

    // Command substitution $( ... )
    if (ch === '$' && input[i + 1] === '(') {
      if (current) { tokens.push(current); current = ""; }
      let sub = "$(";
      let depth = 1;
      i += 2;
      while (i < input.length && depth > 0) {
        if (input[i] === '(') depth++;
        else if (input[i] === ')') depth--;
        if (depth > 0) sub += input[i];
        i++;
      }
      sub += ")";
      i--; // adjust loop increment
      tokens.push(sub);
      continue;
    }

    // Process substitution <( ... ) or >( ... )
    if ((ch === '<' || ch === '>') && input[i + 1] === '(') {
      if (current) { tokens.push(current); current = ""; }
      let sub = ch + "(";
      let depth = 1;
      i += 2;
      while (i < input.length && depth > 0) {
        if (input[i] === '(') depth++;
        else if (input[i] === ')') depth--;
        if (depth > 0) sub += input[i];
        i++;
      }
      sub += ")";
      i--;
      tokens.push(sub);
      continue;
    }

    // 4-character operators
    const fourCharOp = input.slice(i, i + 4);
    if (fourCharOp === "2>&1" || fourCharOp === "1>&2") {
      if (current) { tokens.push(current); current = ""; }
      tokens.push(fourCharOp);
      i += 3;
      continue;
    }

    // 3-character operators
    const threeCharOp = input.slice(i, i + 3);
    if (threeCharOp === "<<<") {
      if (current) { tokens.push(current); current = ""; }
      tokens.push(threeCharOp);
      i += 2;
      continue;
    }

    // 2-character operators
    const twoCharOp = input.slice(i, i + 2);
    if (["2>", "1>", "&>", ">&", "|&", ">>", "&&", "||", "<<"].includes(twoCharOp)) {
      if (current) { tokens.push(current); current = ""; }
      tokens.push(twoCharOp);
      i++;
      continue;
    }

    // 1-character operators
    if (["|", ">", "<", "&", ";"].includes(ch)) {
      if (current) { tokens.push(current); current = ""; }
      tokens.push(ch);
      continue;
    }

    // Whitespace delimiter
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      if (current) { tokens.push(current); current = ""; }
      continue;
    }

    current += ch;
  }

  if (current) tokens.push(current);
  return tokens;
}

/**
 * Dynamic decoder for chmod numeric and symbolic permission strings
 */
function decodeChmod(mode) {
  if (/^[0-7]{3,4}$/.test(mode)) {
    const octal = mode.length === 4 ? mode.slice(1) : mode;
    const labels = [
      "None (---)",
      "Execute only (--x)",
      "Write only (-w-)",
      "Write & execute (-wx)",
      "Read only (r--)",
      "Read & execute (r-x)",
      "Read & write (rw-)",
      "Read, write & execute (rwx)"
    ];
    const u = Number.parseInt(octal[0], 8);
    const g = Number.parseInt(octal[1], 8);
    const o = Number.parseInt(octal[2], 8);
    return `Owner: ${labels[u] || u}, Group: ${labels[g] || g}, Others: ${labels[o] || o}`;
  }
  if (/^[ugoa]*[+-=][rwxXst]+(,[ugoa]*[+-=][rwxXst]+)*$/.test(mode)) {
    return `Symbolic permission mode: ${mode}`;
  }
  return null;
}

/**
 * Dynamic decoder for kill signal numbers and names
 */
function decodeKillSignal(sig) {
  const map = {
    "-0": "SIGZERO — Check if process exists (does not send signal)",
    "-1": "SIGHUP — Reload configuration / Hangup",
    "-2": "SIGINT — Terminal interrupt (Ctrl+C)",
    "-3": "SIGQUIT — Terminal quit with core dump",
    "-9": "SIGKILL — Forcefully terminate process immediately (cannot be caught)",
    "-15": "SIGTERM — Gracefully terminate process (default)",
    "-18": "SIGCONT — Resume execution of stopped process",
    "-19": "SIGSTOP — Stop/pause process execution (cannot be ignored)",
    "-KILL": "SIGKILL — Forcefully terminate process immediately",
    "-TERM": "SIGTERM — Gracefully terminate process (default)",
    "-HUP": "SIGHUP — Reload process configuration",
    "-INT": "SIGINT — Terminal interrupt",
    "-STOP": "SIGSTOP — Pause process execution",
    "-CONT": "SIGCONT — Resume process execution",
    "-USR1": "SIGUSR1 — User-defined signal 1",
    "-USR2": "SIGUSR2 — User-defined signal 2"
  };
  const key = sig.toUpperCase();
  return map[key] || map[sig] || null;
}

/**
 * Smart argument guesser with pattern and heuristic recognition
 */
function guessArgument(token, cmdContext = null) {
  const t = token.replace(/^(['"])(.*)\1$/, '$2');

  // 1. JSON payload
  if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
    try {
      JSON.parse(t);
      return `JSON payload / structured data: ${t}`;
    } catch (_) {
      if (t.includes(':') || t.includes('"')) {
        return `JSON / structured payload: ${t}`;
      }
    }
  }

  // 2. Chmod permissions (only if in chmod context)
  if (cmdContext === "chmod") {
    const chmodDesc = decodeChmod(t);
    if (chmodDesc) return chmodDesc;
  }

  // 3. Command substitution: $(...) or `...`
  if (t.startsWith('$(') && t.endsWith(')')) {
    const inner = t.slice(2, -1).trim();
    return `Command substitution: $(...) — executes '${inner}' and substitutes stdout`;
  }
  if (t.startsWith('`') && t.endsWith('`')) {
    const inner = t.slice(1, -1).trim();
    return `Command substitution: \`...\` — executes '${inner}' and substitutes stdout`;
  }

  // 4. Process substitution: <(...) or >(...)
  if ((t.startsWith('<(') || t.startsWith('>(')) && t.endsWith(')')) {
    const inner = t.slice(2, -1).trim();
    return `Process substitution: ${t.slice(0, 2)}...) — passes output of '${inner}' as a file descriptor`;
  }

  // 5. Shell variables
  if (/^\$[A-Za-z_][A-Za-z0-9_]*$/.test(t) || /^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/.test(t)) {
    return `Shell variable reference: ${t}`;
  }
  if (/^\$[@*#?$!0-9-]$/.test(t)) {
    const specialVars = {
      "$?": "Exit status of last executed command",
      "$$": "Process ID (PID) of current shell",
      "$!": "Process ID (PID) of last background job",
      "$0": "Name of shell or shell script",
      "$@": "All positional parameters passed to script",
      "$*": "All positional parameters joined as single string",
      "$#": "Number of positional parameters passed"
    };
    return `Special shell parameter: ${specialVars[t] || t}`;
  }

  // 6. Environment variable assignment
  if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(t)) {
    return `Environment variable assignment: ${t}`;
  }

  // 7. Paths
  if (/^\//.test(t))  return `Absolute path: ${t}`;
  if (/^~/.test(t))   return `Home directory path: ${t}`;
  if (/^\.\.?\//.test(t)) return `Relative path: ${t}`;
  if (t === "." || t === "..") return `Relative path (${t === "." ? "current directory" : "parent directory"})`;

  // 8. Network / URLs
  if (/^https?:\/\//i.test(t)) return `Web URL: ${t}`;
  if (/^s3:\/\//i.test(t))     return `S3 bucket/object path: ${t}`;
  if (/^gs:\/\//i.test(t))     return `GCS bucket/object path: ${t}`;
  if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+(:[0-9]+)?$/.test(t)) return `IPv4 address / host:port: ${t}`;
  if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\/[0-9]{1,2}$/.test(t)) return `CIDR network block: ${t}`;
  if (/^:?\d+:\d+$/.test(t)) return `Port mapping (host:container): ${t}`;
  if (/^git@[a-zA-Z0-9.-]+:/.test(t)) return `Git SSH repository URL: ${t}`;
  if (/@/.test(t)) return `User@host address: ${t}`;

  // 9. Cryptographic key specifications
  if (/^(rsa|ec|ed25519|dsa):\d+$/i.test(t)) return `Cryptographic key specification: ${t}`;

  // 10. Git references
  if (/^HEAD(~[0-9]+|\^[0-9]*)?$/.test(t)) return `Git HEAD commit reference (${t})`;
  if (/^(origin|upstream)\/[a-zA-Z0-9._/-]+$/.test(t)) return `Remote tracking branch: ${t}`;
  if (/^[0-9a-f]{7,40}$/i.test(t)) return `Git commit SHA hash: ${t}`;
  if (t === "origin" || t === "upstream") return `Git remote repository name: ${t}`;
  if (["main", "master", "develop", "staging", "prod", "production"].includes(t)) return `Git branch name: ${t}`;

  // 11. Kubernetes resources
  const k8sMatch = t.match(/^(pods?|po|services?|svc|deployments?|deploy|namespaces?|ns|configmaps?|cm|secrets?|ingresses?|ing|statefulsets?|sts|daemonsets?|ds|jobs?|cronjobs?|nodes?|no|pvc|pv|events?)(\/[a-z0-9._-]+)?$/i);
  if (k8sMatch) {
    return `Kubernetes resource: ${t}`;
  }

  // 12. Container image references
  if (/^[a-z0-9._/-]+:[a-z0-9._-]+$/.test(t) && !t.startsWith('-')) {
    return `Container image reference: ${t}`;
  }

  // 13. Versions & Numbers
  if (/^v?\d+\.\d+(\.\d+)?(-[a-z0-9.]+)?$/i.test(t)) return `Version string: ${t}`;
  if (/^\d+$/.test(t)) {
    if (cmdContext === "kill") return `Target Process ID (PID): ${t}`;
    return `Numeric value: ${t}`;
  }

  // 14. File types
  if (/\.ya?ml$/i.test(t)) return `YAML configuration file: ${t}`;
  if (/\.json$/i.test(t)) return `JSON file: ${t}`;
  if (/\.tfvars$/i.test(t)) return `Terraform variables file: ${t}`;
  if (/\.tf$/i.test(t)) return `Terraform configuration file: ${t}`;
  if (/\.(pem|crt|cer|key|p12|pfx)$/i.test(t)) return `TLS/SSL certificate or private key: ${t}`;
  if (/\.(sh|bash|zsh)$/i.test(t)) return `Shell script: ${t}`;
  if (/\.(py)$/i.test(t)) return `Python script: ${t}`;
  if (/\.(js|mjs|cjs|ts|tsx)$/i.test(t)) return `JavaScript/TypeScript source file: ${t}`;
  if (/\.(tar|gz|bz2|xz|zip|tgz)$/i.test(t)) return `Archive file: ${t}`;
  if (/\.log$/i.test(t)) return `Log file: ${t}`;
  if (/\.(conf|ini|cfg)$/i.test(t)) return `Configuration file: ${t}`;
  if (/\.(sql)$/i.test(t)) return `SQL database script: ${t}`;
  if (/\.(csv|tsv)$/i.test(t)) return `Tabular data file: ${t}`;
  if (/\.(md|markdown)$/i.test(t)) return `Markdown document: ${t}`;
  if (/\./.test(t)) return `File or path: ${t}`;

  // 15. Glob / wildcards
  if (/[*?]/.test(t) || (/\{[^{}]*,[^{}]*\}/.test(t))) return `Glob / wildcard pattern: ${t}`;

  return `Argument: ${t}`;
}

/**
 * Scan for dangerous or destructive terminal commands
 */
function scanHazards(raw) {
  const lower = raw.toLowerCase().trim();

  // Root or broad deletion
  if (/rm\s+-(?:r|f)*rf?\s+(\/\s*|\/\*|\.\s*|\.\/\*)/i.test(raw)) {
    return {
      severity: "danger",
      title: "Extremely Destructive Command",
      message: "This command forcibly and recursively deletes system root or current directory files without confirmation."
    };
  }

  // Fork bomb
  if (lower.includes(":(){ :|:& };:") || lower.includes(":(){:|:&};:")) {
    return {
      severity: "danger",
      title: "Fork Bomb Detected",
      message: "This shell function creates an infinite cascade of child processes that will exhaust system memory and freeze the machine."
    };
  }

  // Raw disk writing
  if (/dd\b[^;\n|&]*\bof=\/dev\/(sd[a-z]|nvme\d|hd[a-z]|disk\d)/i.test(raw)) {
    return {
      severity: "danger",
      title: "Direct Disk Overwrite",
      message: "Writing raw data directly to a block device (/dev/sd*) will destroy partition tables and erase existing filesystem data."
    };
  }

  // Recursive 777 permissions on system dirs
  if (/chmod\s+(-r\s+)?777\s+(\/|\/var|\/etc|\/usr|\/home)/i.test(raw)) {
    return {
      severity: "warning",
      title: "Security Risk: Universal Write Permissions",
      message: "Granting 777 permissions recursively to system directories allows any user or process to overwrite critical security files."
    };
  }

  // Git force push
  if (/git\s+push\b[^;\n|&]*\b(--force|-f\b|--force-with-lease)/i.test(raw)) {
    return {
      severity: "warning",
      title: "History Rewrite: Force Push",
      message: "Force pushing overwrites remote branch history. Any remote commits not present in your local branch will be permanently lost."
    };
  }

  // Git hard reset
  if (/git\s+reset\s+--hard/i.test(raw)) {
    return {
      severity: "warning",
      title: "Uncommitted Changes Discarded",
      message: "A hard reset discards all uncommitted modifications in the working tree and resets staged changes to the target commit."
    };
  }

  // Mass Kubernetes deletion
  if (/kubectl\s+delete\s+(all\s+--all|ns|namespace)/i.test(raw)) {
    return {
      severity: "warning",
      title: "Cluster Resource Deletion",
      message: "Deleting all resources or an entire namespace permanently destroys deployments, pods, services, and associated config maps."
    };
  }

  // Terraform destroy
  if (/terraform\s+destroy(\s+-auto-approve)?/i.test(raw)) {
    return {
      severity: "warning",
      title: "Infrastructure Teardown",
      message: "Terraform destroy will terminate all cloud resources managed by this configuration."
    };
  }

  return null;
}

// Node export compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initParser,
    parseCommand,
    tokenize,
    guessArgument,
    scanHazards,
    decodeChmod,
    decodeKillSignal,
    resolveFlagMeta
  };
}
