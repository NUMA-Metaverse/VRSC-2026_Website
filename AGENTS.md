<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Development & Operations Guidelines

### 1. External Communication & Text Formatting (PRs, Issues, Commits)
- プルリクエストのコメント、Issue、コミットメッセージ等を作成する際、過剰な装飾（インラインコード記号や不要なエスケープ等）は行わない。
- シェル環境（PowerShell等）経由でテキストを送信する際は、エスケープ事故（バックスラッシュの意図せぬ混入、文字化け等）を防止するため、過度な装飾を排したプレーンテキストを基本とする。

### 2. Assets & Naming Conventions
- Web公開されるファイルパス、アセット名、データ定義に個人名（提出者の本名等）を含めない。
- 画像ファイル名は標準化する（活動報告ロゴは `logo.webp`、制作物サムネイルは `thumbnail.webp`）。
- ディレクトリ名は個人名ではなく作品タイトルまたはサークル名を使用する。
