import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MemoryService {
  private readonly dbName: string = 'scores';
  private readonly dbVersion: number = 1;
  private readonly dbTable: string = 'games';
  private request?: IDBOpenDBRequest;

  private db?: IDBDatabase;

  constructor() {}

  public open(): IDBOpenDBRequest {
    this.request = window.indexedDB.open(this.dbName, this.dbVersion);
    this.setRequestCallbacks();
    return this.request;
  }

  private setRequestCallbacks(): void {
    this.request!.onsuccess = (event) => {
      this.db = this.request!.result;
    };
    this.request!.onerror = (event) => {
      console.log('Db connection error: ', event);
    };
    this.request!.onupgradeneeded = (event: any) => {
      this.db = event.target.result;

      const objectStore = this.db?.createObjectStore(this.dbTable, {
        keyPath: 'id',
      });
    };
  }
}
