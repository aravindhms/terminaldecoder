// ── Tool categories & example chips ─────────────────────────────────────────
const TOOL_CATEGORIES = [
  { id: "all",        label: "All Tools",     icon: "⬡" },
  { id: "unix",       label: "Unix & Sudo",   icon: "🐧" },
  { id: "git",        label: "Git & GitHub",  icon: "⑂" },
  { id: "docker",     label: "Docker",        icon: "🐳" },
  { id: "kubernetes", label: "Kubernetes",    icon: "☸" },
  { id: "terraform",  label: "Terraform",     icon: "◈" },
  { id: "aws",        label: "AWS",           icon: "☁" },
  { id: "azure",      label: "Azure",         icon: "△" },
  { id: "gcloud",     label: "GCloud",        icon: "◎" },
  { id: "npm",        label: "npm / Bun",     icon: "⬡" },
  { id: "python",     label: "Python & Pip",  icon: "🐍" },
  { id: "systemctl",  label: "systemctl",     icon: "⚙" },
  { id: "jq",         label: "jq",            icon: "{}" },
  { id: "openssl",    label: "openssl",       icon: "🔐" }
];

const TOOL_EXAMPLES = {
  all: [
    { cmd: "sudo systemctl restart nginx",                 label: "sudo systemctl …" },
    { cmd: "docker run -d -p 8080:80 --name web nginx",    label: "docker run -p …" },
    { cmd: "git commit -am 'fix: patch null check'",       label: "git commit -am …" },
    { cmd: "kubectl get pods -n kube-system -o wide",      label: "kubectl get pods" },
    { cmd: "terraform apply -auto-approve",                label: "terraform apply" },
    { cmd: "NODE_ENV=production npm run build",            label: "NODE_ENV=… npm" },
    { cmd: "python3 -m venv .venv",                        label: "python3 -m venv" },
    { cmd: "curl -X POST https://api.example.com -d '{\"id\": 1}'", label: "curl -X POST …" },
    { cmd: "jq '.items[] | select(.status==\"active\")'",  label: "jq select …" },
    { cmd: "openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -days 365", label: "openssl req …" }
  ],
  unix: [
    { cmd: "sudo systemctl status nginx",                  label: "sudo status nginx" },
    { cmd: "ls -la /var/log",                              label: "ls -la /var/log" },
    { cmd: "grep -rn 'error' /var/log | head -n 20",       label: "grep -rn … | head" },
    { cmd: "tar czvf backup.tar.gz ./src",                 label: "tar czvf backup" },
    { cmd: "chmod 755 /var/www/html",                      label: "chmod 755 …" },
    { cmd: "chmod +x script.sh",                           label: "chmod +x …" },
    { cmd: "find / -name '*.conf' -type f -maxdepth 3",    label: "find / -name …" },
    { cmd: "ps aux | grep nginx | awk '{print $2}'",       label: "ps aux | grep …" },
    { cmd: "rsync -avz --delete /src/ user@host:/dst/",    label: "rsync -avz …" },
    { cmd: "kill -9 1234",                                 label: "kill -9 1234" },
    { cmd: "journalctl -u nginx -f -n 100",                label: "journalctl -u …" },
    { cmd: "ss -tlnp",                                     label: "ss -tlnp" }
  ],
  git: [
    { cmd: "git commit -am 'fix: patch null check'",       label: "git commit -am …" },
    { cmd: "git push -u origin main",                      label: "git push -u …" },
    { cmd: "git switch -c feature/new-ui",                 label: "git switch -c …" },
    { cmd: "git restore --staged file.txt",                label: "git restore …" },
    { cmd: "git log --oneline --graph --all",              label: "git log --graph" },
    { cmd: "git stash pop",                                label: "git stash pop" },
    { cmd: "git rebase -i HEAD~3",                         label: "git rebase -i …" },
    { cmd: "git reset --hard HEAD~1",                      label: "git reset --hard" },
    { cmd: "gh pr create --title 'Fix typo' --web",        label: "gh pr create …" }
  ],
  docker: [
    { cmd: "docker run -d -p 8080:80 --name web nginx:latest", label: "docker run -p …" },
    { cmd: "docker compose up -d --build",                 label: "docker compose up" },
    { cmd: "docker system prune -af --volumes",            label: "docker prune -af" },
    { cmd: "docker build -t myapp:latest .",               label: "docker build -t" },
    { cmd: "docker exec -it web bash",                     label: "docker exec -it" },
    { cmd: "docker logs --tail 100 -f web",                label: "docker logs -f" }
  ],
  kubernetes: [
    { cmd: "kubectl get pods -n kube-system -o wide",      label: "kubectl get pods" },
    { cmd: "kubectl apply -f deployment.yaml",             label: "kubectl apply -f" },
    { cmd: "kubectl rollout restart deployment/web",       label: "rollout restart" },
    { cmd: "kubectl exec -it web-pod -- bash",             label: "kubectl exec -- bash" },
    { cmd: "kubectl scale deployment web --replicas=3",    label: "scale --replicas=3" },
    { cmd: "kubectl port-forward svc/web 8080:80",         label: "port-forward 8080" },
    { cmd: "helm upgrade --install my-app ./chart -n prod", label: "helm upgrade …" }
  ],
  terraform: [
    { cmd: "terraform init -upgrade",                      label: "terraform init …" },
    { cmd: "terraform plan -out=tfplan",                   label: "terraform plan -out" },
    { cmd: "terraform apply -auto-approve",                label: "terraform apply" },
    { cmd: "terraform apply -var-file=prod.tfvars",        label: "terraform -var-file" },
    { cmd: "terraform destroy -target=aws_instance.web",   label: "terraform destroy …" },
    { cmd: "terraform workspace select prod",              label: "workspace select" },
    { cmd: "terraform state list",                         label: "state list" },
    { cmd: "terraform fmt -recursive",                     label: "fmt -recursive" }
  ],
  aws: [
    { cmd: "aws s3 ls s3://my-bucket --recursive",                              label: "s3 ls bucket" },
    { cmd: "aws s3 sync ./dist s3://my-bucket --delete",                        label: "s3 sync --delete" },
    { cmd: "aws ec2 describe-instances --region us-east-1 --output table",      label: "ec2 instances" },
    { cmd: "aws ecs list-tasks --cluster prod-cluster",                         label: "ecs tasks" },
    { cmd: "aws eks update-kubeconfig --name my-cluster --region us-east-1",    label: "eks kubeconfig" },
    { cmd: "aws sts get-caller-identity",                                        label: "sts identity" },
    { cmd: "aws logs tail /aws/lambda/my-fn --follow",                          label: "logs tail -f" },
    { cmd: "aws secretsmanager get-secret-value --secret-id prod/db/password",  label: "get secret" }
  ],
  azure: [
    { cmd: "az login",                                                           label: "az login" },
    { cmd: "az group list --output table",                                       label: "group list" },
    { cmd: "az vm list -g my-rg --output table",                                label: "vm list -g" },
    { cmd: "az aks get-credentials -g my-rg -n my-cluster",                     label: "aks credentials" },
    { cmd: "az storage blob upload -f app.zip --account-name mystore -c builds", label: "blob upload" },
    { cmd: "az webapp restart -g my-rg -n my-webapp",                           label: "webapp restart" },
    { cmd: "az keyvault secret show --vault-name my-kv --name db-password",     label: "keyvault secret" },
    { cmd: "az acr build --registry myregistry --image app:latest .",           label: "acr build" }
  ],
  gcloud: [
    { cmd: "gcloud auth login",                                                  label: "auth login" },
    { cmd: "gcloud config set project my-project-id",                           label: "set project" },
    { cmd: "gcloud compute instances list --format=table",                      label: "instances list" },
    { cmd: "gcloud container clusters get-credentials my-cluster --region us-central1", label: "gke credentials" },
    { cmd: "gcloud run deploy my-svc --image gcr.io/proj/app:latest --region us-central1", label: "cloud run deploy" },
    { cmd: "gcloud functions deploy my-fn --runtime nodejs20 --trigger-http",   label: "functions deploy" },
    { cmd: "gcloud storage ls gs://my-bucket",                                  label: "storage ls" },
    { cmd: "gcloud logging read 'severity>=ERROR' --limit 50 --format=json",    label: "logging read" }
  ],
  npm: [
    { cmd: "NODE_ENV=production npm run build",            label: "NODE_ENV=… npm" },
    { cmd: "npm install --save-dev typescript",            label: "npm install -D" },
    { cmd: "npm audit fix",                                label: "npm audit fix" },
    { cmd: "npm publish --access public",                  label: "npm publish …" },
    { cmd: "pnpm add -D eslint @typescript-eslint/parser", label: "pnpm add -D" },
    { cmd: "bun run build --watch",                        label: "bun run --watch" }
  ],
  python: [
    { cmd: "python3 -m venv .venv",                        label: "python3 -m venv" },
    { cmd: "pip install -r requirements.txt --upgrade",    label: "pip install -r …" },
    { cmd: "python -m http.server 8080",                   label: "http.server 8080" },
    { cmd: "pip list --outdated",                          label: "pip list outdated" }
  ],
  systemctl: [
    { cmd: "systemctl status nginx",                       label: "systemctl status" },
    { cmd: "systemctl enable nginx --now",                 label: "enable --now" },
    { cmd: "systemctl restart nginx",                      label: "restart nginx" },
    { cmd: "systemctl daemon-reload",                      label: "daemon-reload" },
    { cmd: "systemctl list-units --failed",                label: "list failed units" },
    { cmd: "systemctl disable --now snapd",                label: "disable snapd" }
  ],
  jq: [
    { cmd: "jq '.' data.json",                             label: "jq pretty-print" },
    { cmd: "jq '.items[] | .name' data.json",              label: "jq extract" },
    { cmd: "jq -r '.[] | select(.active==true) | .id'",   label: "jq select -r" },
    { cmd: "jq -c 'map({name,id})' data.json",             label: "jq map -c" },
    { cmd: "jq 'group_by(.status)' data.json",             label: "jq group_by" },
    { cmd: "jq --arg env prod '.envs[$env]' config.json",  label: "jq --arg env" }
  ],
  openssl: [
    { cmd: "openssl genrsa -out key.pem 4096",             label: "genrsa 4096" },
    { cmd: "openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -days 365", label: "self-signed cert" },
    { cmd: "openssl x509 -in cert.pem -text -noout",       label: "inspect cert" },
    { cmd: "openssl s_client -connect example.com:443 -servername example.com", label: "s_client TLS" },
    { cmd: "openssl dgst -sha256 -sign key.pem file.txt",  label: "dgst sign" },
    { cmd: "openssl verify -CAfile ca.pem cert.pem",       label: "verify cert" }
  ]
};

