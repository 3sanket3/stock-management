import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);
export const onItemCreate = functions.firestore
  .document(`/items/{id}`)
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (data) {
      await snap.ref.update({ closingStock: data.openingStock });
    }
  });

export const onTransactionCreate = functions.firestore
  .document(`/transactions/{id}`)
  .onCreate(async (snap, context) => {
    await updateClosingStock(snap, "create");
  });

export const onTransactionDelete = functions.firestore
  .document(`/transactions/{id}`)
  .onDelete(async (snap, context) => {
    await updateClosingStock(snap, "delete");
  });

async function updateClosingStock(
  snap: functions.firestore.DocumentSnapshot,
  operation: "create" | "delete"
) {
  const doc = snap.data() as
    | {
        id: string;
        itemId: string;
        itemName: string;
        purchaseQuantity: number;

        salesQuantity: number;
      }
    | undefined;

  if (doc) {
    const itemDoc = admin.firestore().collection("items").doc(doc.itemId);
    if (doc.purchaseQuantity) {
      if (operation === "create") {
        await itemDoc.update({
          closingStock: admin.firestore.FieldValue.increment(
            doc.purchaseQuantity
          ),
        });
      } else {
        await itemDoc.update({
          closingStock: admin.firestore.FieldValue.increment(
            doc.purchaseQuantity * -1
          ),
        });
      }
    } else if (doc.salesQuantity) {
      if (operation === "create") {
        await itemDoc.update({
          closingStock: admin.firestore.FieldValue.increment(
            doc.salesQuantity * -1
          ),
        });
      } else {
        await itemDoc.update({
          closingStock: admin.firestore.FieldValue.increment(doc.salesQuantity),
        });
      }
    }
  }
}
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
