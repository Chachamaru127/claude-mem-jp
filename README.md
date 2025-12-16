# claude-mem-jp

[claude-mem](https://github.com/thedotmack/claude-mem) プラグインの出力を自動的に日本語化する Claude Code プラグインです。

## 機能

- Claude Code セッション開始時に自動で日本語化パッチを適用
- claude-mem がアップデートされても自動的に再適用
- バックアップ自動作成で安全に適用

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
pkill -f "claude-mem"
```

再起動後、次のセッションから claude-mem の記録が日本語で保存されます。

## 動作確認

パッチの適用状況は以下のコマンドで確認できます：

```bash
cat ~/.claude/plugins/marketplaces/thedotmack/claude-mem/src/prompts.ts | grep -A2 "session_start_prompt"
```

「日本語で記述してください」という文字列が含まれていれば、パッチは正常に適用されています。

## トラブルシューティング

### 日本語化されない場合

1. claude-mem プラグインが先にインストールされているか確認
2. Claude Code を完全に再起動
3. `pkill -f "claude-mem"` でMCPサーバーを停止してから再度起動

### パッチ適用ログの確認

```bash
cat ~/.claude-mem-japanese/patch.log
```

## リポジトリ構造

```
claude-mem-jp/
├── .claude-plugin/
│   ├── marketplace.json    # マーケットプレース定義
│   └── plugin.json         # プラグイン定義
├── hooks/
│   └── hooks.json          # SessionStart フック
├── scripts/
│   └── check-and-patch.js  # 日本語化パッチスクリプト
├── README.md
├── package.json
└── LICENSE
```

## ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照してください。

## 関連リンク

- [claude-mem](https://github.com/thedotmack/claude-mem) - 元のプラグイン
- [Claude Code](https://claude.com/claude-code) - Claude Code 公式サイト

## Author

Tachibana Shuuta ([@Chachamaru127](https://github.com/Chachamaru127))