// ── App state & DOM cache ──────────────────────────────────────────────────
let activeTool = "all";
const DOM = {};

// ── Theme management ────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('td_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  setTheme(theme);

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('td_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'light' ? '#f8fafc' : '#0d0f14');
  }
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'light' ? '☀️' : '🌙';
    }
    toggleBtn.setAttribute('title', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    toggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem('td_theme', next);
  setTheme(next);
}

// Initialize the application
async function init() {
  initTheme();

  DOM.input          = document.getElementById('command-input');
  DOM.results        = document.getElementById('results');
  DOM.btnExplain     = document.getElementById('btn-explain');
  DOM.btnClear       = document.getElementById('btn-clear');
  DOM.pillBar        = document.getElementById('tool-pill-bar');
  DOM.chipsWrap      = document.getElementById('example-chips');
  DOM.recentsSection = document.getElementById('recents-section');
  DOM.recentChips    = document.getElementById('recent-chips');
  DOM.logoReset      = document.getElementById('logo-reset');
  DOM.themeToggle    = document.getElementById('theme-toggle');

  const loaded = await initParser();
  if (!loaded) {
    DOM.results.innerHTML = `<div class="error-msg">Error: Could not load command database. Make sure commands.json exists.</div>`;
    return;
  }

  renderToolPills();
  renderExampleChips();
  renderRecentChips();
  attachEventListeners();

  // Check URL query parameter (?cmd=...)
  const urlParams = new URLSearchParams(window.location.search);
  const queryCmd = urlParams.get('cmd');
  if (queryCmd && queryCmd.trim()) {
    DOM.input.value = queryCmd.trim();
    explain();
  } else {
    DOM.results.innerHTML = getWelcomeHTML();
    DOM.input.focus();
  }
}

