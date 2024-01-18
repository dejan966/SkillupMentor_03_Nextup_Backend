import { Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";

@Injectable()
export class AppService {
  async authUsers(){
    return admin.auth().listUsers();
  }

  async getAllUsersFromDB(){
    const db = admin.firestore();
    const snapshot = await db.collection("users").get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ... doc.data()});
    });
    return data;
  }

  getHelloWorld() {
    return 'Hello World';
  }
}
