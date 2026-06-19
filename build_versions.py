#!/usr/bin/env python3
"""Generate a viewable snapshot for every commit that touched index.html.
Each snapshot lives at versions/<sha7>/ and shares the root /assets/ (so it's tiny).
Writes versions.json (newest-first) for admin.html. Run from repo root."""
import json, os, subprocess, shutil

def git(*a):
    return subprocess.run(['git', *a], capture_output=True, text=True)

# commits that changed index.html, oldest -> newest
log = git('log', '--reverse', '--format=%H|%cs|%s', '--', 'index.html').stdout.strip().splitlines()
commits = [l.split('|', 2) for l in log if l]

# clean previously generated per-commit snapshots (keep nothing stale)
vroot = 'versions'
os.makedirs(vroot, exist_ok=True)
for d in os.listdir(vroot):
    p = os.path.join(vroot, d)
    if os.path.isdir(p) and d not in ('original', 'investor'):
        shutil.rmtree(p)

entries = []
n = len(commits)
for i, (sha, date, subj) in enumerate(commits, 1):
    sha7 = sha[:7]
    is_live = (i == n)
    # export index.html at this commit, repoint assets/ to the shared root
    idx = git('show', f'{sha}:index.html').stdout
    idx = idx.replace('"assets/', '"../../assets/').replace("'assets/", "'../../assets/")
    d = os.path.join(vroot, sha7)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, 'index.html'), 'w') as f:
        f.write(idx)
    # carry that commit's studio.js if it had one (index references it locally)
    sj = git('show', f'{sha}:studio.js')
    if sj.returncode == 0:
        with open(os.path.join(d, 'studio.js'), 'w') as f:
            f.write(sj.stdout)
    entries.append({
        'id': sha7,
        'name': f'v{i} · {sha7}',
        'status': 'LIVE' if is_live else 'commit',
        'date': date,
        'vibe': subj,
        'changes': f'commit {sha7}',
        'url': './' if is_live else f'versions/{sha7}/index.html',
        'branch': sha7,
    })
    # a real git ref per version
    git('tag', '-f', f'v{i}', sha)

entries.reverse()  # newest first
with open('versions.json', 'w') as f:
    json.dump(entries, f, indent=2)
print(f'generated {n} versions -> versions.json (+ tags v1..v{n})')
for e in entries:
    print(f"  {e['name']}  {e['date']}  {e['status']:6}  {e['vibe'][:60]}")
