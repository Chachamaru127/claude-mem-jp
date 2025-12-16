# claude-mem-japanese

[claude-mem](https://github.com/thedotmack/claude-mem) プラグインの出力を自動的に日本語化するClaude Codeプラグインです。

## 機能

- Claude Code セッション開始時に自動で日本語化パッチを適用
- claude-mem がアップデートされても自動的に再適用
- バックアップ自動作成で安全に適用

## インストール

### 1. マーケットプレースを追加

```bash
/plugin marketplace add Chachamaru127/claude-mem-jp
```

### 2. プラグインをインストール

```bash
/plugin install claude-mem-japanese@claude-mem-jp
```

## 前提条件

- [claude-mem](https://github.com/thedotmack/claude-mem) プラグインがインストールされていること

```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@thedotmack
```

## 動作の仕組み

1. SessionStart 時に `prompts.ts` をチェック
2. `LANGUAGE` セクションがなければパッチを適用
3. ビルド → マーケットプレース同期 → ワーカー再起動

## ログ

ログは以下に保存されます：

```
~/.claude-mem/japanese-patch/logs/patch-YYYY-MM-DD.log
```

## バックアップ

パッチ適用前のファイルは自動的にバックアップされます：

```
~/.claude-mem/japanese-patch/backups/
```

## ライセンス

MIT
