# PhysicsLab

ブラウザー上で動作する物理シミュレーターです。Position Based Dynamics（PBD）を用いて、物体の動きや衝突を計算します。

- [使い方・仕様のドキュメント](https://lab.takadev.jp/docs)
- [不具合報告・改善提案](https://github.com/Taka005/PhysicsLab/issues)

![スクリーンショット](./screenshot.png)

## ローカルで実行する

Bunをインストール後、リポジトリのルートで次のコマンドを実行します。

```bash
bun install --frozen-lockfile
bun dev
```

開発サーバーが表示するURLをブラウザーで開いてください。

## ビルド

```bash
bun run build
```

静的サイトが`out/`に出力されます。開発手順や構成の詳細は[開発ドキュメント](https://lab.takadev.jp/docs/development)を参照してください。