function renderToolPills() {
  DOM.pillBar.innerHTML = '';
  TOOL_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'tool-pill' + (cat.id === activeTool ? ' active' : '');
    btn.dataset.tool = cat.id;
    btn.innerHTML = `<span class="pill-icon">${cat.icon}</span>${cat.label}`;
    btn.addEventListener('click', () => {
      activeTool = cat.id;
      document.querySelectorAll('.tool-pill').forEach(p => p.classList.toggle('active', p.dataset.tool === cat.id));
      renderExampleChips();
    });
    DOM.pillBar.appendChild(btn);
  });
}

function renderExampleChips() {
  const examples = TOOL_EXAMPLES[activeTool] || TOOL_EXAMPLES.all;
  DOM.chipsWrap.innerHTML = '';
  examples.forEach(ex => {
    const btn = document.createElement('button');
    btn.className = 'example-chip';
    btn.dataset.cmd = ex.cmd;
    btn.textContent = ex.label;
    btn.title = ex.cmd;
    btn.addEventListener('click', () => {
      DOM.input.value = ex.cmd;
      explain();
    });
    DOM.chipsWrap.appendChild(btn);
  });
}

// ── Recent commands management ─────────────────────────────────────────────
function getRecents() {
  try {
    const raw = localStorage.getItem('td_recents');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveRecent(cmd) {
  if (!cmd || cmd.length < 3) return;
  try {
    let recents = getRecents().filter(c => c !== cmd);
    recents.unshift(cmd);
    if (recents.length > 5) recents = recents.slice(0, 5);
    localStorage.setItem('td_recents', JSON.stringify(recents));
    renderRecentChips();
  } catch (_) {}
}

function renderRecentChips() {
  const recents = getRecents();
  if (!DOM.recentsSection || !DOM.recentChips) return;

  if (!recents.length) {
    DOM.recentsSection.style.display = 'none';
    DOM.recentChips.innerHTML = '';
    return;
  }

  DOM.recentsSection.style.display = 'flex';
  DOM.recentChips.innerHTML = '';
  recents.forEach(cmd => {
    const btn = document.createElement('button');
    btn.className = 'recent-chip';
    btn.textContent = cmd.length > 30 ? cmd.slice(0, 27) + '…' : cmd;
    btn.title = cmd;
    btn.addEventListener('click', () => {
      DOM.input.value = cmd;
      explain();
    });
    DOM.recentChips.appendChild(btn);
  });
}

function attachEventListeners() {
  if (DOM.themeToggle) {
    DOM.themeToggle.addEventListener('click', toggleTheme);
  }
  DOM.btnExplain.addEventListener('click', explain);
  DOM.btnClear.addEventListener('click', resetApp);
  DOM.logoReset.addEventListener('click', resetApp);
  DOM.logoReset.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      resetApp();
    }
  });

  DOM.input.addEventListener('keydown', e => {
    if (e.key === 'Enter') explain();
    if (e.key === 'Escape') resetApp();
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== DOM.input) {
      e.preventDefault();
      DOM.input.focus();
      DOM.input.select();
    }
  });
}

