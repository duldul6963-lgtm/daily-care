import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CareNotificationItem, UserProfile } from '../types';

/**
 * Subscribe to real-time notifications for the logged-in recipient
 */
export function subscribeToRecipientNotifications(
  recipientId: string,
  onUpdate: (notifications: CareNotificationItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  const path = 'notifications';
  try {
    const q = query(
      collection(db, path),
      where('recipientId', '==', recipientId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: CareNotificationItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            recipientId: data.recipientId,
            recipientEmail: data.recipientEmail,
            recipientName: data.recipientName,
            senderId: data.senderId,
            senderName: data.senderName,
            senderRole: data.senderRole || 'admin',
            type: data.type || 'custom',
            title: data.title || 'Daily Care 🐼',
            message: data.message || '',
            emoji: data.emoji || '🐼',
            read: !!data.read,
            actionTaken: data.actionTaken,
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });
        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Send a notification from Admin/Friend to a specific user
 */
export async function sendCareNotification(
  payload: {
    recipientId: string;
    recipientEmail?: string;
    recipientName?: string;
    senderId: string;
    senderName: string;
    senderRole: 'admin' | 'friend';
    type: 'meal' | 'water' | 'sleep' | 'period' | 'nudge' | 'custom';
    title: string;
    message: string;
    emoji?: string;
  }
): Promise<string> {
  const path = 'notifications';
  try {
    const newDoc = {
      recipientId: payload.recipientId,
      recipientEmail: payload.recipientEmail || '',
      recipientName: payload.recipientName || 'Best Friend',
      senderId: payload.senderId,
      senderName: payload.senderName || 'Admin 🛡️',
      senderRole: payload.senderRole,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      emoji: payload.emoji || '🐼',
      read: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, path), newDoc);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const path = `notifications/${notificationId}`;
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, {
      read: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Record action taken on notification (e.g. "Yes, I ate breakfast")
 */
export async function respondToNotification(
  notificationId: string,
  actionTaken: string
): Promise<void> {
  const path = `notifications/${notificationId}`;
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, {
      read: true,
      actionTaken,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a notification
 */
export async function deleteCareNotification(notificationId: string): Promise<void> {
  const path = `notifications/${notificationId}`;
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await deleteDoc(notifRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for registered users
 */
export function subscribeToRegisteredUsers(
  onUpdate: (users: UserProfile[]) => void
): () => void {
  const path = 'users';
  try {
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        const users: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          users.push(docSnap.data() as UserProfile);
        });
        onUpdate(users);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
