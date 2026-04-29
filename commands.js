const COMMANDS = {
  ls: {
    description: "List directory contents",
    args: { description: "Path(s) to list. Defaults to current directory." },
    flags: {
      "-l": "Long listing format: shows permissions, owner, size, date",
      "-a": "Show all files including hidden (starting with .)",
      "-h": "Human-readable file sizes (e.g., 1K, 2M)",
      "-r": "Reverse order while sorting",
      "-t": "Sort by modification time, newest first",
      "-R": "List subdirectories recursively",
      "-S": "Sort by file size, largest first",
      "-1": "List one file per line",
      "-d": "List directories themselves, not their contents",
      "-i": "Print the index number (inode) of each file",
      "--color": "Colorize the output"
    }
  },
  grep: {
    description: "Search text using patterns (Global Regular Expression Print)",
    args: { description: "PATTERN followed by FILE(s) to search in" },
    flags: {
      "-i": "Case-insensitive matching",
      "-r": "Recursively search subdirectories",
      "-R": "Recursively search, following symlinks",
      "-n": "Show line numbers of matches",
      "-v": "Invert match — show lines that do NOT match",
      "-c": "Count the number of matching lines",
      "-l": "Print only filenames of files with matches",
      "-w": "Match whole words only",
      "-o": "Print only the matched part of the line",
      "-E": "Extended regex (supports +, ?, |, ())",
      "-P": "Perl-compatible regex (PCRE)",
      "-A": "Show N lines After each match",
      "-B": "Show N lines Before each match",
      "-C": "Show N lines of Context around each match",
      "--color": "Highlight matches in color",
      "-q": "Quiet mode — no output, just exit code",
      "-m": "Stop after N matches"
    }
  },
  find: {
    description: "Search for files in a directory hierarchy",
    args: { description: "Starting directory for the search" },
    flags: {
      "-name": "Search by filename (case-sensitive, supports wildcards)",
      "-iname": "Search by filename (case-insensitive)",
      "-type": "Filter by type: f=file, d=directory, l=symlink",
      "-size": "Filter by size (e.g., +10M, -1k)",
      "-mtime": "Modified N days ago (+N older than, -N within N days)",
      "-exec": "Execute a command on each found file",
      "-maxdepth": "Limit search depth to N levels",
      "-mindepth": "Skip the first N levels",
      "-user": "Files owned by a specific user",
      "-perm": "Files with specific permissions",
      "-empty": "Find empty files or directories",
      "-delete": "Delete found files (use with caution!)",
      "-print": "Print the full path of found files (default)"
    }
  },
  chmod: {
    description: "Change file mode (permissions)",
    args: { description: "MODE followed by FILE(s) to change" },
    flags: {
      "-R": "Apply recursively to directories and their contents",
      "-v": "Verbose: output each file processed",
      "-c": "Report only when a change is made",
      "u+x": "Add execute permission for the owner (user)",
      "g+w": "Add write permission for the group",
      "o-r": "Remove read permission for others",
      "a+r": "Add read permission for all (user, group, others)",
      "755": "Owner: rwx, Group: r-x, Others: r-x",
      "644": "Owner: rw-, Group: r--, Others: r--",
      "777": "Full permissions for everyone (use with caution!)",
      "000": "No permissions for anyone"
    }
  },
  tar: {
    description: "Archive utility — tape archiver",
    args: { description: "Archive file followed by source file(s)/directory" },
    flags: {
      "-c": "Create a new archive",
      "-x": "Extract files from an archive",
      "-v": "Verbose — list files processed",
      "-f": "Specify the archive filename (must be followed by filename)",
      "-z": "Compress/decompress with gzip (.tar.gz)",
      "-j": "Compress/decompress with bzip2 (.tar.bz2)",
      "-J": "Compress/decompress with xz (.tar.xz)",
      "-t": "List the contents of an archive",
      "-r": "Append files to the end of an archive",
      "-u": "Update archive with newer files",
      "-C": "Extract to a specific directory",
      "--exclude": "Exclude files matching a pattern",
      "-p": "Preserve file permissions"
    }
  },
  curl: {
    description: "Transfer data from or to a server using various protocols",
    args: { description: "URL to connect to" },
    flags: {
      "-o": "Write output to a file instead of stdout",
      "-O": "Save with the remote filename",
      "-L": "Follow redirects",
      "-I": "Fetch headers only (HEAD request)",
      "-X": "Specify HTTP method (GET, POST, PUT, DELETE...)",
      "-d": "Send data in a POST request body",
      "-H": "Add a custom HTTP header",
      "-u": "Provide user credentials (user:password)",
      "-v": "Verbose output — show request and response details",
      "-s": "Silent mode — suppress progress and errors",
      "-k": "Allow insecure SSL connections (skip cert validation)",
      "--retry": "Retry on transient errors N times",
      "-c": "Save cookies to a file",
      "-b": "Send cookies from a file",
      "--compressed": "Request compressed response"
    }
  },
  ssh: {
    description: "OpenSSH — secure shell remote login client",
    args: { description: "[user@]hostname — the remote host to connect to" },
    flags: {
      "-p": "Port number to connect to on the remote host",
      "-i": "Identity file (private key) for authentication",
      "-L": "Local port forwarding: -L local_port:remote_host:remote_port",
      "-R": "Remote port forwarding",
      "-N": "Do not execute a remote command (useful for tunneling)",
      "-f": "Go to background before command execution",
      "-v": "Verbose mode (use -vvv for more detail)",
      "-X": "Enable X11 forwarding",
      "-A": "Enable agent forwarding",
      "-C": "Enable compression",
      "-T": "Disable pseudo-terminal allocation",
      "-t": "Force pseudo-terminal allocation",
      "-o": "Set an option (e.g., StrictHostKeyChecking=no)"
    }
  },
  docker: {
    description: "Docker container management CLI",
    args: { description: "Subcommand and arguments (e.g., run IMAGE, ps, build PATH)" },
    flags: {
      "run": "Create and start a container from an image",
      "ps": "List running containers (-a to show all)",
      "build": "Build an image from a Dockerfile",
      "pull": "Pull an image from a registry",
      "push": "Push an image to a registry",
      "exec": "Run a command in a running container",
      "stop": "Stop a running container",
      "rm": "Remove a container",
      "rmi": "Remove an image",
      "logs": "Fetch logs of a container",
      "-d": "Detached mode — run container in background",
      "-p": "Publish container port to host: -p host:container",
      "-v": "Mount a volume: -v host_path:container_path",
      "-e": "Set an environment variable",
      "--name": "Assign a name to the container",
      "--rm": "Automatically remove container when it exits",
      "-it": "Interactive terminal (combines -i and -t)"
    }
  },
  awk: {
    description: "Pattern scanning and text processing language",
    args: { description: "PROGRAM followed by FILE(s) or piped input" },
    flags: {
      "-F": "Set field separator (e.g., -F: for colon-delimited)",
      "-v": "Assign a variable before execution (e.g., -v x=5)",
      "-f": "Read the awk program from a file",
      "$0": "The entire current line",
      "$1": "First field of the current line",
      "$NF": "Last field of the current line",
      "NR": "Number of records (lines) processed so far",
      "NF": "Number of fields in the current record",
      "BEGIN": "Block executed before processing any lines",
      "END": "Block executed after processing all lines",
      "print": "Print to stdout",
      "printf": "Formatted print"
    }
  },
  sed: {
    description: "Stream editor for filtering and transforming text",
    args: { description: "FILE(s) or piped input to process" },
    flags: {
      "-n": "Suppress automatic printing of pattern space",
      "-e": "Add a script/expression to be executed",
      "-f": "Read commands from a file",
      "-i": "Edit files in-place (optionally with backup suffix)",
      "-r": "Use extended regular expressions",
      "s/old/new/": "Substitute first occurrence of old with new",
      "s/old/new/g": "Substitute all occurrences (global)",
      "s/old/new/i": "Case-insensitive substitution",
      "d": "Delete matching lines",
      "p": "Print matching lines",
      "q": "Quit after first match"
    }
  },
  ps: {
    description: "Report a snapshot of current running processes",
    args: { description: "Optional process IDs or usernames to filter" },
    flags: {
      "-e": "Show all processes",
      "-f": "Full-format listing",
      "-u": "Show processes for a specific user",
      "-aux": "Show all processes with detailed info (BSD syntax)",
      "-ef": "Show all processes in full format (UNIX syntax)",
      "-p": "Select by PID",
      "--forest": "Show process tree (ASCII art)",
      "-o": "User-defined output format",
      "PID": "Process ID",
      "TTY": "Terminal associated with the process",
      "CMD": "Command name or full command line"
    }
  },
  kill: {
    description: "Send a signal to a process",
    args: { description: "PID(s) — process IDs to send signal to" },
    flags: {
      "-9": "SIGKILL — forcefully terminate process immediately",
      "-15": "SIGTERM — politely ask process to terminate (default)",
      "-1": "SIGHUP — reload configuration without restarting",
      "-2": "SIGINT — equivalent to pressing Ctrl+C",
      "-l": "List all available signal names",
      "-s": "Specify signal by name (e.g., -s SIGKILL)"
    }
  },
  cp: {
    description: "Copy files and directories",
    args: { description: "SOURCE followed by DESTINATION" },
    flags: {
      "-r": "Copy directories recursively",
      "-R": "Same as -r",
      "-v": "Verbose — explain what is being done",
      "-i": "Prompt before overwriting",
      "-u": "Copy only when SOURCE is newer than DESTINATION",
      "-p": "Preserve timestamps, mode, and ownership",
      "-a": "Archive mode — preserves everything (-rpd)",
      "-f": "Force overwrite without prompt",
      "-n": "Do not overwrite existing files",
      "--backup": "Make a backup of each overwritten file"
    }
  },
  mv: {
    description: "Move or rename files and directories",
    args: { description: "SOURCE followed by DESTINATION" },
    flags: {
      "-v": "Verbose — explain what is being done",
      "-i": "Prompt before overwriting",
      "-f": "Force — do not prompt before overwriting",
      "-n": "Do not overwrite existing files",
      "-u": "Move only when SOURCE is newer than DESTINATION",
      "--backup": "Make a backup of each overwritten file"
    }
  },
  rm: {
    description: "Remove files or directories",
    args: { description: "FILE(s) or DIRECTORY(s) to remove" },
    flags: {
      "-r": "Remove directories and their contents recursively",
      "-R": "Same as -r",
      "-f": "Force removal without prompting, ignore nonexistent files",
      "-i": "Prompt before every removal",
      "-v": "Verbose — explain what is being done",
      "-d": "Remove empty directories"
    }
  },
  mkdir: {
    description: "Make directories",
    args: { description: "DIRECTORY name(s) to create" },
    flags: {
      "-p": "Make parent directories as needed, no error if existing",
      "-v": "Print a message for each created directory",
      "-m": "Set permissions mode (e.g., -m 755)"
    }
  },
  cat: {
    description: "Concatenate files and print to standard output",
    args: { description: "FILE(s) to read and print" },
    flags: {
      "-n": "Number all output lines",
      "-b": "Number non-blank output lines",
      "-A": "Show all non-printing characters",
      "-E": "Show $ at end of each line",
      "-T": "Show TAB characters as ^I",
      "-s": "Suppress repeated empty output lines",
      "-v": "Show non-printing characters"
    }
  },
  echo: {
    description: "Display a line of text or variable value",
    args: { description: "STRING(s) to print to stdout" },
    flags: {
      "-n": "Do not output the trailing newline",
      "-e": "Enable interpretation of escape sequences (\\n, \\t, etc.)",
      "-E": "Disable interpretation of escape sequences (default)"
    }
  },
  ping: {
    description: "Send ICMP ECHO_REQUEST packets to a network host",
    args: { description: "HOST — hostname or IP address to ping" },
    flags: {
      "-c": "Stop after sending N packets",
      "-i": "Wait N seconds between sending each packet",
      "-t": "Set IP Time to Live (TTL)",
      "-s": "Specify the packet size in bytes",
      "-W": "Time to wait for a response (seconds)",
      "-q": "Quiet output, only summary",
      "-v": "Verbose output",
      "-4": "Use IPv4 only",
      "-6": "Use IPv6 only"
    }
  },
  netstat: {
    description: "Print network connections, routing tables, and statistics",
    args: { description: "Optional filter arguments" },
    flags: {
      "-a": "Show all sockets (listening and non-listening)",
      "-t": "Show TCP connections only",
      "-u": "Show UDP connections only",
      "-n": "Show numerical addresses (no DNS resolution)",
      "-p": "Show PID/program name for sockets",
      "-l": "Show only listening sockets",
      "-r": "Show routing table",
      "-s": "Show per-protocol statistics",
      "-i": "Show network interfaces",
      "-c": "Continuously display info every second"
    }
  },
  df: {
    description: "Report file system disk space usage",
    args: { description: "FILE — check the filesystem this file is on" },
    flags: {
      "-h": "Human-readable sizes (1K, 234M, 2G)",
      "-T": "Print filesystem type",
      "-i": "Show inode information instead of block usage",
      "-a": "Include dummy file systems",
      "-x": "Exclude a filesystem type",
      "--total": "Show a grand total"
    }
  },
  du: {
    description: "Estimate file and directory space usage",
    args: { description: "FILE(s) or DIRECTORY to measure" },
    flags: {
      "-h": "Human-readable sizes",
      "-s": "Summary only — total size of each argument",
      "-a": "Show sizes for all files, not just directories",
      "-c": "Produce a grand total",
      "--max-depth": "Limit depth of directory tree shown",
      "-d": "Same as --max-depth",
      "--exclude": "Exclude files matching pattern",
      "-x": "Skip directories on different filesystems"
    }
  },
  top: {
    description: "Display Linux tasks and system resource usage in real-time",
    args: { description: "No required arguments — runs interactively" },
    flags: {
      "-d": "Delay between updates in seconds",
      "-n": "Number of iterations before exiting",
      "-p": "Monitor only specific PID(s)",
      "-u": "Show processes for a specific user",
      "-b": "Batch mode — useful for output to file",
      "-H": "Show threads"
    }
  },
  head: {
    description: "Output the first part of files",
    args: { description: "FILE(s) to read from" },
    flags: {
      "-n": "Print the first N lines (default: 10)",
      "-c": "Print the first N bytes",
      "-q": "Never print file headers",
      "-v": "Always print file headers"
    }
  },
  tail: {
    description: "Output the last part of files",
    args: { description: "FILE(s) to read from" },
    flags: {
      "-n": "Print the last N lines (default: 10)",
      "-c": "Print the last N bytes",
      "-f": "Follow: keep reading as file grows (great for logs!)",
      "-F": "Like -f but keep retrying if file is inaccessible",
      "-q": "Never print file headers",
      "-v": "Always print file headers"
    }
  },
  wc: {
    description: "Print line, word, and byte counts for files",
    args: { description: "FILE(s) to count" },
    flags: {
      "-l": "Print the line count only",
      "-w": "Print the word count only",
      "-c": "Print the byte count only",
      "-m": "Print the character count",
      "-L": "Print the length of the longest line"
    }
  },
  sort: {
    description: "Sort lines of text files",
    args: { description: "FILE(s) to sort" },
    flags: {
      "-r": "Reverse the result of comparisons",
      "-n": "Compare according to string numerical value",
      "-k": "Sort by a specific field/column",
      "-t": "Field separator character",
      "-u": "Output only unique lines",
      "-f": "Fold lower case to upper case (ignore case)",
      "-h": "Compare human-readable numbers (e.g., 2K, 1G)",
      "-o": "Write result to FILE instead of stdout",
      "-b": "Ignore leading blanks",
      "-M": "Compare as month names (JAN < FEB...)"
    }
  },
  uniq: {
    description: "Report or omit repeated lines",
    args: { description: "INPUT FILE (usually from sort)" },
    flags: {
      "-c": "Prefix lines by number of occurrences",
      "-d": "Only print duplicate lines",
      "-u": "Only print unique lines (non-duplicated)",
      "-i": "Ignore case when comparing",
      "-f": "Skip the first N fields when comparing",
      "-s": "Skip the first N characters when comparing"
    }
  },
  xargs: {
    description: "Build and execute command lines from standard input",
    args: { description: "COMMAND to execute with arguments from stdin" },
    flags: {
      "-n": "Use at most N arguments per command line",
      "-I": "Replace occurrences of REPLACE-STR in command (e.g., -I {})",
      "-P": "Run up to N processes at a time (parallel)",
      "-0": "Input items are separated by null character (use with find -print0)",
      "-d": "Use DELIM as input delimiter instead of whitespace",
      "-p": "Prompt before running each command line",
      "-t": "Print command before executing it",
      "-r": "Do not run command if stdin is empty"
    }
  },
  chown: {
    description: "Change file owner and group",
    args: { description: "OWNER[:GROUP] followed by FILE(s)" },
    flags: {
      "-R": "Operate recursively on directories",
      "-v": "Verbose — output each file processed",
      "-c": "Report only when a change is made",
      "--from": "Only change if current owner matches given owner",
      "--reference": "Use another file's ownership as reference"
    }
  },
  ln: {
    description: "Make links between files",
    args: { description: "TARGET followed by LINK_NAME" },
    flags: {
      "-s": "Create a symbolic (soft) link instead of a hard link",
      "-f": "Remove existing destination files",
      "-v": "Verbose output",
      "-n": "Treat LINK_NAME as a normal file if it is a symlink to a dir",
      "-r": "Create symbolic links relative to link location",
      "-b": "Make a backup of each existing destination file"
    }
  },
  cron: {
    description: "Daemon to execute scheduled commands (crontab entries)",
    args: { description: "No direct arguments — managed via crontab -e" },
    flags: {
      "minute": "0-59: minute of the hour",
      "hour": "0-23: hour of the day",
      "day": "1-31: day of the month",
      "month": "1-12: month of the year",
      "weekday": "0-7: day of the week (0 and 7 = Sunday)",
      "*": "Every unit (wildcard)",
      ",": "Multiple values (e.g., 1,3,5)",
      "-": "Range of values (e.g., 1-5)",
      "/": "Step values (e.g., */5 = every 5 units)"
    }
  },

  crontab: {
    description: "Manage per-user scheduled cron jobs",
    args: { description: "Optional cron file to install" },
    flags: {
      "-e": "Edit the current user's crontab in $EDITOR",
      "-l": "List the current user's crontab",
      "-r": "Remove the current user's crontab",
      "-u": "Operate on another user's crontab (requires root)",
      "-i": "Prompt before removing crontab (use with -r)"
    }
  },

  wget: {
    description: "Non-interactive network downloader",
    args: { description: "URL(s) to download" },
    flags: {
      "-O": "Save file with a different name",
      "-o": "Log all messages to a file instead of stderr",
      "-q": "Quiet mode — no output",
      "-c": "Continue a partial download",
      "-r": "Recursive download",
      "-np": "No parent — do not ascend to parent directory in recursive mode",
      "-P": "Save files to a specific directory prefix",
      "--no-check-certificate": "Skip SSL certificate validation",
      "--user": "HTTP/FTP username",
      "--password": "HTTP/FTP password",
      "-i": "Read URLs from a file",
      "--limit-rate": "Limit download bandwidth (e.g., 500k)",
      "--tries": "Number of retries (0 = infinite)",
      "--timeout": "Connection/read timeout in seconds",
      "--spider": "Check URL without downloading",
      "-b": "Go to background immediately after startup",
      "--mirror": "Enable mirroring options (-r -N -l inf --no-remove-listing)"
    }
  },

  rsync: {
    description: "Fast, versatile file copying and synchronisation tool",
    args: { description: "SOURCE and DESTINATION (local or user@host:path)" },
    flags: {
      "-a": "Archive mode: preserves permissions, timestamps, symlinks, owner (-rlptgoD)",
      "-v": "Verbose — show files being transferred",
      "-z": "Compress data during transfer",
      "-r": "Recurse into directories",
      "-n": "Dry run — show what would be transferred without doing it",
      "--dry-run": "Same as -n",
      "-P": "Show progress and keep partial files (combines --progress --partial)",
      "--progress": "Show progress during transfer",
      "--delete": "Delete files in destination that do not exist in source",
      "--exclude": "Exclude files matching a pattern",
      "--include": "Include files matching a pattern (overrides --exclude)",
      "--filter": "Merge-file or rule-based filtering",
      "-e": "Specify the remote shell to use (e.g., -e 'ssh -p 2222')",
      "--bwlimit": "Bandwidth limit in KB/s",
      "--checksum": "Use checksum comparison instead of timestamp/size",
      "--links": "Copy symlinks as symlinks",
      "--perms": "Preserve file permissions",
      "--times": "Preserve modification times",
      "--owner": "Preserve owner (root only)",
      "--group": "Preserve group",
      "--backup": "Make backups of files that are changed or deleted",
      "--stats": "Show file transfer statistics",
      "--ignore-existing": "Skip files that already exist on destination"
    }
  },

  scp: {
    description: "Securely copy files between hosts over SSH",
    args: { description: "SOURCE and DESTINATION — either can be [user@]host:path" },
    flags: {
      "-r": "Recursively copy entire directories",
      "-P": "Port to connect to on the remote host",
      "-i": "Identity (private key) file for authentication",
      "-p": "Preserve modification times, access times, and modes",
      "-q": "Quiet mode — suppress progress and warnings",
      "-C": "Enable compression",
      "-v": "Verbose mode for debugging",
      "-o": "Pass an option to ssh (e.g., -o StrictHostKeyChecking=no)",
      "-l": "Limit bandwidth in Kbit/s",
      "-3": "Copy between two remote hosts via the local host"
    }
  },

  tee: {
    description: "Read from stdin and write to both stdout and files simultaneously",
    args: { description: "FILE(s) to write output to (in addition to stdout)" },
    flags: {
      "-a": "Append to files instead of overwriting",
      "-i": "Ignore the SIGINT signal (interrupt)"
    }
  },

  cut: {
    description: "Extract sections from each line of a file or stdin",
    args: { description: "FILE(s) or piped input to process" },
    flags: {
      "-d": "Use DELIM as the field delimiter instead of TAB",
      "-f": "Select specific fields (e.g., -f1,3 or -f2-4)",
      "-c": "Select specific character positions (e.g., -c1-5)",
      "-b": "Select specific bytes",
      "--complement": "Output everything except the selected fields/chars",
      "--output-delimiter": "Use a different string as output delimiter"
    }
  },

  tr: {
    description: "Translate or delete characters from stdin",
    args: { description: "SET1 — characters to translate from; SET2 — characters to translate to" },
    flags: {
      "-d": "Delete characters in SET1 (no SET2 needed)",
      "-s": "Squeeze repeated characters in SET1 into a single character",
      "-c": "Use the complement (opposite) of SET1",
      "-t": "Truncate SET1 to the length of SET2",
      "[:lower:]": "POSIX class: all lowercase letters",
      "[:upper:]": "POSIX class: all uppercase letters",
      "[:digit:]": "POSIX class: all digits 0-9",
      "[:space:]": "POSIX class: whitespace characters",
      "[:alpha:]": "POSIX class: all letters",
      "[:alnum:]": "POSIX class: letters and digits"
    }
  },

  date: {
    description: "Print or set the system date and time",
    args: { description: "Optional format string starting with + (e.g., +%Y-%m-%d)" },
    flags: {
      "-u": "Print or set time in UTC",
      "-d": "Display a specific date string instead of now",
      "-s": "Set the date/time (requires root)",
      "-r": "Show the last modification time of a file",
      "-I": "Output ISO 8601 format (date or seconds)",
      "-R": "Output RFC 2822 format (useful for email headers)",
      "+%Y": "Four-digit year",
      "+%m": "Month (01-12)",
      "+%d": "Day of month (01-31)",
      "+%H": "Hour in 24-hour format (00-23)",
      "+%M": "Minutes (00-59)",
      "+%S": "Seconds (00-59)",
      "+%s": "Unix timestamp (seconds since epoch)",
      "+%A": "Full weekday name",
      "+%Z": "Timezone name"
    }
  },

  uname: {
    description: "Print system and kernel information",
    args: { description: "No required arguments" },
    flags: {
      "-a": "Print all information",
      "-s": "Print kernel name",
      "-n": "Print network node hostname",
      "-r": "Print kernel release version",
      "-v": "Print kernel version",
      "-m": "Print machine hardware name (e.g., x86_64)",
      "-p": "Print processor type",
      "-o": "Print operating system name"
    }
  },

  which: {
    description: "Locate the executable file for a command",
    args: { description: "COMMAND name(s) to locate" },
    flags: {
      "-a": "Print all matching executables in PATH, not just the first"
    }
  },

  env: {
    description: "Print environment variables or run a command in a modified environment",
    args: { description: "VAR=VALUE pairs followed by optional COMMAND to run" },
    flags: {
      "-i": "Start with an empty environment",
      "-u": "Remove a variable from the environment",
      "--null": "End each output line with NUL instead of newline"
    }
  },

  export: {
    description: "Set or export an environment variable to child processes",
    args: { description: "NAME=VALUE pairs to export, or variable names to mark for export" },
    flags: {
      "-n": "Remove export attribute from variable (do not export)",
      "-p": "Print all exported variables and their values",
      "-f": "Export a function name rather than a variable"
    }
  },

  free: {
    description: "Display amount of free and used memory in the system",
    args: { description: "No required arguments" },
    flags: {
      "-h": "Human-readable output (KB, MB, GB)",
      "-m": "Display values in mebibytes",
      "-g": "Display values in gibibytes",
      "-k": "Display values in kibibytes (default)",
      "-t": "Show a total row",
      "-s": "Continuously display, updating every N seconds",
      "-c": "Display N times then exit (use with -s)",
      "-w": "Wide output — split buffers and cache into separate columns"
    }
  },

  lsof: {
    description: "List open files — including network connections, sockets, and pipes",
    args: { description: "Optional file, directory, or device to filter by" },
    flags: {
      "-i": "List network files (use -i :PORT to filter by port)",
      "-p": "List files for a specific PID",
      "-u": "List files for a specific user",
      "-c": "List files for processes matching a command name",
      "-t": "Output only PIDs (terse mode, useful for kill)",
      "-n": "Do not resolve network hostnames",
      "-P": "Do not resolve port names to service names",
      "-r": "Repeat listing every N seconds",
      "+D": "Recursively list all open files under a directory",
      "-a": "AND multiple selection options together",
      "-s": "Specify protocol state (e.g., TCP:LISTEN)"
    }
  },

  ss: {
    description: "Socket statistics — modern replacement for netstat",
    args: { description: "Optional filter expressions" },
    flags: {
      "-t": "Show TCP sockets",
      "-u": "Show UDP sockets",
      "-l": "Show listening sockets only",
      "-a": "Show all sockets (listening and non-listening)",
      "-n": "Do not resolve service names (show port numbers)",
      "-p": "Show process using the socket (PID and name)",
      "-e": "Show extended socket information",
      "-m": "Show socket memory usage",
      "-i": "Show internal TCP information",
      "-s": "Print summary statistics",
      "-4": "Display only IPv4 sockets",
      "-6": "Display only IPv6 sockets",
      "-r": "Resolve numeric addresses to hostnames",
      "state": "Filter by TCP state (e.g., ss state ESTABLISHED)",
      "sport": "Filter by source port",
      "dport": "Filter by destination port"
    }
  },

  watch: {
    description: "Execute a command repeatedly, displaying its output",
    args: { description: "COMMAND to run repeatedly" },
    flags: {
      "-n": "Update interval in seconds (default: 2)",
      "-d": "Highlight differences between successive updates",
      "-e": "Exit if command exits with non-zero status",
      "-g": "Exit when the output of command changes",
      "-t": "Turn off header (time, interval, command)",
      "-b": "Beep if command exits with non-zero status",
      "-p": "Precise scheduling to reduce interval drift",
      "-c": "Interpret ANSI colour sequences"
    }
  },

  dig: {
    description: "DNS lookup utility — query DNS name servers",
    args: { description: "[@server] name [type] — domain to look up and optional record type" },
    flags: {
      "+short": "Print only the terse answer (just the IP)",
      "+noall": "Clear all display flags",
      "+answer": "Display the answer section",
      "+trace": "Trace the delegation path from the root",
      "+norecurse": "Send a non-recursive query",
      "+dnssec": "Request DNSSEC records",
      "-t": "Specify query type (A, AAAA, MX, CNAME, TXT, NS, SOA…)",
      "-x": "Reverse lookup — query PTR record for an IP address",
      "-4": "Use IPv4 only",
      "-6": "Use IPv6 only",
      "-p": "Query on a non-standard port",
      "@8.8.8.8": "Query a specific DNS server (e.g., Google's)",
      "A": "IPv4 address record",
      "AAAA": "IPv6 address record",
      "MX": "Mail exchanger record",
      "TXT": "Text record",
      "CNAME": "Canonical name record",
      "NS": "Name server record",
      "SOA": "Start of authority record"
    }
  },

  ip: {
    description: "Show/manipulate routing, network devices, interfaces, and tunnels",
    args: { description: "Object (addr, link, route, neigh, etc.) and command" },
    flags: {
      "addr": "Show or manipulate IP addresses on interfaces",
      "link": "Show or manipulate network interfaces",
      "route": "Show or manipulate the routing table",
      "neigh": "Show or manipulate ARP/neighbour entries",
      "netns": "Manage network namespaces",
      "rule": "Manage routing policy rules",
      "tunnel": "Manage tunnels",
      "show": "Show current state of object",
      "add": "Add a new address, route, or interface",
      "del": "Delete an address, route, or interface",
      "flush": "Flush addresses or routes",
      "up": "Bring an interface up",
      "down": "Bring an interface down",
      "-4": "Limit output to IPv4",
      "-6": "Limit output to IPv6",
      "-br": "Print output in brief format",
      "-c": "Use colour output",
      "-s": "Include statistics",
      "-h": "Human-readable statistics"
    }
  },

  zip: {
    description: "Package and compress files into a ZIP archive",
    args: { description: "ZIPFILE followed by FILE(s) to add" },
    flags: {
      "-r": "Recurse into directories",
      "-e": "Encrypt the archive with a password",
      "-9": "Best compression (slowest)",
      "-1": "Fastest compression",
      "-v": "Verbose — show each file being added",
      "-q": "Quiet mode",
      "-u": "Update — only add files newer than those in archive",
      "-d": "Delete files from the archive",
      "-x": "Exclude files matching a pattern",
      "-j": "Junk paths — store just the filename, not the full path",
      "-m": "Move — delete original files after adding to archive",
      "-T": "Test the archive for integrity"
    }
  },

  unzip: {
    description: "Extract files from a ZIP archive",
    args: { description: "ZIPFILE to extract, with optional FILES to extract selectively" },
    flags: {
      "-d": "Extract into a specific destination directory",
      "-l": "List archive contents without extracting",
      "-v": "Verbose listing with compression info",
      "-t": "Test the archive for integrity",
      "-o": "Overwrite existing files without prompting",
      "-n": "Never overwrite existing files",
      "-q": "Quiet mode",
      "-j": "Junk paths — extract all files into current directory",
      "-p": "Extract to pipe/stdout",
      "-x": "Exclude specific files from extraction",
      "-P": "Decrypt with password"
    }
  },

  vim: {
    description: "Vi IMproved — powerful terminal text editor",
    args: { description: "FILE(s) to open for editing" },
    flags: {
      "-n": "No swap file (useful for network filesystems)",
      "-R": "Read-only mode (view mode)",
      "-r": "Recover a crashed editing session",
      "-u": "Use a specific vimrc file",
      "-c": "Execute a command after opening the file",
      "+": "Start at the last line",
      "+N": "Start at line N",
      "-p": "Open multiple files in separate tabs",
      "-o": "Open multiple files in horizontally split windows",
      "-O": "Open multiple files in vertically split windows",
      "i": "Enter insert mode",
      ":wq": "Write and quit",
      ":q!": "Quit without saving",
      "dd": "Delete current line",
      "yy": "Yank (copy) current line",
      "/pattern": "Search forward for pattern"
    }
  },

  nano: {
    description: "Simple, beginner-friendly terminal text editor",
    args: { description: "FILE(s) to open for editing" },
    flags: {
      "-l": "Show line numbers",
      "-v": "View mode (read-only)",
      "-w": "Disable long line wrapping",
      "-c": "Constantly show cursor position",
      "-B": "Create a backup of the file before editing",
      "-i": "Auto-indent new lines",
      "-m": "Enable mouse support",
      "-T": "Set tab width",
      "+N": "Open the file at line N",
      "Ctrl+O": "Write (save) the file",
      "Ctrl+X": "Exit nano",
      "Ctrl+K": "Cut current line",
      "Ctrl+U": "Paste (uncut)",
      "Ctrl+W": "Search",
      "Ctrl+G": "Display help"
    }
  },

  htop: {
    description: "Interactive process viewer with mouse support",
    args: { description: "No required arguments — runs interactively" },
    flags: {
      "-u": "Show processes for a specific user only",
      "-p": "Show only listed PIDs",
      "-d": "Set update delay in tenths of seconds",
      "-s": "Sort by a column (e.g., PID, PERCENT_CPU)",
      "--no-color": "Disable colour",
      "F1": "Help",
      "F2": "Setup",
      "F3": "Search",
      "F4": "Filter",
      "F5": "Tree view",
      "F6": "Sort by",
      "F9": "Kill process",
      "F10": "Quit"
    }
  },

  journalctl: {
    description: "Query and display logs from the systemd journal",
    args: { description: "Optional unit name or match expression to filter by" },
    flags: {
      "-u": "Show logs for a specific systemd unit (service)",
      "-f": "Follow mode — tail the journal in real time",
      "-n": "Show the last N lines",
      "-r": "Reverse output (newest first)",
      "-e": "Jump to the end of the journal immediately",
      "-b": "Show logs from the current boot (-b -1 for previous boot)",
      "-k": "Show kernel messages only (dmesg equivalent)",
      "-p": "Filter by priority: emerg alert crit err warning notice info debug",
      "--since": "Show entries since a date/time (e.g., '2024-01-01 10:00')",
      "--until": "Show entries until a date/time",
      "--disk-usage": "Show how much disk space journal logs are using",
      "--vacuum-size": "Reduce journal to below the specified size",
      "--vacuum-time": "Remove journal entries older than specified time",
      "-o": "Output format: short, verbose, json, json-pretty, cat",
      "--no-pager": "Do not pipe output through a pager",
      "-x": "Add explanatory text from message catalog",
      "--list-boots": "List available boot sessions"
    }
  }
};

