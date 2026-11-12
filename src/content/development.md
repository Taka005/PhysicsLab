---
title: 開発
description: PhysicsLabのローカル開発、ビルド、ドキュメントの編集
---

# 開発

## 必要なもの

- [Bun](https://bun.sh/)（CIでは1.2.14を使用）
- Git

## セットアップと実行

リポジトリを取得し、依存関係をインストールして開発サーバーを起動します。

```bash
git clone https://github.com/Taka005/PhysicsLab.git
cd PhysicsLab
bun install --frozen-lockfile
bun dev
```

ターミナルに表示されたローカルURLをブラウザーで開きます。開発サーバーの終了は`Ctrl+C`です。

## ビルド

```bash
bun run build
```

Next.jsの静的サイト出力は`out/`に生成されます。GitHub Actionsは`main`へのpushまたは手動実行でこのビルドを行い、GitHub Pagesへデプロイします。Pages用のベースパスはビルド時に`NEXT_BASE_PATH`環境変数で設定されます。

現在、`package.json`には専用のテスト・lintコマンドは定義されていません。変更後は少なくとも`bun run build`で静的ビルドを確認してください。

## ドキュメントの編集

ユーザー向けドキュメントは`src/content/`内のMarkdownファイルです。ページを追加する場合は同じディレクトリに`.md`ファイルを作成し、先頭に次の形式のフロントマターを記述します。

```md
---
title: ページ名
description: ページの概要
---
```

ドキュメントのサイドバーはページ一覧から自動生成されます。画面操作やスクリプトの仕様を変更した場合は、関連するドキュメントも更新してください。

## 主な構成

| パス | 内容 |
|---|---|
| `src/app/` | Next.jsの画面、レイアウト、ドキュメントページ |
| `src/components/` | キャンバス、コントロールパネル、各UI |
| `src/context/`、`src/hooks/` | UI状態とキャンバス操作 |
| `src/lib/engine/` | 物理エンジン、物体、ワールドデータ |
| `src/lib/script/` | スクリプトの字句解析、構文解析、変換 |
| `src/lib/render/` | PixiJS描画、画像・GIF出力 |
| `src/content/` | Markdownドキュメント |

## 利用技術

Next.js、React、TypeScriptを基盤に、Nextraでドキュメントを表示し、PixiJSでキャンバスを描画します。物理計算にはPosition Based Dynamicsを用いています。
