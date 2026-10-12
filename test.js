/**
 * Test Suite for Terminal Decoder
 * Tests tokenization, parsing, flag expansion, and hazard scanning
 */

const fs = require('fs');
const assert = require('assert');
const path = require('path');

// Mock browser environment for parser module
const commandsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'commands.json'), 'utf8'));
global.window = { COMMAND_DATA: commandsData };

const parser = require('./parser.js');
const { parseCommand, tokenize, scanHazards, decodeChmod, decodeKillSignal } = parser;

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('Running Terminal Decoder Test Suite...\n');

// 1. Tokenizer Tests
console.log('1. Tokenizer:');
it('should split simple command with arguments', () => {
  const tokens = tokenize('ls -la /var/log');
  assert.deepStrictEqual(tokens, ['ls', '-la', '/var/log']);
});

it('should preserve double quoted arguments with spaces', () => {
  const tokens = tokenize('git commit -m "feat: added new feature"');
  assert.deepStrictEqual(tokens, ['git', 'commit', '-m', 'feat: added new feature']);
});

it('should preserve single quoted arguments with spaces', () => {
  const tokens = tokenize("grep -rn 'error message' /var/log");
  assert.deepStrictEqual(tokens, ['grep', '-rn', 'error message', '/var/log']);
});

it('should handle escaped quotes properly', () => {
  const tokens = tokenize('echo "He said \\"hello\\""');
  assert.deepStrictEqual(tokens, ['echo', 'He said "hello"']);
});

it('should tokenize redirection and pipe operators correctly', () => {
  const tokens = tokenize('cat file.txt | grep error >> errors.log 2>&1');
  assert.deepStrictEqual(tokens, ['cat', 'file.txt', '|', 'grep', 'error', '>>', 'errors.log', '2>&1']);
});

// 2. Chmod & Kill Decoders
console.log('\n2. Dynamic Decoders:');
it('should decode octal chmod permissions 755', () => {
  const desc = decodeChmod('755');
  assert(desc.includes('Owner: Read, write & execute (rwx)'));
  assert(desc.includes('Group: Read & execute (r-x)'));
});

it('should decode symbolic chmod permissions +x', () => {
  const desc = decodeChmod('+x');
  assert.strictEqual(desc, 'Symbolic permission mode: +x');
});

it('should decode kill -9 as SIGKILL', () => {
  const desc = decodeKillSignal('-9');
  assert(desc.includes('SIGKILL'));
});

it('should decode kill -TERM by name', () => {
  const desc = decodeKillSignal('-TERM');
  assert(desc.includes('SIGTERM'));
});

// 3. Command & Wrapper Parsing
console.log('\n3. Command & Wrapper Parsing:');
it('should handle sudo privilege wrapper and parse target command', () => {
  const results = parseCommand('sudo systemctl status nginx');
  assert.strictEqual(results[0].type, 'command');
  assert.strictEqual(results[0].value, 'sudo');
  assert.strictEqual(results[1].type, 'command');
  assert.strictEqual(results[1].value, 'systemctl');
  assert.strictEqual(results[2].type, 'subcommand');
  assert.strictEqual(results[2].value, 'status');
});

it('should detect leading environment variable assignments', () => {
  const results = parseCommand('NODE_ENV=production npm run build');
  assert.strictEqual(results[0].type, 'env_var');
  assert.strictEqual(results[0].value, 'NODE_ENV=production');
  assert.strictEqual(results[1].type, 'command');
  assert.strictEqual(results[1].value, 'npm');
});

it('should parse compound subcommands like rollout restart', () => {
  const results = parseCommand('kubectl rollout restart deployment/web');
  assert.strictEqual(results[0].value, 'kubectl');
  assert.strictEqual(results[1].type, 'subcommand');
  assert.strictEqual(results[1].value, 'rollout restart');
  assert.strictEqual(results[2].type, 'argument');
});

