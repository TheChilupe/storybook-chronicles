# Local Development

How to run Storybook Chronicles with a local Supabase database on your own machine.

---

## Before you start

**1. Use Windows PowerShell. Not WSL, not Ubuntu, not Git Bash.**

These commands drive Docker Desktop on Windows, so they must run from Windows itself.
In VS Code, open the terminal dropdown (the `v` next to the `+` in the terminal panel)
and pick **PowerShell**. If you pick WSL or Ubuntu, the scripts will stop and tell you
to switch — they will not try to half-work.

**2. Docker Desktop must be installed.**

Download it from <https://www.docker.com/products/docker-desktop>. You do not need to
start it yourself — `npm run local:up` will launch it if it is closed and wait for it
to be ready.

**3. You do not need to install anything for the Supabase CLI.**

The scripts fetch a **version-pinned** CLI on demand via `npx --yes supabase@2.111.0`.
Nothing is installed globally. If a project-local `node_modules/.bin/supabase` ever
exists, the scripts prefer it automatically.

> **Do not run `npm install` right now.** It currently fails with an `ERESOLVE`
> error: `@tanstack/zod-adapter@1.167.0` requires peer `zod@^3.23.8`, but the project
> uses `zod@^4.4.3`, and no newer `zod-adapter` accepts zod 4. This is a pre-existing
> dependency-health issue, entirely separate from local Supabase startup, and it is
> tracked as its own piece of work. The `node_modules` directory already on disk is
> what the app builds against.
>
> Do **not** work around it with `--legacy-peer-deps` or `--force` — that rewrites the
> whole dependency tree and can break a currently-working build.

**4. You never create Docker containers yourself.**

Supabase creates and manages its own containers — database, API, Studio, storage and
so on. **Never run `docker run`, `docker compose up`, or create containers by hand for
this project**, and never start, stop or delete individual Supabase containers through
the Docker Desktop UI. The CLI owns the whole set and expects to manage them together;
hand-made containers will not be wired to the right network, ports or volumes.

If a container is missing or misbehaving, the fix is `npm run local:down` followed by
`npm run local:up` — not Docker.

---

## The commands

The three you need day to day:

```powershell
npm run local:up       # start (minimal stack — the normal workflow here)
npm run local:status   # read-only report
npm run local:down     # stop, keeping local data
```

And one optional extra:

```powershell
npm run local:up:full  # every service including Studio; may fail on this machine
```

### `npm run local:up` — start the stack (minimal, the normal workflow)

Checks you are in Windows PowerShell and at the repository root, confirms `node`,
`npm`, `npx` and `docker` are available, starts Docker Desktop if it is closed, waits
until the Docker engine actually answers, and only then starts the local Supabase
stack. It finishes by printing your local URLs and keys.

**This starts the minimal stack, and that is deliberate.** On this computer the full
stack does not fit in the memory available to Docker: the host has about 7.88 GB of
RAM and the WSL2 backend gives Docker roughly 3.76 GB, which the complete set of
services exceeds. Starting everything results in containers failing their health
checks, and `supabase start` then rolls the whole stack back.

Minimal mode starts **Postgres, Auth, REST, Realtime, Storage and Kong** — everything
needed to apply migrations and to verify database content. It skips Studio, analytics
(Logflare + Vector), edge functions, imgproxy, postgres-meta, mailpit and Supavisor.

Migrations apply exactly as they do in the full stack, so nothing about schema or
data verification is compromised. **The Studio web UI on port 54323 is not available
in this mode** — use `psql` or the app itself to inspect data.

The first run is slow — it downloads several Docker images. Later runs take well under
a minute.

### `npm run local:up:full` — start every service (optional)

Starts the complete stack, Studio included. **This is optional and may fail on this
computer** with `container is not ready: unhealthy`, for the memory reasons above. It
is kept for use on a machine with more RAM, or after closing memory-heavy applications.

If it fails, nothing is left running and no data is lost — fall back to
`npm run local:up`.

### `npm run local:status` — look, don't touch

Reports whether Docker is healthy and what the local Supabase stack is doing. It is
strictly read-only: it will not start Docker, will not start Supabase, and will not
change the database. If Docker is closed it simply tells you so.

Use this when you are unsure whether the stack is up.

### `npm run local:down` — stop everything, keep the data

Stops this project's Supabase containers. **Your local database content is preserved** —
the script deliberately never passes `--no-backup`. Unrelated Docker containers, images
and volumes belonging to your other projects are not touched.

Run this when you are done for the day, or when the stack is misbehaving and you want
a clean restart.

Once the stack is up, run the app itself the usual way:

```powershell
npm run dev
```

---

## Local Supabase vs. remote Supabase

These are two completely separate databases and it matters that you keep them straight.

