import { DocumentReference } from "firebase/firestore";
import adminDb from "@/libs/adminDb";

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
  const body = (await request.json()) as PostRoomsRoomIdUsersBody;
  const { id } = await adminDb
    .collection("rooms")
    .doc(roomId)
    .collection("users")
    .add(body);

  return new Response(JSON.stringify({ id } as PostRoomsRoomIdUsersData));
}