function resetApp() {
  DOM.input.value = '';
  activeTool = "all";
  renderToolPills();
  renderExampleChips();
  DOM.results.innerHTML = getWelcomeHTML();

  // Clear query param in URL
  if (window.history.replaceState) {
    const url = new URL(window.location);
    url.searchParams.delete('cmd');
    window.history.replaceState({}, '', url.pathname);
  }

  DOM.input.focus();
}

// ── Core explain ─────────────────────────────────────────────────────
function explain() {
  const raw = DOM.input.value.trim();
  if (!raw) return;

  // Save to recents
  saveRecent(raw);

  // Update URL query param (?cmd=...)
  if (window.history.replaceState) {
    const url = new URL(window.location);
    url.searchParams.set('cmd', raw);
    window.history.replaceState({}, '', url);
  }

  const parsed = parseCommand(raw);
  if (!parsed.length) {
    DOM.results.innerHTML = `<div class="error-msg">Could not parse the command. Please check your syntax and try again.</div>`;
    return;
  }
  renderResults(raw, parsed);
}

// ── Tool color helper ─────────────────────────────────────────────────
function getToolColor(tool) {
  const map = {
    unix: '#68d391',
    git: '#f6ad55',
    docker: '#63b3ed',
    kubernetes: '#9f7aea',
    terraform: '#a78bfa',
    aws: '#f6e05e',
    azure: '#63b3ed',
    gcloud: '#fc8181',
    npm: '#fc8181',
    systemctl: '#9ae6b4',
    jq: '#feb2d9',
    openssl: '#f6ad55',
    python: '#68d391'
  };
  return map[tool] || 'var(--accent)';
}