| | **Local** | **Remote** |
|---|---|---|
| Where it runs | Docker on your PC | Supabase's servers |
| Started by | `npm run local:up` | always on |
| URL | `http://127.0.0.1:54321` | the hosted project URL |
| Studio | `http://127.0.0.1:54323` — **not started in minimal mode** | app.supabase.com |
| Contains | test data you can break freely | the real project data |
| Safe to experiment on | yes | no |

The keys printed by `local:up` and `local:status` are **local-only** keys. They are the
same for every developer, they are not secrets, and they do not work against the remote
project.

The remote project id lives in `supabase/config.toml`. Migration files in
`supabase/migrations/` are the shared source of truth for schema and canonical content
in both places — including the canonical character profile imports. Do not edit an
existing migration that has already been applied; add a new one.

---

## What is deliberately *not* part of this workflow

Phase 1 is local startup only. The following are out of scope and should not be run as
part of day-to-day local development:

- **`supabase db reset`** — wipes your local database and replays every migration.
  It is not a troubleshooting step for a stack that will not start.
- **`supabase db push`** — applies migrations to the **remote** project. That is a
  deliberate release action, not something you do while developing.
- **Any other remote database command.**
- **Pushing to GitHub** — committing and pushing is a separate, deliberate decision.
- **Docker cleanup commands** — `docker system prune`, `docker volume rm`, and Docker
  Desktop's "Clean / Purge data" all destroy local database volumes.

None of the `local:*` scripts do any of these. They will not do them behind your back,
and they will not suggest them when something breaks.

---

## Troubleshooting

### "read-only file system"

Docker sometimes reports a read-only filesystem after a Windows update, a sleep/resume
cycle, or a WSL hiccup. **This is a Docker problem, not a problem with your repository
or your data.** Work through these in order and stop as soon as it works:

1. Right-click the Docker whale in the system tray → **Quit Docker Desktop**. Wait about
   ten seconds, reopen Docker Desktop, and wait for the status to read
   **Engine running**.
2. If it persists, restart the WSL backend from Windows PowerShell, then reopen Docker
   Desktop:
   ```powershell
   wsl --shutdown
   ```
3. If it still persists: Docker Desktop → **Troubleshoot** → **Restart**.
4. As a last resort, reboot Windows.

Then run `npm run local:up` again.

> **Do not use Docker Desktop's "Clean / Purge data" or "Reset to factory defaults"**
> to fix this. Those delete every Docker volume on the machine, including your local
> Supabase database. This guide will never tell you to purge Docker data, and the
> scripts will never do it automatically.

### "container is not ready: unhealthy"

The images downloaded fine; the containers just could not report healthy inside the
CLI's timeout. This is nearly always memory pressure, not a network problem.

Check what Docker actually has:

```powershell
docker info --format 'CPUs: {{.NCPU}} | Mem: {{.MemTotal}}'
```

On a 7.88 GB machine the WSL2 default gives Docker roughly 3.76 GB, which the full
stack can exceed.

If you hit this after running `npm run local:up:full`, use the default minimal stack
instead — it is the supported workflow on this computer:

```powershell
npm run local:up
```

If minimal mode itself fails, close memory-heavy apps (browsers especially), then
`npm run local:down` followed by `npm run local:up`. Note that a failed
`supabase start` rolls back every container it created, so a failed attempt leaves
nothing running and costs you no data.

### Docker Desktop won't start

Open it manually from the Start menu and watch the bottom-left status indicator. A first
launch after a Windows update can genuinely take several minutes. Once it reads
**Engine running**, re-run `npm run local:up`.

### "port is already in use"

Something else is on a port Supabase needs — usually 54321, 54322 or 54323. That is
normally a second Supabase instance or a locally installed Postgres.

```powershell
npm run local:down
npm run local:up
```

If it still fails, find what owns the port and stop that program yourself:

```powershell
Get-NetTCPConnection -LocalPort 54322 | Select-Object OwningProcess
Get-Process -Id <OwningProcess>
```

The scripts will not kill processes for you.

### "cannot be loaded because running scripts is disabled"

The npm commands already pass `-ExecutionPolicy Bypass`, so this should not happen via
`npm run`. If you are calling a `.ps1` file directly, go through npm instead.

### The scripts say I'm in WSL, but I'm not

Check the VS Code terminal dropdown — a previous session may have left WSL as the
default profile. Pick **PowerShell** and open a new terminal.

---

## Files involved

| Path | Purpose |
|---|---|
| `scripts/local-up.ps1` | start Docker if needed, then the Supabase stack |
| `scripts/local-status.ps1` | read-only health and status report |
| `scripts/local-down.ps1` | stop the stack, preserving local data |
| `scripts/lib/local-common.ps1` | shared checks and error guidance |
| `supabase/config.toml` | Supabase project configuration |
| `supabase/migrations/` | schema and canonical content migrations |
