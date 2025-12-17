# claude-mem-jp

[![Version](https://img.shields.io/badge/version-1.2.1-blue.svg)](https://github.com/Chachamaru127/claude-mem-jp)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

[claude-mem](https://github.com/thedotmack/claude-mem) プラグインの出力を自動的に日本語化する Claude Code プラグインです。

## 機能

- Claude Code セッション開始時に自動で日本語化パッチを適用
- claude-mem がアップデートされても自動的に再適用
- バックアップ自動作成で安全に適用
- 依存関係の自動補完（v1.2.0+）

## 前提条件

- [Claude Code](https://claude.com/claude-code) がインストールされていること
- [claude-mem](https://github.com/thedotmack/claude-mem) プラグインがインストールされていること

## インストール

### 1. マーケットプレースを追加

```
/plugin marketplace add Chachamaru127/claude-mem-jp
```

### 2. プラグインをインストール

```
/plugin install claude-mem-japanese@claude-mem-jp
```

### 3. Claude Code を再起動（重要）

MCPサーバープロセスが古いコードを使用しているため、再起動が必要です。

**方法1**: Claude Code を終了して再起動

**方法2**: MCPサーバープロセスを停止
```bash
pkill -f "thedotmack.*mcp-server"
```

再起動後、次のセッションから claude-mem の記録が日本語で保存されます。

## 動作確認

パッチの適用状況は以下のコマンドで確認できます：

```bash
grep "LANGUAGE" ~/.claude/plugins/marketplaces/thedotmack/src/sdk/prompts.ts
```

「LANGUAGE」と「Japanese」が含まれていれば、パッチは正常に適用されています。

## トラブルシューティング

### 日本語化されない場合

1. claude-mem プラグインが先にインストールされているか確認
2. Claude Code を完全に再起動
3. `pkill -f "thedotmack.*mcp-server"` でMCPサーバーを停止してから再度起動

### ビルドエラーが発生する場合

v1.2.0 以降は自動的に依存関係を補完するため、通常は発生しません。
手動で修正する場合：

```bash
cd ~/.claude/plugins/marketplaces/thedotmack && npm install
```

### パッチ適用ログの確認

```bash
cat ~/.claude-mem/japanese-patch/logs/patch-$(date +%Y-%m-%d).log
```

## リポジトリ構造

```
claude-mem-jp/
├── .claude-plugin/
│   └── plugin.json         # プラグイン定義
├── hooks/
│   └── hooks.json          # SessionStart フック
├── scripts/
│   └── check-and-patch.js  # 日本語化パッチスクリプト
├── README.md
├── package.json
└── LICENSE
```

## 更新履歴

### v1.2.1 (2024-12-17)
- README.md を更新
- ドキュメントの改善

### v1.2.0 (2024-12-17)
- ビルド前に `npm install` を自動実行するように修正
- claude-mem アップデート後の esbuild モジュール解決エラーを修正

### v1.1.0
- 初回パッチ適用時の Claude Code 再起動案内を追加
- MCP サーバープロセスの停止処理を追加

### v1.0.0
- 初回リリース

## ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照してください。

## 関連リンク

- [claude-mem](https://github.com/thedotmack/claude-mem) - 元のプラグイン
- [Claude Code](https://claude.com/claude-code) - Claude Code 公式サイト

## Author

Tachibana Shuuta ([@Chachamaru127](https://github.com/Chachamaru127))
