# 全国学生VRサークル活動報告大会 2026

Next.jsで制作した大会公式サイトです。

## ローカル開発

```bash
npm ci
npm run dev
```

`http://localhost:3000` を開いて確認します。

## 画像

表示する画像は `assets/` に元の画像（ロゴや制作物サムネイルは提出されたPNGなど）をそのまま置きます。縮小や変換は手で行いません。`assets/` は公開されません。

`npm run dev` と `npm run build` の前に `scripts/build-images.mts` が自動で動き、`assets/` の画像からAVIFとWebPの複数の幅の画像を `public/_img/` に書き出します。公開されるのは書き出した画像だけです。前回から変わっていない画像は作り直しません。

`public/` には、変換せずそのまま公開するもの（ページの端から出るアバター、OGP画像、ドメイン設定、検索エンジンの確認用ファイル）だけを置きます。

- 表示には `components/ui/Picture.tsx` の `<Picture>` を使います。ブラウザが対応している形式と、画面の幅や細かさに合った画像を自動で選び、ウィンドウを広げたときなどはより大きな画像に切り替えます。
- 書き出す幅や形式は `lib/images.ts` で決めます。ファビコンなど決まった名前のPNGも、ここに書いたとおりに書き出します。
- 書き出した画像（`public/_img/`）と一覧（`lib/generated/`）はgitに含めません。手動で作り直すときは `npm run images` を実行します。

## GitHub Pagesへの配信

1. GitHubのリポジトリで `Settings > Pages` を開く
2. `Build and deployment > Source` を `GitHub Actions` にする
3. `main` ブランチへpushする

`.github/workflows/deploy-pages.yml` が静的サイトをビルドし、GitHub Pagesへ配信します。プルリクエストでは、lint・型チェック・ビルドだけを行って公開はしません。書き出した画像はキャッシュし、変わった画像だけを作り直します。リポジトリ配下のパスと、Pagesに設定した独自ドメインのどちらにもビルド時に自動対応します。

## 検索エンジン登録

このサイトは `robots.txt`、`sitemap.xml`、canonical URL、OGP、検索エンジン検証用metaタグ、Schema.org JSON-LDを静的生成します。

各検索エンジンの管理画面で所有権確認を行う場合は、発行された検証コードをGitHub ActionsのSecretsまたはVariablesに設定してから再デプロイします。

```bash
NEXT_PUBLIC_SITE_URL=https://vrsc-2026.numa-meta.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
NEXT_PUBLIC_BING_SITE_VERIFICATION=...
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=...
NEXT_PUBLIC_YAHOO_SITE_VERIFICATION=...
NEXT_PUBLIC_BAIDU_SITE_VERIFICATION=...
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=...
```

デプロイ後、各サービスへ `https://vrsc-2026.numa-meta.com/sitemap.xml` を送信します。Google Search Console、Bing Webmaster Tools、Yandex Webmaster、Baidu Search Resource Platform、Naver Search Advisorなどに登録すると、主要検索エンジンから発見されやすくなります。

## 確認コマンド

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run build` の生成物は `out/` に出力されます。
