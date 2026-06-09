<p align="center">
  <img src="./assets/icon.ink.svg" alt="icon">
</p>

# Zirconia

スラッシュコマンドへのシンプルな返答、じゃんけん、ダイス、ガチャ機能を備えたDiscordボットです

## セットアップ

### 0. 事前に必要なもの
- [Discord](https://discord.com/)アカウント
- [Cloudflare](https://www.cloudflare.com/)アカウント
- [Node.js](https://nodejs.org/ja/download)のインストール
- [wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)のインストール
- ローカル環境で動作確認する場合、次のいずれか:
  - [cloudflared](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/)のインストール (Cloudflare Tunnelでトンネルする場合) 🌟おすすめ
  - [ngrok](https://ngrok.com/)アカウント (ngrokでトンネルする場合)

### 1. Discord・Cloudflareの設定
- **1.1**  Discordボット用のアプリケーションの作成・ボットのサーバーへ追加
  - [公式ドキュメント](https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers#creating-an-app-on-discord)の`Creating an app on Discord`, `Adding bot permissions`に従い、ボット用のアプリケーションを作成、ボットをサーバーへ追加する
- **1.2** `.dev.vars`にsecrets(機密情報)を保存 
  - **1.2.1** プロジェクトのルート(`package.json`や`.gitignore`と同じ階層)に`.dev.vars`という名前のファイルを作成
  - **1.2.2** `.dev.vars`に以下の形式でsecretsを保存

```env
DISCORD_TOKEN="{手順1.1で取得したトークン}"
DISCORD_PUBLIC_KEY="{手順1.1で取得したパブリックキー}"
DISCORD_APPLICATION_ID="{手順1.1で取得したアプリケーションID}"
```

例:
```env
DISCORD_TOKEN="YBNJRT3brLJM_VLiGkT46QkJDxhxu.YKVpl6R2Lc01_pVOgJhMVxF6KK0ext"
DISCORD_PUBLIC_KEY="8ad013a56d5b1225675dad1a6ecc72ed2c8788465e4fa3bb8555e"
DISCORD_APPLICATION_ID="141320486770036847239"
```

- **1.3** wranglerでDiscordのsecretsを保存
  - *1.1*で取得したトークン、パブリックキー、アプリケーションIDをそれぞれ以下のコマンドでwranglerに登録
  - (`wrangler`の初回実行時はブラウザを使った認証が行われる)
    - トークン: `wrangler secret put DISCORD_TOKEN`
    - パブリックキー: `wrangler secret put DISCORD_PUBLIC_KEY`
    - アプリケーションID: `wrangler secret put DISCORD_APPLICATION_ID`
  - *参考: [公式ドキュメント](https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers#storing-secrets)*

### 2. ローカル環境で動作確認をする
- **2.1** 依存関係のインストールのため、以下のコマンドを実行 (初回のみ)
  - `npm install`
- **2.2** サーバーを起動
  - `npm run start`
- **2.3** HTTPトンネルを起動
  - ローカルで動いているボットサーバーにDiscordからアクセスできるようにするため、HTTPトンネルを使用
  - 方法1: `cloudflared`を使用する場合
    - *2.2*とは別のシェルで `npm run tunnel` を実行
    - 表示されるURLをコピーしておく
  - 方法2: `ngrok`を使用する場合
    - *2.2*とは別のシェルで `npm run ngrok` を実行
    - 表示されるURLをコピーしておく
- **2.4** DiscordアプリケーションにURLを登録
  - **2.4.1** [My Applications | Discord Developer Portal](https://discord.com/developers/applications)から、*1.1*で作成したアプリケーションを選択
  - **2.4.2** `Interactions Endpoint URL`に*2.3*で表示されたURLをコピペする
  - `Save Changes`を押し、URLが正常に保存され、緑色で`All your edits have been carefully recorded.`と表示されることを確認
- **2.5** Discordでスラッシュコマンドなどを使用し、ボットが正常に動作することを確認
- *参考: [公式ドキュメント](https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers#running-locally)*

### 3. 手動でCloudflare Workersにデプロイ
- **3.1** 以下のコマンドを実行
  - `npm run publish`
- **3.2** 表示されたURL(`https://{Worker名}.{アカウント名}.workers.dev`という形式)を、*2.4*の手順でDiscordアプリケーションに登録 (初回のみ)
- **3.3** Discordでスラッシュコマンドなどを使用し、ボットが正常に動作することを確認
- *参考: [公式ドキュメント](https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers#deployment)*

### 4. GitHub Actions経由でCloudflare Workersにデプロイ (オプション)

- **4.1** Cloudflare Account ID の取得
  - [公式ドキュメント](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/#copy-your-account-id) に従う
    - 取得したIDは安全な場所に保存
- **4.2** APIトークンの取得
  - **4.2.1** [API Tokens | Cloudflare dashboard](https://dash.cloudflare.com/profile/api-tokens/) から、`Create Token` → `Create Custom Token`
  - **4.2.2** 適当な `Token name`を入力 (例:zirconia-github-actions)
  - **4.2.3** `Permissions`を設定
    - `Account - Workers Scripts - Edit`
  - **4.2.4** トークンを生成
    - `Continue to summary` → `Create Token`
  - **4.2.5** トークンをコピーし、安全な場所に保存
  - *参考: [Create API token · Cloudflare Fundamentals docs](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)*

- **4.3** GitHubレポジトリにSecretsを登録
  - **4.3.1** ブラウザでGitHubリポジトリを開く
  - **4.3.2** `Settings` → `Security and quality`カテゴリの`Secrets and variables` → `Actions`に移動
  - **4.3.3** `Repository secret`を作成
    - **4.3.3.1** Cloudflare Account ID
      - Name: `CF_ACCOUNT_ID`
      - Secret: *4.1*で取得したCloudflare Account ID
    - **4.3.3.2** APIトークン
      - Name: `CF_API_TOKEN`
      - Secret: *4.2*で取得したAPIトークン
    - **4.3.3.3** Discordトークン
      - Name: `DISCORD_TOKEN`
      - Secret: `.dev.vars`の`DISCORD_TOKEN`をコピペ
    - **4.3.3.4** DiscordアプリケーションID
      - Name: `DISCORD_APPLICATION_ID`
      - Secret: `.dev.vars`の`DISCORD_APPLICATION_ID`をコピペ

- **4.4** GitHub Actionsを実行
  - **4.4.1** GitHub Actionsによりワークフローが実行されることで、Cloudflare Workersにボットがデプロイされる
    - 方法1: GitHubのmainブランチに新たなコミットをする
      - (mainブランチへのコミットごとに、ワークフローが実行される)
    - 方法2: ブラウザでGitHubリポジトリを開き、`Actions`から最新のワークフローを選択し、再実行(`Re-run`)をする
  - **4.4.2** ワークフローが正常に実行されたかを確認
    - ブラウザでGitHubリポジトリを開き、 `Actions`から最新のワークフローが正常に完了しチェックマーク`✔`が付いているか確認

- **4.5** WorkerのURL(`https://{Worker名}.{アカウント名}.workers.dev`という形式)を、*2.4*の手順でDiscordアプリケーションに登録
- **4.6** Discordでスラッシュコマンドなどを使用し、ボットが正常に動作することを確認
- *参考: [公式ドキュメント](https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers#deployment)*

## リンク
### ドキュメント
- [Hosting a Reddit API Discord app on Cloudflare Workers - Documentation - Discord](https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers)
  - [discord/cloudflare-sample-app](https://github.com/discord/cloudflare-sample-app)の公式ドキュメント
  - Cloudflare WorkersでDiscordボットを動かす手順について解説されている
  - セットアップ手順はこのページの内容に沿って作成した

### レポジトリ
- [discord/cloudflare-sample-app](https://github.com/discord/cloudflare-sample-app)
  - Cloudflare WorkersベースのDiscordボットのサンプル
  - これをベースに開発
- [exteoi/MiniPotato](https://github.com/exteoi/MiniPotato)
  - じゃんけん、ダイス、ガチャ機能の参考にしました
