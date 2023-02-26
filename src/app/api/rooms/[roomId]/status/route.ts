import { connectFirestoreEmulator, doc, updateDoc } from "firebase/firestore";
import db from "@/libs/db";

type Params = {
  params: {
    roomId: string;
  };
};

export type PatchRoomsRoomIdStatusBody = Pick<Firestore.Room, "status">;

export type PatchRoomsRoomIdStatusData = void;

// eslint-disable-next-line import/prefer-default-export
export async function PATCH(
  request: Request,
  { params: { roomId } }: Params
): Promise<Response> {
  if (process.env.NODE_ENV === "development") {
    try {
      connectFirestoreEmulator(db, "localhost", 8080);
    } catch {}
  }

  const body = (await request.json()) as PatchRoomsRoomIdStatusBody;
  const docRef = doc(db, "rooms", roomId);

  await updateDoc(docRef, body);

  return new Response();
}
