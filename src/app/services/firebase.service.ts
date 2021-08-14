import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = 'general';

  collectionLedger = 'ledger';

  collectionInfo = 'info';


  constructor(private firestore: AngularFirestore) { }

  read_info() {
    return this.firestore.collection(this.collectionInfo).snapshotChanges();
  }

  create_info(record) {
    return this.firestore.collection(this.collectionInfo).add(record);
  }

  delete_info(record_id) {
    this.firestore.doc(this.collectionInfo + '/' + record_id).delete();
  }

  update_info(recordID, record) {
    this.firestore.doc(this.collectionInfo + '/' + recordID).update(record);
  }

  read_general() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  create_general(record) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  delete_general(record_id) {
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }

  read_ledger() {
    return this.firestore.collection(this.collectionLedger).snapshotChanges();
  }

  create_ledger(record) {
    return this.firestore.collection(this.collectionLedger).add(record);
  }

  delete_ledger(record_id) {
    this.firestore.doc(this.collectionLedger + '/' + record_id).delete();
  }

  update_ledger(recordID, record) {
    this.firestore.doc(this.collectionLedger + '/' + recordID).update(record);
  }
}
