import {
  CollectionReference,
  DocumentReference,
  addDoc,
  collection,
  connectFirestoreEmulator,
} from "firebase/firestore";
import db from "@/libs/db";

type Params = {
  params: {
    roomId: string;
  };
};

export type PostRoomsRoomIdUsersBody = Firestore.User;

export type PostRoomsRoomIdUsersData = Pick<
  DocumentReference<Firestore.User>,
  "id"
>;

// eslint-disable-next-line import/prefer-default-export
export async function POST(
  request: Request,
  { params: { roomId } }: Params
): Promise<Response> {
  if (process.env.NODE_ENV === "development") {
    try {
      connectFirestoreEmulator(db, "localhost", 8080);
    } catch {}
  }

  const body = (await request.json()) as PostRoomsRoomIdUsersBody;
  const colRef = collection(db, "rooms", roomId, "users");
  const { id } = await addDoc<Firestore.User>(
    colRef as CollectionReference<Firestore.User>,
    body
  );

  return new Response(JSON.stringify({ id } as PostRoomsRoomIdUsersData));
}
