import { connectFirestoreEmulator, deleteDoc, doc } from "firebase/firestore";
import db from "@/libs/db";

type Params = {
  params: {
    roomId: string;
    userId: string;
  };
};

export type DeleteRoomsRoomIdUsersUserIdBody = void;

export type DeleteRoomsRoomIdUsersUserIdData = void;

// eslint-disable-next-line import/prefer-default-export
export async function DELETE(
  _: Request,
  { params: { roomId, userId } }: Params
): Promise<Response> {
  if (process.env.NODE_ENV === "development") {
    try {
      connectFirestoreEmulator(db, "localhost", 8080);
    } catch {}
  }

  const docRef = doc(db, "rooms", roomId, "users", userId);

  await deleteDoc(docRef);

  return new Response();
}
