import { connectFirestoreEmulator, doc, updateDoc } from "firebase/firestore";
import db from "@/libs/db";

type Params = {
  params: {
    roomId: string;
    userId: string;
  };
};

export type PatchRoomsRoomIdUsersUserIdValueBody = Pick<
  Firestore.User,
  "value"
>;

export type PatchRoomsRoomIdUsersUserIdValueData = void;

// eslint-disable-next-line import/prefer-default-export
export async function PATCH(
  request: Request,
  { params: { roomId, userId } }: Params
): Promise<Response> {
  if (process.env.NODE_ENV === "development") {
    try {
      connectFirestoreEmulator(db, "localhost", 8080);
    } catch {}
  }

  const body = (await request.json()) as PatchRoomsRoomIdUsersUserIdValueBody;
  const docRef = doc(db, "rooms", roomId, "users", userId);

  await updateDoc(docRef, body);

  return new Response();
}
