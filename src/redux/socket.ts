import { Query, QueryDocumentSnapshot } from '@firebase/firestore-types';
import { ISnapshot } from '../utils/types';
​
import {
  ISocketPresetOptions,
  SocketCollectionPreset,
  SOCKET_PRESET_OPTIONS,
  SORT_ORDERS,
} from './socket.options';
​
/**
 * General class for Firebase socket connection
 */
export class FirebaseSocketReactivePagination<TData> {
  options: ISocketPresetOptions;
  collectionRef: Query;
​
  private listeners: Function[] = [];
  private listenerStartPos: QueryDocumentSnapshot | null = null;
  private listenerEndPos: QueryDocumentSnapshot | null = null;
​
  private isPaginationEnded: boolean = false;
​
  /**
   * Initialize all data structures
   * @param {ISocketPresetOptions} preset - collection preset
   * @param {any[]} queryParams - check presets to pass through correct query params
   */
  constructor(preset: SocketCollectionPreset, ...queryParams: any[]) {
    this.options = SOCKET_PRESET_OPTIONS[preset];
​
    const { onGetCollectionRef } = this.options;
    this.collectionRef = onGetCollectionRef(...queryParams);
  }
​
  subscribe(callback: (data: ISnapshot<TData>[]) => void) {
    const { sortField, pageSize } = this.options;
​
    // Single query to get startAt snapshot
    this.collectionRef
      .orderBy(sortField, SORT_ORDERS[0])
      .limit(pageSize)
      .get()
      .then((snapshots) => {
        // Save startAt snapshot
        this.listenerStartPos = snapshots.docs[snapshots.docs.length - 1];
​
        let fbQuery = this.collectionRef.orderBy(sortField, SORT_ORDERS[1]);
        if (this.listenerStartPos) {
          fbQuery = fbQuery.startAt(this.listenerStartPos);
        }
​
        // Create first listener using startAt snapshot (starting boundary)
        const firstListener = fbQuery.onSnapshot((querySnapshot) => {
          const result: ISnapshot<TData>[] = [];
          querySnapshot.docChanges().forEach(({ doc, type }) => {
            const data = doc.data() as TData;
            result.push({
              type,
              data,
            });
          });
​
          this.isPaginationEnded = !result.length;
​
          if (!this.isPaginationEnded) {
            callback(result);
          }
        });
​
        // Add first listener to list
        if (!this.isPaginationEnded) {
          this.listeners.push(firstListener);
        }
      });
  }
​
  loadNextPage(callback: (data: ISnapshot<TData>[]) => void) {
    // Pages are over
    if (this.isPaginationEnded) {
      return;
    }
​
    const { pageSize, sortField } = this.options;
​
    // Single query to get new startAt snapshot
​
    this.listenerStartPos &&
      this.collectionRef
        .orderBy(sortField, SORT_ORDERS[0])
        .startAt(this.listenerStartPos)
        .limit(pageSize)
        .get()
        .then((snapshots) => {
          // Previous starting boundary becomes new ending boundary
          this.listenerEndPos = this.listenerStartPos;
          this.listenerStartPos = snapshots.docs[snapshots.docs.length - 1];
​
          if (this.listenerStartPos && this.listenerEndPos) {
            const fbQuery = this.collectionRef
              .orderBy(sortField, SORT_ORDERS[1])
              .startAt(this.listenerStartPos)
              .endBefore(this.listenerEndPos);
​
            const newListener = fbQuery.onSnapshot((querySnapshot) => {
              const result: ISnapshot<TData>[] = [];
​
              querySnapshot.docChanges().forEach(({ doc, type }) => {
                const data = doc.data() as TData;
                result.push({
                  type,
                  data,
                });
              });
​
              this.isPaginationEnded = !result.length;
​
              if (!this.isPaginationEnded) {
                callback(result);
              }
            });
​
            // Add new listener to listeners
            if (!this.isPaginationEnded) {
              this.listeners.push(newListener);
            }
          }
        });
  }
​
  /**
   * Unsubscribe all listeners
   */
  unsubscribe() {
    this.listeners.forEach((removeListener) => {
      if (removeListener) {
        removeListener();
      }
    });
  }
}