it('should pair flag values with their flags', () => {
  const results = parseCommand('kubectl get pods -n kube-system');
  const nFlag = results.find(r => r.value === '-n');
  const val = results.find(r => r.value === 'kube-system');
  assert(nFlag);
  assert(val.description.toLowerCase().includes('value for flag -n') || val.description.includes('-n'));
});

it('should expand combined POSIX short flags', () => {
  const results = parseCommand('tar -czvf backup.tar.gz ./src');
  const flag = results.find(r => r.value === '-czvf');
  assert(flag);
  assert(flag.parts && flag.parts.length === 4);
});

it('should scope flags per subcommand (git commit -m vs git branch -m)', () => {
  const rCommit = parseCommand('git commit -m "my commit"');
  const commitM = rCommit.find(r => r.value === '-m');
  assert(commitM);
  assert(commitM.description.includes('Commit message'));

  const rBranch = parseCommand('git branch -m new-feature');
  const branchM = rBranch.find(r => r.value === '-m');
  assert(branchM);
  assert(branchM.description.toLowerCase().includes('move') || branchM.description.toLowerCase().includes('rename'));
});

it('should tokenize command substitutions $(...) without splitting internal pipelines', () => {
  const results = parseCommand('echo $(cat /var/log/syslog | grep error)');
  assert.strictEqual(results[0].value, 'echo');
  assert.strictEqual(results[1].type, 'argument');
  assert.strictEqual(results[1].value, '$(cat /var/log/syslog | grep error)');
  assert(results[1].description.includes('Command substitution'));
});

it('should infer structure for unknown CLI tools', () => {
  const results = parseCommand('pulumi up --stack dev -y');
  assert.strictEqual(results[0].type, 'command');
  assert.strictEqual(results[0].value, 'pulumi');
  assert.strictEqual(results[1].type, 'subcommand');
  assert.strictEqual(results[1].value, 'up');
  assert.strictEqual(results[2].type, 'flag');
  assert.strictEqual(results[2].value, '--stack');
  assert.strictEqual(results[3].type, 'argument');
  assert(results[3].description.includes('Value for flag --stack'));
  assert.strictEqual(results[4].type, 'flag');
  assert.strictEqual(results[4].value, '-y');
});

// 4. Hazard Scanner
console.log('\n4. Hazard / Safety Scanner:');
it('should flag rm -rf / as dangerous', () => {
  const hazard = scanHazards('rm -rf /');
  assert(hazard);
  assert.strictEqual(hazard.severity, 'danger');
});

it('should flag fork bomb as dangerous', () => {
  const hazard = scanHazards(':(){ :|:& };:');
  assert(hazard);
  assert.strictEqual(hazard.severity, 'danger');
});

it('should flag git reset --hard with warning', () => {
  const hazard = scanHazards('git reset --hard HEAD~1');
  assert(hazard);
  assert.strictEqual(hazard.severity, 'warning');
});

// 5. Built-in Examples Verification
console.log('\n5. Built-in Examples Coverage:');
it('should parse all built-in examples with zero fallback flags', () => {
  const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  const match = appCode.match(/const TOOL_EXAMPLES = (\{[\s\S]*?\n\};)/);
  assert(match, 'Could not find TOOL_EXAMPLES in app.js');
  let TOOL_EXAMPLES;
  eval('TOOL_EXAMPLES = ' + match[1]);

  let missingFlags = 0;
  for (const [cat, list] of Object.entries(TOOL_EXAMPLES)) {
    for (const ex of list) {
      const results = parseCommand(ex.cmd);
      results.forEach(r => {
        if (r.type === 'flag' && r.description && r.description.includes('check official docs for details')) {
          console.error(`Missing flag in ${ex.cmd}: ${r.value}`);
          missingFlags++;
        }
      });
    }
  }
  assert.strictEqual(missingFlags, 0, `Found ${missingFlags} missing/fallback flags in built-in examples`);
});

console.log(`\nTest results: ${passed}/${total} passed.\n`);
if (passed !== total) {
  process.exit(1);
}
