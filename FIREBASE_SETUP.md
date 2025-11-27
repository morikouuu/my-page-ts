# Firebase セットアップ手順

## 1. 管理者ユーザーの作成

### ステップ 1: Firebase Authentication でユーザーを作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクトを選択
3. 左メニューから「Authentication」をクリック
4. 「ユーザーを追加」ボタンをクリック
5. メールアドレスとパスワードを入力してユーザーを作成
6. **作成されたユーザーの UID をコピー**（後で使用します）

### ステップ 2: Firestore に管理者ドキュメントを作成

1. Firebase Console で「Firestore Database」をクリック
2. 「データ」タブを選択
3. 「コレクションを開始」をクリック
4. コレクション ID に `users` と入力
5. ドキュメント ID に **ステップ 1 でコピーした UID** を貼り付け
6. フィールドを追加：
   - フィールド名: `role`
   - 型: `文字列`
   - 値: `admin`
7. 「保存」をクリック

### 完成例

```
コレクション: users
ドキュメントID: [ユーザーのUID]
フィールド:
  - role: "admin" (文字列)
```

## 2. セキュリティルールの設定

Firebase Console の「Firestore Database」→「ルール」タブで以下を設定：

### 開発用（簡易版 - 動作確認用）

まずはこのルールで動作確認してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 認証済みユーザーのみアクセス可能
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 本番用（推奨版）

動作確認後、以下のルールに変更してください。公開済みブログは認証なしで読み取り可能です：

#### オプション 1: シンプル版（推奨）

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ヘルパー関数：管理者チェック
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ブログコレクション
    match /blogs/{blogId} {
      // 個別ドキュメントの読み取り（公開済みブログは全員が閲覧可能）
      allow get: if resource.data.published == true || isAdmin();

      // コレクション全体の取得（list操作）
      // 認証なしでも取得可能（アプリ側でフィルタリング）
      allow list: if true;

      // 管理者のみが作成・更新・削除可能
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // ユーザーコレクション
    match /users/{userId} {
      // 本人と管理者のみが閲覧可能
      allow read: if request.auth != null &&
                    (request.auth.uid == userId || isAdmin());

      // 管理者のみが作成・更新可能
      allow write: if isAdmin();
    }
  }
}
```

#### オプション 2: より厳密な版（リスト取得時も対応）

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ヘルパー関数：管理者チェック
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // ブログコレクション
    match /blogs/{blogId} {
      // 個別ドキュメントの読み取り
      allow get: if resource.data.published == true || isAdmin();

      // リスト取得（公開済みのみ、または管理者はすべて）
      allow list: if isAdmin() ||
                    (request.auth == null && resource.data.published == true);

      // 管理者のみが作成・更新・削除可能
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // ユーザーコレクション
    match /users/{userId} {
      // 本人と管理者のみが閲覧可能
      allow read: if request.auth != null &&
                    (request.auth.uid == userId || isAdmin());

      // 管理者のみが作成・更新可能
      allow write: if isAdmin();
    }
  }
}
```

**注意**:

- オプション 1 はシンプルですが、リスト取得時に`published`フィールドでフィルタリングできない場合があります
- オプション 2 はより厳密ですが、`list`ルールが複雑になる可能性があります
- まずはオプション 1 を試してください

## 3. 動作確認

1. アプリケーションでログインページ（`/login`）にアクセス
2. ステップ 1 で作成したメールアドレスとパスワードでログイン
3. ブログ管理画面（`/admin/index`）にアクセスできることを確認
4. 「新規投稿」ボタンでブログを作成
5. `blogs`コレクションが自動的に作成されることを確認

## 注意事項

- `blogs`コレクションは最初のブログ作成時に自動的に作成されます
- `users`コレクションは手動で作成する必要があります
- セキュリティルールを設定しないと「Missing or insufficient permissions」エラーが発生します
