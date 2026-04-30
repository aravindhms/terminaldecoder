/**
 * Parser module for Terminal Decoder
 * Handles tokenization and command analysis
 */

window.COMMAND_DATA = null;

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

    // Check for operator/pipe
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

    // Check if this is a known command
    const cmdKey = token.toLowerCase();
    if (COMMANDS[cmdKey]) {
      const cmd = COMMANDS[cmdKey];
      const tool = cmd.tool || "unix";
      results.push({
        type: "command",
        value: token,
        tool,
        description: cmd.description
      });
      i++;

      // Parse subcommands, flags, and arguments
      while (i < tokens.length && !PIPE_OPERATORS[tokens[i]]) {
        const t = tokens[i];

        if (t.startsWith("-")) {
          // Combined short flags (-la): one card, lines inside
          if (!t.startsWith("--") && t.length > 2) {
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
          } else {
            results.push({ type: "flag", tool, value: t, description: explainFlag(cmdKey, t) });
          }
        } else if (cmd.flags && cmd.flags[t]) {
          results.push({ type: "subcommand", tool, value: t, description: cmd.flags[t] });
        } else {
          results.push({ type: "argument", tool, value: t, description: guessArgument(t) });
        }
        i++;
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

function explainFlag(cmd, flag) {
  if (!window.COMMAND_DATA) return "Option flag";
  const cmdData = window.COMMAND_DATA.commands[cmd];
  if (!cmdData) return "Option flag for the command";
  if (cmdData.flags[flag]) return cmdData.flags[flag];
  return `Flag for ${cmd} — check official docs for details`;
}

function guessArgument(token) {
  // Paths
  if (/^\//.test(token)) return `Absolute path: ${token}`;
  if (/^~/.test(token)) return `Home directory path: ${token}`;
  // IP addresses
  if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+(:[0-9]+)?$/.test(token)) return `IPv4 address / host:port: ${token}`;
  // Port mappings like 8080:80 or :8080
  if (/^:?\d+:\d+$/.test(token)) return `Port mapping (host:container): ${token}`;
  // Environment variable assignment KEY=VALUE
  if (/^[A-Z_][A-Z0-9_]*=/.test(token)) return `Environment variable assignment: ${token}`;
  // Container image reference
  if (/^[a-z0-9._/-]+:[a-z0-9._-]+$/.test(token) && !token.startsWith('-')) return `Container image reference: ${token}`;
  // Version strings
  if (/^v?\d+\.\d+(\.\d+)?(-[a-z0-9.]+)?$/.test(token)) return `Version string: ${token}`;
  // Glob patterns
  if (/[*?{}]/.test(token)) return `Glob / wildcard pattern: ${token}`;
  // User@host
  if (/@/.test(token)) return `User@host address: ${token}`;
  // Numeric value
  if (/^\d+$/.test(token)) return `Numeric value: ${token}`;
  // File extensions
  if (/\.ya?ml$/.test(token)) return `YAML file: ${token}`;
  if (/\.json$/.test(token)) return `JSON file: ${token}`;
  if (/\.tfvars$/.test(token)) return `Terraform variables file: ${token}`;
  if (/\.tf$/.test(token)) return `Terraform configuration file: ${token}`;
  if (/\.(pem|crt|cer|key|p12|pfx)$/.test(token)) return `TLS/SSL certificate or key file: ${token}`;
  if (/\.(sh|bash|zsh)$/.test(token)) return `Shell script: ${token}`;
  if (/\.(tar|gz|bz2|xz|zip|tgz)$/.test(token)) return `Archive file: ${token}`;
  if (/\.log$/.test(token)) return `Log file: ${token}`;
  if (/\.conf$|.ini$|.cfg$/.test(token)) return `Configuration file: ${token}`;
  if (/\./.test(token)) return `File or path: ${token}`;
  return `Argument: ${token}`;
}

function tokenize(input) {
  const tokens = [];
  let current = "";
  let inQuote = null;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inQuote) {
      if (ch === inQuote) { inQuote = null; current += ch; }
      else { current += ch; }
      continue;
    }

    if (ch === '"' || ch === "'") { inQuote = ch; current += ch; continue; }

    const three = input.slice(i, i + 4);
    if (three === "2>&1") {
      if (current) { tokens.push(current); current = ""; }
      tokens.push("2>&1"); i += 3; continue;
    }
    const pair = input.slice(i, i + 2);
    if ([">>", "&&", "||", "2>"].includes(pair)) {
      if (current) { tokens.push(current); current = ""; }
      tokens.push(pair); i++; continue;
    }

    if (["|", ">", "<", "&", ";"].includes(ch)) {
      if (current) { tokens.push(current); current = ""; }
      tokens.push(ch); continue;
    }

    if (ch === " " || ch === "\t") {
      if (current) { tokens.push(current); current = ""; }
      continue;
    }

    current += ch;
  }

  if (current) tokens.push(current);
  return tokens;
}
