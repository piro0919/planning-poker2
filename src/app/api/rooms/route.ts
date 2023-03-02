import { DocumentReference } from "firebase/firestore";
import adminDb from "@/libs/adminDb";

export type PostRoomsBody = Firestore.Room;

export type PostRoomsData = Pick<DocumentReference<Firestore.Room>, "id">;

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as PostRoomsBody;
  const { id } = await adminDb.collection("rooms").add(body);

  return new Response(JSON.stringify({ id } as PostRoomsData));
}
