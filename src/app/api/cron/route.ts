import dayjs from "dayjs";
import adminDb from "@/libs/adminDb";

export type DeleteRoomsBody = void;

export type DeleteRoomsData = void;

// eslint-disable-next-line import/prefer-default-export
export async function GET(): Promise<Response> {
  const dayBeforeYesterday = dayjs().add(-2, "days").format("YYYY-MM-DD");
  const querySnapshot = await adminDb
    .collection("rooms")
    .orderBy("createdDate", "asc")
    // 一昨日以前に作成された部屋を対象とする
    .endAt(dayBeforeYesterday)
    .get();

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  querySnapshot.forEach(async (queryDocumentSnapshot) => {
    await queryDocumentSnapshot.ref.delete();
  });

  return new Response();
}