// ── Docs link helper ──────────────────────────────────────────────────
const MAN8 = new Set(['ip','ss','mount','umount','fdisk','ifconfig','iptables','sysctl','insmod','rmmod','chroot','service']);

function getDocsLink(cmd, tool, parsedTokens = []) {
  const v = cmd.toLowerCase();

  if (tool === 'unix' || tool === 'systemctl') {
    const sec = MAN8.has(v) ? 8 : 1;
    return { url: `https://man7.org/linux/man-pages/man${sec}/${v}.${sec}.html`, label: `${v} man page` };
  }

  if (tool === 'git') {
    // If command has a known Git subcommand, deep link directly
    const sub = parsedTokens.find(p => p.type === 'subcommand' && p.value);
    if (sub && sub.value && !sub.value.includes(' ')) {
      return { url: `https://git-scm.com/docs/git-${sub.value.toLowerCase()}`, label: `git ${sub.value} docs` };
    }
    return { url: `https://git-scm.com/docs/git`, label: 'Git docs' };
  }

  if (tool === 'docker') {
    const sub = parsedTokens.find(p => p.type === 'subcommand' && p.value);
    if (sub && sub.value === 'compose') {
      return { url: `https://docs.docker.com/compose/reference/`, label: 'Docker Compose docs' };
    }
    return { url: `https://docs.docker.com/reference/cli/docker/`, label: 'Docker docs' };
  }

  if (tool === 'kubernetes') {
    return { url: `https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands/`, label: 'kubectl docs' };
  }

  if (tool === 'terraform') {
    return { url: `https://developer.hashicorp.com/terraform/cli/commands`, label: 'Terraform docs' };
  }

  if (tool === 'aws') {
    return { url: `https://awscli.amazonaws.com/v2/documentation/api/latest/index.html`, label: 'AWS CLI reference' };
  }

  if (tool === 'azure') {
    return { url: `https://learn.microsoft.com/en-us/cli/azure/reference-index`, label: 'Azure CLI reference' };
  }

  if (tool === 'gcloud') {
    return { url: `https://cloud.google.com/sdk/gcloud/reference`, label: 'gcloud reference' };
  }

  if (tool === 'npm') {
    return { url: `https://docs.npmjs.com/cli/commands/npm-${v}`, label: `npm ${v} docs` };
  }

  if (tool === 'jq') {
    return { url: `https://jqlang.github.io/jq/manual/`, label: 'jq manual' };
  }

  if (tool === 'openssl') {
    return { url: `https://www.openssl.org/docs/manmaster/man1/${v}.html`, label: `OpenSSL ${v} docs` };
  }

  if (v === 'python' || v === 'python3') {
    return { url: `https://docs.python.org/3/using/cmdline.html`, label: 'Python CLI docs' };
  }

  if (v === 'pip' || v === 'pip3') {
    return { url: `https://pip.pypa.io/en/stable/cli/pip/`, label: 'pip documentation' };
  }

  if (v === 'node') {
    return { url: `https://nodejs.org/api/cli.html`, label: 'Node.js CLI docs' };
  }

  if (v === 'cargo') {
    return { url: `https://doc.rust-lang.org/cargo/commands/index.html`, label: 'Cargo docs' };
  }

  if (v === 'helm') {
    return { url: `https://helm.sh/docs/helm/`, label: 'Helm docs' };
  }

  if (v === 'gh') {
    return { url: `https://cli.github.com/manual/`, label: 'GitHub CLI docs' };
  }

  return null;
}

