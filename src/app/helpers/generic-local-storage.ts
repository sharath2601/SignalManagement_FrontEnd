import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GenericLocalStorage {
  /**for saving items and objects in local storage */
  saveItem(k: any, i: any) {
    localStorage.setItem(k, i);
  }
  saveObject(k: any, o: any) {
    localStorage.setItem(k, JSON.stringify(o));
  }

  /**for updating items and objects in local storage */
  updateItemRObjects(k: any, v: any) {
    localStorage.setItem(k, v);
  }

  /**to read items & objects in local storage */
  getItemRObjects(k: any) {
    return localStorage.getItem(k);
  }

  /**to delete or clear item & objects in local storage */
  deleteItem(k: any) {
    localStorage.removeItem(k);
  }

  /**to clear everything after logout */
  clearLocalStorage() {
    localStorage.clear();
  }
}
