import adminDb from "@/libs/adminDb";

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
  const body = (await request.json()) as PatchRoomsRoomIdUsersUserIdValueBody;

  await adminDb
    .collection("rooms")
    .doc(roomId)
    .collection("users")
    .doc(userId)
    .update(body);

  return new Response();
}
