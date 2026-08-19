# Security Specification & Test Payloads (Daily Care 🐼)

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or written by the authenticated user whose `request.auth.uid == userId`.
2. **Notification Integrity Invariant**: A notification document at `/notifications/{notificationId}` can only be created if `incoming().senderId == request.auth.uid`.
3. **Recipient Privacy Invariant**: A notification can only be read (`get` or `list`) by the recipient user (`resource.data.recipientId == request.auth.uid`) or the sender (`resource.data.senderId == request.auth.uid`).
4. **Update Lockdown Invariant**: Notifications are append-only except for the `read` status and `actionTaken` fields which can only be updated by the recipient (`resource.data.recipientId == request.auth.uid`).
5. **Schema & String Length Limits**: Message size is strictly limited to 500 characters; titles and names to 100 characters; emojis to 10 characters.
6. **No Client Query Delegation**: Security rules explicitly enforce that `allow list` evaluates `resource.data.recipientId == request.auth.uid || resource.data.senderId == request.auth.uid`.

## 2. The "Dirty Dozen" Threat Payloads (Must Return PERMISSION_DENIED)
1. **Payload 1 (Unauthenticated write)**: Attempting to create a notification without `request.auth`.
2. **Payload 2 (Sender Spoofing)**: Creating a notification where `senderId` is set to someone else's UID.
3. **Payload 3 (Overlong Message Attack)**: Notification message exceeding 500 characters.
4. **Payload 4 (Ghost Field Injection)**: Injecting `isAdmin: true` into `/users/{userId}` during profile update.
5. **Payload 5 (Cross-User Read)**: User A attempting to `get` User B's notification.
6. **Payload 6 (Unauthorized List Query)**: User A querying notifications without matching recipient or sender UID.
7. **Payload 7 (Sender Identity Mutation)**: Updating a notification to change the `senderId` or `recipientId`.
8. **Payload 8 (Message Content Tampering)**: Modifying the `message` or `title` after creation.
9. **Payload 9 (Cross-User Profile Hijack)**: User A writing to `/users/userB`.
10. **Payload 10 (Delete Lockdown)**: Non-owner trying to delete a user or notification document.
11. **Payload 11 (Invalid ID Injection)**: Document ID containing non-alphanumeric or path traversal characters.
12. **Payload 12 (Invalid Enum Values)**: Sending notification with an unknown type like `"malicious_type"`.