const PIPE_OPERATORS = {
  "|": { name: "Pipe", description: "Passes stdout of the left command as stdin to the right command" },
  ">": { name: "Redirect stdout", description: "Redirects stdout to a file, overwriting it" },
  ">>": { name: "Append stdout", description: "Redirects stdout to a file, appending to it" },
  "<": { name: "Redirect stdin", description: "Reads stdin from a file" },
  "2>": { name: "Redirect stderr", description: "Redirects stderr to a file" },
  "2>&1": { name: "Merge stderr→stdout", description: "Redirects stderr to the same destination as stdout" },
  "&": { name: "Background", description: "Runs the command in the background" },
  "&&": { name: "AND operator", description: "Runs the right command only if the left command succeeds (exit 0)" },
  "||": { name: "OR operator", description: "Runs the right command only if the left command fails (non-zero exit)" },
  ";": { name: "Command separator", description: "Runs commands sequentially regardless of exit status" }
};

function parseCommand(input) {
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
                  : `Flag for ${cmdKey} — check 'man ${cmdKey}' for details`
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
      // Unknown command — peek ahead to see if next token is known (e.g. git subcommand)
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
  const cmdData = COMMANDS[cmd];
  if (!cmdData) return "Option flag for the command";
  if (cmdData.flags[flag]) return cmdData.flags[flag];
  return `Flag for ${cmd} — check 'man ${cmd}' for details`;
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
  // Container image reference like nginx:latest or repo/image:tag
  if (/^[a-z0-9._/-]+:[a-z0-9._-]+$/.test(token) && !token.startsWith('-')) return `Container image reference: ${token}`;
  // Version strings like v1.2.3
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

    // Check for multi-char operators
    const two = input.slice(i, i + 3);
    if (two === "2>&1") {
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
