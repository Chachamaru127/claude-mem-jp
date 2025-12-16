# claude-mem-jp

[claude-mem](https://github.com/thedotmack/claude-mem) プラグインの出力を自動的に日本語化するClaude Codeプラグインです。

## 概要

このリポジトリは、claude-memプラグインの出力を日本語化するためのプラグイン（`claude-mem-japanese-marketplace`）を含んでいます。

## インストール

詳細なインストール手順は、[claude-mem-japanese-marketplace](./claude-mem-japanese-marketplace/README.md) を参照してください。

### クイックスタート

```bash
# マーケットプレースを追加
/plugin marketplace add Chachamaru127/claude-mem-jp

# プラグインをインストール
/plugin install claude-mem-japanese@claude-mem-jp

# Claude Code を再起動
```

## 機能

- Claude Code セッション開始時に自動で日本語化パッチを適用
- claude-mem がアップデートされても自動的に再適用
- バックアップ自動作成で安全に適用

## 前提条件

- [claude-mem](https://github.com/thedotmack/claude-mem) プラグインがインストールされていること

## ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照してください。

## リポジトリ構造

```
.
├── claude-mem-japanese-marketplace/  # プラグイン本体（Gitサブモジュール）
├── LICENSE                           # MITライセンス
└── README.md                         # このファイル
```

## 関連リンク

- [claude-mem-japanese-marketplace](./claude-mem-japanese-marketplace/) - プラグイン本体
- [GitHub リポジトリ](https://github.com/Chachamaru127/claude-mem-jp)

