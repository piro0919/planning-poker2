import adminDb from "@/libs/adminDb";

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
  const body = (await request.json()) as PatchRoomsRoomIdStatusBody;

  await adminDb.collection("rooms").doc(roomId).update(body);

  return new Response();
}
