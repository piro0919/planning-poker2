import adminDb from "@/libs/adminDb";

type Params = {
  params: {
    roomId: string;
  };
};

export type PatchRoomsRoomIdAdminIdBody = Pick<Firestore.Room, "adminId">;

export type PatchRoomsRoomIdAdminIdData = void;

// eslint-disable-next-line import/prefer-default-export
export async function PATCH(
  request: Request,
  { params: { roomId } }: Params
): Promise<Response> {
  const body = (await request.json()) as PatchRoomsRoomIdAdminIdBody;

  await adminDb.collection("rooms").doc(roomId).update(body);

  return new Response();
}
