// ── Tool categories & example chips ─────────────────────────────────────────
const TOOL_CATEGORIES = [
  { id: "all",        label: "All Tools",   icon: "⬡" },
  { id: "unix",       label: "Unix",        icon: "🐧" },
  { id: "git",        label: "Git",         icon: "⑂" },
  { id: "terraform",  label: "Terraform",   icon: "◈" },
  { id: "docker",     label: "Docker",      icon: "🐳" },
  { id: "kubernetes", label: "Kubernetes",  icon: "☸" },
  { id: "aws",        label: "AWS",         icon: "☁" },
  { id: "azure",      label: "Azure",       icon: "△" },
  { id: "gcloud",     label: "GCloud",      icon: "◎" },
  { id: "npm",        label: "npm",         icon: "⬡" },
  { id: "systemctl",  label: "systemctl",   icon: "⚙" },
  { id: "jq",         label: "jq",          icon: "{}" },
  { id: "openssl",    label: "openssl",     icon: "🔐" }
];

const TOOL_EXAMPLES = {
  all: [
    { cmd: "ls -la /var/log",                              label: "ls -la …" },
    { cmd: "git log --oneline --graph --all",              label: "git log …" },
    { cmd: "terraform apply -auto-approve",                label: "terraform apply …" },
    { cmd: "kubectl get pods -n kube-system -o wide",      label: "kubectl get …" },
    { cmd: "docker run -d -p 8080:80 --name web nginx",    label: "docker run …" },
    { cmd: "systemctl status nginx",                       label: "systemctl status …" },
    { cmd: "jq '.items[] | select(.status==\"active\")'",  label: "jq select …" },
    { cmd: "openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -days 365", label: "openssl req …" }
  ],
  unix: [
    { cmd: "ls -la /var/log",                              label: "ls -la /var/log" },
    { cmd: "grep -rn 'error' /var/log | head -20",         label: "grep -rn …" },
    { cmd: "rsync -avz --delete /src/ user@host:/dst/",    label: "rsync -avz …" },
    { cmd: "wget -O archive.tar.gz https://example.com",   label: "wget -O …" },
    { cmd: "ss -tlnp",                                     label: "ss -tlnp" },
    { cmd: "watch -n 2 df -h",                             label: "watch df -h" },
    { cmd: "dig +short example.com MX",                    label: "dig +short MX" },
    { cmd: "journalctl -u nginx -f -n 100",                label: "journalctl -u …" },
    { cmd: "lsof -i :8080",                                label: "lsof -i :8080" },
    { cmd: "find / -name '*.conf' -type f -maxdepth 3",    label: "find / -name …" },
    { cmd: "tar -czvf backup.tar.gz /home/user",           label: "tar -czvf …" },
    { cmd: "ps aux | grep nginx | awk '{print $2}'",       label: "ps aux | grep …" }
  ],
  git: [
    { cmd: "git commit -am 'fix: patch null check'",       label: "git commit -am …" },
    { cmd: "git push -u origin main",                      label: "git push -u …" },
    { cmd: "git rebase -i HEAD~3",                         label: "git rebase -i …" },
    { cmd: "git log --oneline --graph --all",              label: "git log --graph" },
    { cmd: "git stash pop",                                label: "git stash pop" },
    { cmd: "git cherry-pick abc1234",                      label: "git cherry-pick …" },
    { cmd: "git reset --hard HEAD~1",                      label: "git reset --hard" },
    { cmd: "git diff --stat HEAD~1",                       label: "git diff --stat" }
  ],
  terraform: [
    { cmd: "terraform init -upgrade",                      label: "terraform init …" },
    { cmd: "terraform plan -out=tfplan",                   label: "terraform plan …" },
    { cmd: "terraform apply -auto-approve",                label: "terraform apply" },
    { cmd: "terraform apply -var-file=prod.tfvars",        label: "terraform -var-file" },
    { cmd: "terraform destroy -target=aws_instance.web",   label: "terraform destroy …" },
    { cmd: "terraform workspace select prod",              label: "terraform workspace …" },
    { cmd: "terraform state list",                         label: "terraform state …" },
    { cmd: "terraform fmt -recursive",                     label: "terraform fmt" }
  ],
  docker: [
    { cmd: "docker run -d -p 8080:80 --name web nginx",    label: "docker run …" },
    { cmd: "docker build -t myapp:latest .",               label: "docker build …" },
    { cmd: "docker-compose up -d --build",                 label: "docker-compose up …" },
    { cmd: "docker exec -it web bash",                     label: "docker exec …" },
    { cmd: "docker logs --tail 100 -f web",                label: "docker logs …" },
    { cmd: "docker system prune -af --volumes",            label: "docker prune …" }
  ],
  kubernetes: [
    { cmd: "kubectl get pods -n kube-system -o wide",      label: "kubectl get pods" },
    { cmd: "kubectl apply -f deployment.yaml",             label: "kubectl apply …" },
    { cmd: "kubectl rollout restart deployment/web",       label: "kubectl rollout …" },
    { cmd: "kubectl exec -it web-pod -- bash",             label: "kubectl exec …" },
    { cmd: "kubectl logs -f deployment/api --tail 50",     label: "kubectl logs …" },
    { cmd: "kubectl port-forward svc/web 8080:80",         label: "kubectl port-forward" },
    { cmd: "kubectl scale deployment web --replicas=3",    label: "kubectl scale …" },
    { cmd: "kubectl describe pod web-abc -n default",      label: "kubectl describe …" }
  ],
  npm: [
    { cmd: "npm install",                                  label: "npm install" },
    { cmd: "npm install --save-dev eslint",                label: "npm install -D …" },
    { cmd: "npm run build",                                label: "npm run build" },
    { cmd: "npm audit fix",                                label: "npm audit fix" },
    { cmd: "npm ci",                                       label: "npm ci" },
    { cmd: "npm publish --access public",                  label: "npm publish …" }
  ],
  systemctl: [
    { cmd: "systemctl status nginx",                       label: "systemctl status" },
    { cmd: "systemctl enable nginx --now",                 label: "systemctl enable …" },
    { cmd: "systemctl restart nginx",                      label: "systemctl restart" },
    { cmd: "systemctl daemon-reload",                      label: "daemon-reload" },
    { cmd: "systemctl list-units --failed",                label: "list failed units" },
    { cmd: "systemctl disable --now snapd",                label: "systemctl disable …" }
  ],
  jq: [
    { cmd: "jq '.' data.json",                             label: "jq pretty-print" },
    { cmd: "jq '.items[] | .name' data.json",              label: "jq field extract" },
    { cmd: "jq -r '.[] | select(.active==true) | .id'",   label: "jq select …" },
    { cmd: "jq -c 'map({name,id})' data.json",             label: "jq map …" },
    { cmd: "jq 'group_by(.status)' data.json",             label: "jq group_by …" },
    { cmd: "jq --arg env prod '.envs[$env]' config.json",  label: "jq --arg …" }
  ],
  openssl: [
    { cmd: "openssl genrsa -out key.pem 4096",             label: "genrsa 4096" },
    { cmd: "openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -days 365", label: "self-signed cert" },
    { cmd: "openssl x509 -in cert.pem -text -noout",       label: "inspect cert" },
    { cmd: "openssl s_client -connect example.com:443 -servername example.com", label: "s_client TLS" },
    { cmd: "openssl dgst -sha256 -sign key.pem file.txt",  label: "dgst sign …" },
    { cmd: "openssl verify -CAfile ca.pem cert.pem",       label: "verify cert" }
  ],
  aws: [
    { cmd: "aws s3 ls s3://my-bucket --recursive",                              label: "s3 ls bucket" },
    { cmd: "aws s3 sync ./dist s3://my-bucket --delete",                        label: "s3 sync" },
    { cmd: "aws ec2 describe-instances --region us-east-1 --output table",      label: "ec2 instances" },
    { cmd: "aws ecs list-tasks --cluster prod-cluster",                         label: "ecs tasks" },
    { cmd: "aws eks update-kubeconfig --name my-cluster --region us-east-1",    label: "eks kubeconfig" },
    { cmd: "aws sts get-caller-identity",                                        label: "sts identity" },
    { cmd: "aws logs tail /aws/lambda/my-fn --follow",                          label: "logs tail" },
    { cmd: "aws secretsmanager get-secret-value --secret-id prod/db/password",  label: "get secret" }
  ],
  azure: [
    { cmd: "az login",                                                           label: "az login" },
    { cmd: "az group list --output table",                                       label: "group list" },
    { cmd: "az vm list -g my-rg --output table",                                label: "vm list" },
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
  ]
};