// ── Render results ────────────────────────────────────────────────────
function renderResults(raw, parsed) {
  const legendColors = {
    command: 'var(--accent)',
    flag: 'var(--green)',
    argument: 'var(--orange)',
    operator: 'var(--yellow)',
    subcommand: 'var(--pink)',
    env_var: 'var(--purple)'
  };

  const legendLabels = {
    command: 'Command',
    flag: 'Flag / Option',
    argument: 'Argument / Value',
    operator: 'Operator',
    subcommand: 'Subcommand',
    env_var: 'Environment Var'
  };

  // Hazard Alert Banner
  let hazardHTML = '';
  if (parsed.hazard) {
    const isDanger = parsed.hazard.severity === 'danger';
    hazardHTML = `
      <div class="hazard-banner ${parsed.hazard.severity}" role="alert">
        <div class="hazard-icon">${isDanger ? '🚨' : '⚠️'}</div>
        <div class="hazard-content">
          <div class="hazard-title">${escHtml(parsed.hazard.title)}</div>
          <div class="hazard-desc">${escHtml(parsed.hazard.message)}</div>
        </div>
      </div>
    `;
  }

  // Token Bar
  const tokenSpans = parsed.map((p, i) =>
    `<span class="token ${p.type}" data-index="${i}" id="token-${i}">${escHtml(p.value)}</span>`
  ).join(' ');

  // Legend
  const types = [...new Set(parsed.map(p => p.type))];
  const legendHTML = types.map(t =>
    `<div class="legend-item">
      <div class="legend-dot" style="background:${legendColors[t] || 'var(--accent)'}"></div>
      <span>${legendLabels[t] || t}</span>
    </div>`
  ).join('');

  // Cards
  const cardsHTML = parsed.map((part, i) => {
    const typeBadge = legendLabels[part.type] || part.type;
    const toolColor = part.tool ? getToolColor(part.tool) : null;
    const toolBadge = part.tool
      ? `<span class="tool-badge" style="--tb-color: ${toolColor}">${escHtml(part.tool.toUpperCase())}</span>`
      : '';

    // Combined short flag with sub-rows
    if (part.parts && part.parts.length) {
      const rows = part.parts.map(p => `
        <div class="flag-part-row">
          <code class="flag-part-name">${escHtml(p.value)}</code>
          <span class="flag-part-desc">${escHtml(p.description)}</span>
        </div>`).join('');

      return `
      <div class="card ${part.type}" data-index="${i}" id="card-${i}">
        <div class="card-header">
          <div class="card-badges">
            <span class="card-badge">${typeBadge}</span>
            ${toolBadge}
          </div>
          <code class="card-token">${escHtml(part.value)}</code>
        </div>
        <div class="flag-parts">${rows}</div>
      </div>`;
    }

    // Docs link for commands
    let docsHTML = '';
    if (part.type === 'command') {
      const link = getDocsLink(part.value, part.tool || '', parsed);
      if (link) {
        docsHTML = `<a class="card-man-link" href="${link.url}" target="_blank" rel="noopener">
          <span class="card-man-icon">↗</span> ${link.label}
        </a>`;
      }
    }

    return `
    <div class="card ${part.type}" data-index="${i}" id="card-${i}">
      <div class="card-header">
        <div class="card-badges">
          <span class="card-badge">${typeBadge}</span>
          ${toolBadge}
        </div>
        <code class="card-token">${escHtml(part.value)}</code>
      </div>
      <p class="card-desc">${escHtml(part.description)}</p>
      ${docsHTML}
    </div>`;
  }).join('');

  DOM.results.innerHTML = `
    ${hazardHTML}
    <div class="legend">${legendHTML}</div>
    <div class="command-bar-wrapper">
      <div class="command-bar-actions">
        <button class="btn-action" id="btn-share-link" title="Copy shareable link with this command">
          <span class="action-icon">🔗</span>
          <span class="action-text">Share Link</span>
        </button>
        <button class="btn-action" id="btn-copy-markdown" title="Copy formatted markdown summary">
          <span class="action-icon">📋</span>
          <span class="action-text">Copy Markdown</span>
        </button>
        <button class="btn-action" id="btn-copy-summary" title="Copy plain text summary">
          <span class="action-icon">📝</span>
          <span class="action-text">Copy Text</span>
        </button>
      </div>
      <div class="command-bar">${tokenSpans}</div>
    </div>
    <div class="cards-grid">${cardsHTML}</div>
  `;

  // Attach button event listeners
  const shareBtn = document.getElementById('btn-share-link');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}?cmd=${encodeURIComponent(raw)}`;
      copyToClipboard(shareUrl, shareBtn, 'Link Copied!');
    });
  }

  const markdownBtn = document.getElementById('btn-copy-markdown');
  if (markdownBtn) {
    markdownBtn.addEventListener('click', () => {
      const md = generateMarkdown(raw, parsed);
      copyToClipboard(md, markdownBtn, 'Markdown Copied!');
    });
  }

  const copySummaryBtn = document.getElementById('btn-copy-summary');
  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      const summary = generateSummary(raw, parsed);
      copyToClipboard(summary, copySummaryBtn, 'Text Copied!');
    });
  }

  // Hover sync between tokens and cards
  document.querySelectorAll('.token').forEach(tok => {
    tok.addEventListener('mouseenter', () => highlightPair(tok.dataset.index, true));
    tok.addEventListener('mouseleave', () => highlightPair(tok.dataset.index, false));
    tok.addEventListener('click', () => {
      const crd = document.getElementById(`card-${tok.dataset.index}`);
      if (crd) crd.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => highlightPair(card.dataset.index, true));
    card.addEventListener('mouseleave', () => highlightPair(card.dataset.index, false));
  });
}

// ── Hover sync helper ───────────────────────────────────────────────────
function highlightPair(index, isActive) {
  const tok = document.getElementById(`token-${index}`);
  const crd = document.getElementById(`card-${index}`);
  if (tok) tok.classList.toggle('active', isActive);
  if (crd) crd.classList.toggle('active', isActive);
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function copyToClipboard(text, btn, successMessage = 'Copied!') {
  try {
    await navigator.clipboard.writeText(text);
    const icon = btn.querySelector('.action-icon') || btn.querySelector('.copy-icon');
    const label = btn.querySelector('.action-text') || btn.querySelector('.copy-text');
    const oldIcon = icon ? icon.textContent : '';
    const oldText = label ? label.textContent : '';

    btn.classList.add('copied');
    if (icon) icon.textContent = '✅';
    if (label) label.textContent = successMessage;

    setTimeout(() => {
      btn.classList.remove('copied');
      if (icon) icon.textContent = oldIcon;
      if (label) label.textContent = oldText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

function generateSummary(raw, parsed) {
  let text = `Terminal Decoder Breakdown\n`;
  text += `Command: ${raw}\n\n`;

  if (parsed.hazard) {
    text += `⚠️ [${parsed.hazard.title}]: ${parsed.hazard.message}\n\n`;
  }

  parsed.forEach(p => {
    const typeLabel = p.type.charAt(0).toUpperCase() + p.type.slice(1);
    text += `• ${p.value} (${typeLabel})\n`;

    if (p.parts && p.parts.length) {
      p.parts.forEach(sub => {
        text += `  └ ${sub.value}: ${sub.description}\n`;
      });
    } else {
      text += `  └ ${p.description}\n`;
    }
    text += `\n`;
  });

  text += `Decoded by Terminal Decoder (https://terminaldecoder.vercel.app/)`;
  return text;
}

