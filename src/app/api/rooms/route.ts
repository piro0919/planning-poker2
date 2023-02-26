import {
  CollectionReference,
  DocumentReference,
  addDoc,
  collection,
  connectFirestoreEmulator,
} from "firebase/firestore";
import db from "@/libs/db";

export type PostRoomsBody = Firestore.Room;

export type PostRoomsData = Pick<DocumentReference<Firestore.Room>, "id">;

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: Request): Promise<Response> {
  if (process.env.NODE_ENV === "development") {
    try {
      connectFirestoreEmulator(db, "localhost", 8080);
    } catch {}
  }

  const body = (await request.json()) as PostRoomsBody;
  const colRef = collection(db, "rooms");
  const { id } = await addDoc<Firestore.Room>(
    colRef as CollectionReference<Firestore.Room>,
    body
  );

  return new Response(JSON.stringify({ id } as PostRoomsData));
}