// ── Tool colour tokens ──────────────────────────────────────────────────────
const TOOL_COLORS = {
  unix:       "#4ade80",  // green
  git:        "#fb923c",  // orange
  terraform:  "#a78bfa",  // purple
  docker:     "#38bdf8",  // sky blue
  kubernetes: "#2dd4bf",  // teal
  aws:        "#f59e0b",  // amber
  azure:      "#3b82f6",  // blue
  gcloud:     "#ef4444",  // red
  npm:        "#f87171",  // red-light
  systemctl:  "#facc15",  // yellow
  jq:         "#c084fc",  // violet
  openssl:    "#f472b6"   // pink
};

const TOOL_LABELS = {
  unix: "Unix", git: "Git", terraform: "Terraform",
  docker: "Docker", kubernetes: "Kubernetes",
  aws: "AWS", azure: "Azure", gcloud: "GCloud",
  npm: "npm", systemctl: "systemctl", jq: "jq", openssl: "openssl"
};

// ── App state ───────────────────────────────────────────────────────────────
let activeTool = "all";

document.addEventListener('DOMContentLoaded', () => {
  // Merge extra commands (adds Git, Terraform, kubectl, npm, etc.)
  if (typeof mergeExtraCommands === 'function') mergeExtraCommands();

  const input      = document.getElementById('command-input');
  const results    = document.getElementById('results');
  const btnExplain = document.getElementById('btn-explain');
  const btnClear   = document.getElementById('btn-clear');
  const pillBar    = document.getElementById('tool-pill-bar');
  const chipsWrap  = document.getElementById('example-chips');

  // ── Build pill bar ────────────────────────────────────────────────────
  TOOL_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'tool-pill' + (cat.id === 'all' ? ' active' : '');
    btn.dataset.tool = cat.id;
    btn.innerHTML = `<span class="pill-icon">${cat.icon}</span>${cat.label}`;
    btn.addEventListener('click', () => {
      activeTool = cat.id;
      document.querySelectorAll('.tool-pill').forEach(p => p.classList.toggle('active', p.dataset.tool === cat.id));
      renderChips();
    });
    pillBar.appendChild(btn);
  });

  // ── Render example chips ──────────────────────────────────────────────
  function renderChips() {
    const examples = TOOL_EXAMPLES[activeTool] || TOOL_EXAMPLES.all;
    chipsWrap.innerHTML = '';
    examples.forEach(ex => {
      const btn = document.createElement('button');
      btn.className = 'example-chip';
      btn.dataset.cmd = ex.cmd;
      btn.textContent = ex.label;
      btn.addEventListener('click', () => { input.value = ex.cmd; explain(); });
      chipsWrap.appendChild(btn);
    });
  }
  renderChips();

  // ── Events ────────────────────────────────────────────────────────────
  btnExplain.addEventListener('click', explain);
  btnClear.addEventListener('click', () => {
    input.value = '';
    results.innerHTML = getWelcomeHTML();
    input.focus();
  });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') explain(); });
  results.innerHTML = getWelcomeHTML();

  // ── Core explain ─────────────────────────────────────────────────────
  function explain() {
    const raw = input.value.trim();
    if (!raw) return;
    const parsed = parseCommand(raw);
    if (!parsed.length) {
      results.innerHTML = `<div class="error-msg">Could not parse the command. Please try again.</div>`;
      return;
    }
    renderResults(raw, parsed);
  }

  // ── Render results ────────────────────────────────────────────────────
  function renderResults(raw, parsed) {
    const legendColors = {
      command: 'var(--accent)', flag: 'var(--green)',
      argument: 'var(--orange)', operator: 'var(--yellow)', subcommand: 'var(--pink)'
    };
    const legendLabels = {
      command: 'Command', flag: 'Flag / Option',
      argument: 'Argument', operator: 'Operator', subcommand: 'Subcommand'
    };

    // Token bar
    const tokenSpans = parsed.map((p, i) =>
      `<span class="token ${p.type}" data-index="${i}" id="token-${i}">${escHtml(p.value)}</span>`
    ).join(' ');

    // Legend
    const types = [...new Set(parsed.map(p => p.type))];
    const legendHTML = types.map(t =>
      `<div class="legend-item">
        <div class="legend-dot" style="background:${legendColors[t]}"></div>
        <span>${legendLabels[t]}</span>
      </div>`
    ).join('');

    // Docs link helper
    const MAN8 = new Set(['ip','ss','mount','umount','fdisk','ifconfig','iptables','sysctl','insmod','rmmod']);
    function getDocsLink(cmd, tool) {
      const v = cmd.toLowerCase();
      if (tool === 'unix' || tool === 'systemctl') {
        const sec = MAN8.has(v) ? 8 : (v === 'crontab' || v === 'journalctl' ? 1 : 1);
        return { url: `https://man7.org/linux/man-pages/man${sec}/${v}.${sec}.html`, label: 'man page' };
      }
      if (tool === 'git')        return { url: `https://git-scm.com/docs/git`, label: 'Git docs' };
      if (tool === 'terraform')  return { url: `https://developer.hashicorp.com/terraform/cli/commands`, label: 'Terraform docs' };
      if (tool === 'docker')     return { url: `https://docs.docker.com/reference/cli/docker/`, label: 'Docker docs' };
      if (tool === 'kubernetes') return { url: `https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands/`, label: 'kubectl docs' };
      if (tool === 'aws')        return { url: `https://awscli.amazonaws.com/v2/documentation/api/latest/index.html`, label: 'AWS CLI docs' };
      if (tool === 'azure')      return { url: `https://learn.microsoft.com/en-us/cli/azure/reference-index`, label: 'Azure CLI docs' };
      if (tool === 'gcloud')     return { url: `https://cloud.google.com/sdk/gcloud/reference`, label: 'gcloud reference' };
      if (tool === 'npm')        return { url: `https://docs.npmjs.com/cli/commands/npm-${v}`, label: 'npm docs' };
      if (tool === 'jq')         return { url: `https://jqlang.github.io/jq/manual/`, label: 'jq manual' };
      if (tool === 'openssl')    return { url: `https://www.openssl.org/docs/manmaster/man1/${v}.html`, label: 'OpenSSL docs' };
      return null;
    }

    // Cards
    const cardsHTML = parsed.map((part, i) => {
      const typeBadge = legendLabels[part.type] || part.type;

      // Combined flag: show each sub-flag as a row inside one card
      if (part.parts && part.parts.length) {
        const rows = part.parts.map(p => `
          <div class="flag-part-row">
            <code class="flag-part-name">${escHtml(p.value)}</code>
            <span class="flag-part-desc">${escHtml(p.description)}</span>
          </div>`).join('');
        return `
        <div class="card ${part.type}" data-index="${i}" id="card-${i}">
          <div class="card-header">
            <span class="card-badge">${typeBadge}</span>
            <code class="card-token">${escHtml(part.value)}</code>
          </div>
          <div class="flag-parts">${rows}</div>
        </div>`;
      }

      // Docs link for command cards
      let docsHTML = '';
      if (part.type === 'command') {
        const link = getDocsLink(part.value, part.tool || '');
        if (link) {
          docsHTML = `<a class="card-man-link" href="${link.url}" target="_blank" rel="noopener">
            <span class="card-man-icon">↗</span> ${link.label}
          </a>`;
        }
      }

      return `
      <div class="card ${part.type}" data-index="${i}" id="card-${i}">
        <div class="card-header">
          <span class="card-badge">${typeBadge}</span>
          <code class="card-token">${escHtml(part.value)}</code>
        </div>
        <p class="card-desc">${escHtml(part.description)}</p>
        ${docsHTML}
      </div>`;
    }).join('');

    results.innerHTML = `
      <div class="legend">${legendHTML}</div>
      <div class="command-bar">${tokenSpans}</div>
      <div class="cards-grid">${cardsHTML}</div>
    `;

    // Hover sync
    document.querySelectorAll('.token').forEach(tok => {
      tok.addEventListener('mouseenter', () => highlightPair(tok.dataset.index, true));
      tok.addEventListener('mouseleave', () => highlightPair(tok.dataset.index, false));
    });
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', () => highlightPair(card.dataset.index, true));
      card.addEventListener('mouseleave', () => highlightPair(card.dataset.index, false));
    });
  }

  function highlightPair(index, on) {
    const tok  = document.getElementById(`token-${index}`);
    const card = document.getElementById(`card-${index}`);
    if (on) {
      tok?.classList.add('active');
      card?.classList.add('highlighted');
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      tok?.classList.remove('active');
      card?.classList.remove('highlighted');
    }
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function getWelcomeHTML() {
    return `
      <div class="welcome">
        <div class="welcome-icon">⌨️</div>
        <h2>Paste any terminal command above</h2>
        <p>Unix · Git · Terraform · Docker · Kubernetes · npm · systemctl · jq · openssl</p>
      </div>`;
  }
});