function generateMarkdown(raw, parsed) {
  let md = `### Terminal Decoder Breakdown\n\n`;
  md += `\`\`\`bash\n${raw}\n\`\`\`\n\n`;

  if (parsed.hazard) {
    md += `> ⚠️ **${parsed.hazard.title}**: ${parsed.hazard.message}\n\n`;
  }

  md += `| Token | Type | Explanation |\n`;
  md += `| :--- | :--- | :--- |\n`;

  parsed.forEach(p => {
    const typeLabel = p.type.charAt(0).toUpperCase() + p.type.slice(1);
    if (p.parts && p.parts.length) {
      const subParts = p.parts.map(s => `\`${s.value}\`: ${s.description}`).join('<br>');
      md += `| \`${p.value}\` | ${typeLabel} | ${subParts} |\n`;
    } else {
      const desc = (p.description || '').replace(/\|/g, '\\|');
      md += `| \`${p.value}\` | ${typeLabel} | ${desc} |\n`;
    }
  });

  md += `\n*Generated by [Terminal Decoder](https://terminaldecoder.vercel.app/)*\n`;
  return md;
}

function getWelcomeHTML() {
  return `
    <div class="welcome">
      <div class="welcome-icon">⚡</div>
      <h2>Paste any terminal command above</h2>
      <p style="opacity: 0.6; font-size: 0.85rem">Instantly decode Unix, Git, Docker, Kubernetes, Cloud CLIs & more</p>
    </div>`;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  init();

  // Register Service Worker for offline PWA support
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('ServiceWorker registration skipped:', err);
    });
  }
});
