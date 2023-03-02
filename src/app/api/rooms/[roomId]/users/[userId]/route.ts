import adminDb from "@/libs/adminDb";

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
  await adminDb
    .collection("rooms")
    .doc(roomId)
    .collection("users")
    .doc(userId)
    .delete();

  return new Response();
}
