#!/usr/bin/env node
/**
 * claude-mem 日本語化パッチャー
 *
 * SessionStart時に自動実行され、claude-memプラグインの
 * prompts.tsに日本語化パッチが適用されているかチェックし、
 * 必要に応じてパッチを適用します。
 *
 * @author Tachibana Shuuta
 * @version 1.2.0
 * @requires claude-mem@thedotmack プラグインがインストールされていること
 *
 * 変更履歴:
 * - v1.2.0: パッチ適用時は常に再起動案内を表示（マーカーファイル判定を廃止）
 * - v1.1.1: pkillの対象をclaude-memのみに限定（他のMCPサーバーに影響を与えない）
 * - v1.1.0: 初回パッチ適用時のClaude Code再起動案内を追加
 *           MCPサーバープロセスの停止処理を追加
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const PROMPTS_FILE = join(HOME, '.claude/plugins/marketplaces/thedotmack/src/sdk/prompts.ts');
const PLUGIN_DIR = join(HOME, '.claude/plugins/marketplaces/thedotmack');
const LOG_DIR = join(HOME, '.claude-mem/japanese-patch/logs');
const LOG_FILE = join(LOG_DIR, `patch-${new Date().toISOString().split('T')[0]}.log`);

// ログ関数
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [claude-mem-jp] ${message}`;

  try {
    if (!existsSync(LOG_DIR)) {
      mkdirSync(LOG_DIR, { recursive: true });
    }
    writeFileSync(LOG_FILE, logMessage + '\n', { flag: 'a' });
  } catch (e) {
    // ログ書き込み失敗は無視
  }

  // stderr に出力（hook の結果として表示される）
  console.error(logMessage);
}

// コマンド実行関数
function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    timeout: options.timeout || 60000,
    encoding: 'utf-8',
    stdio: 'pipe'
  });

  if (result.error) {
    throw result.error;
  }

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    status: result.status
  };
}

// メイン処理
async function main() {
  try {
    // prompts.ts が存在するかチェック（claude-memがインストールされているか）
    if (!existsSync(PROMPTS_FILE)) {
      // claude-memがインストールされていない場合は静かに終了
      process.exit(0);
    }

    // ファイル内容を読み込み
    const content = readFileSync(PROMPTS_FILE, 'utf-8');

    // 既に日本語化されているかチェック
    if (content.includes('LANGUAGE') && content.includes('Japanese')) {
      // 既に適用済みの場合は静かに終了（ログは残す）
      log('既に日本語化済み。スキップ。');
      process.exit(0);
    }

    log('===== claude-mem 日本語化パッチ適用開始 =====');

    // バックアップ作成
    const backupDir = join(HOME, '.claude-mem/japanese-patch/backups');
    if (!existsSync(backupDir)) {
      mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = join(backupDir, `prompts.ts.backup.${Date.now()}`);
    copyFileSync(PROMPTS_FILE, backupFile);
    log(`バックアップ作成: ${backupFile}`);

    // パッチを適用
    let patchedContent = content;

    // パッチ1: buildInitPrompt - 最初の "OUTPUT FORMAT" の前に LANGUAGE セクションを追加
    let firstReplaced = false;
    patchedContent = patchedContent.replace(/OUTPUT FORMAT\n-+\nOutput observations using this XML structure:/g, (match) => {
      if (!firstReplaced) {
        firstReplaced = true;
        return `LANGUAGE\n--------\nWrite all output content (title, subtitle, facts, narrative) in Japanese (日本語).\n\n${match}`;
      }
      return match;
    });

    // パッチ2: buildSummaryPrompt - "Respond in this XML format:" の前に LANGUAGE を追加
    patchedContent = patchedContent.replace(
      /Respond in this XML format:\n<summary>/g,
      `LANGUAGE: Write all output content (request, investigated, learned, completed, next_steps, notes) in Japanese (日本語).\n\nRespond in this XML format:\n<summary>`
    );

    // パッチ3: buildContinuationPrompt - 2つ目の "OUTPUT FORMAT" の前に LANGUAGE セクションを追加
    let outputFormatCount = 0;
    patchedContent = patchedContent.replace(/OUTPUT FORMAT\n-+\nOutput observations using this XML structure:/g, (match) => {
      outputFormatCount++;
      if (outputFormatCount === 2) {
        return `LANGUAGE\n--------\nWrite all output content (title, subtitle, facts, narrative) in Japanese (日本語).\n\n${match}`;
      }
      return match;
    });

    // 適用確認
    if (!patchedContent.includes('LANGUAGE')) {
      log('エラー: パッチ適用に失敗しました');
      process.exit(1);
    }

    // ファイルに書き込み
    writeFileSync(PROMPTS_FILE, patchedContent, 'utf-8');
    log('パッチ適用完了');

    // 依存関係のインストール（アップデート後にnode_modulesが不完全な場合の対策）
    log('依存関係を確認中...');
    try {
      const installResult = runCommand('npm', ['install'], {
        cwd: PLUGIN_DIR,
        timeout: 120000
      });
      if (installResult.status !== 0) {
        log(`依存関係インストール警告: ${installResult.stderr}（続行）`);
      } else {
        log('依存関係の確認完了');
      }
    } catch (e) {
      log(`依存関係インストール警告: ${e.message}（続行）`);
    }

    // ビルド実行
    log('ビルド開始...');
    try {
      const buildResult = runCommand('npm', ['run', 'build'], {
        cwd: PLUGIN_DIR,
        timeout: 60000
      });
      if (buildResult.status !== 0) {
        throw new Error(buildResult.stderr || 'Build failed');
      }
      log('ビルド成功');
    } catch (e) {
      log(`ビルドエラー: ${e.message}`);
      process.exit(1);
    }

    // マーケットプレース同期
    log('マーケットプレース同期開始...');
    try {
      const syncResult = runCommand('npm', ['run', 'sync-marketplace'], {
        cwd: PLUGIN_DIR,
        timeout: 60000
      });
      if (syncResult.status === 0) {
        log('マーケットプレース同期成功');
      } else {
        log(`マーケットプレース同期警告: ${syncResult.stderr}（続行）`);
      }
    } catch (e) {
      log(`マーケットプレース同期警告: ${e.message}（続行）`);
    }

    // ワーカー再起動
    log('ワーカー再起動中...');
    try {
      runCommand('bun', ['plugin/scripts/worker-cli.js', 'stop'], {
        cwd: PLUGIN_DIR,
        timeout: 10000
      });
    } catch (e) {
      // 停止に失敗しても続行
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      runCommand('bun', ['plugin/scripts/worker-cli.js', 'start'], {
        cwd: PLUGIN_DIR,
        timeout: 10000
      });
      log('ワーカー再起動完了');
    } catch (e) {
      log(`ワーカー起動警告: ${e.message}`);
    }

    // MCPサーバープロセスを停止（古いプロセスが日本語化前のコードを使用している問題を解決）
    // thedotmackのclaude-memのみを対象にし、他のMCPサーバーに影響を与えない
    log('claude-mem MCPサーバープロセスを停止中...');
    try {
      const pkillResult = runCommand('pkill', ['-f', 'thedotmack.*mcp-server.cjs'], {
        timeout: 5000
      });
      if (pkillResult.status === 0) {
        log('claude-mem MCPサーバープロセスを停止しました');
      }
    } catch (e) {
      // プロセスが存在しない場合は無視
      log('claude-mem MCPサーバープロセス停止: 対象プロセスなし（正常）');
    }

    log('===== claude-mem 日本語化パッチ適用完了 =====');

    // パッチ適用時は常に再起動案内を表示（初回・再適用問わず再起動が必要なため）
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('  ✅ claude-mem 日本語化パッチを適用しました');
    console.log('');
    console.log('  【重要】日本語化を完全に有効にするには Claude Code を再起動してください。');
    console.log('');
    console.log('  現在のセッションでは、既に起動済みのMCPサーバーが');
    console.log('  古いコードを使用している可能性があります。');
    console.log('');
    console.log('  再起動後、claude-memの記録は日本語で保存されます。');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    log('パッチ適用完了: ユーザーに再起動を案内');

  } catch (error) {
    log(`エラー: ${error.message}`);
    process.exit(1);
  }
}

main();
