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

```bash
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem@thedotmack
```

## 動作の仕組み

1. SessionStart 時に `prompts.ts` をチェック
2. `LANGUAGE` セクションがなければパッチを適用
3. ビルド → マーケットプレース同期 → ワーカー再起動

## トラブルシューティング

### 日本語化が適用されない場合

パッチ適用後も英語で記録される場合は、MCP サーバープロセスが再起動されていない可能性があります。

1. **Claude Code を完全に終了**
2. **ターミナルで以下を実行**:
   ```bash
   pkill -f "mcp-server.cjs"
   pkill -f "worker-service.cjs"
   ```
3. **Claude Code を再起動**

### パッチ適用状況の確認

```bash
# パッチが適用されているか確認
grep -n "LANGUAGE\|Japanese" ~/.claude/plugins/marketplaces/thedotmack/src/sdk/prompts.ts

# 動作中プロセスの確認
ps aux | grep -E "(worker-service|mcp-server)" | grep -v grep

# ワーカーログの確認
cat ~/.claude-mem/logs/worker-$(date +%Y-%m-%d).log | tail -20
```

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
