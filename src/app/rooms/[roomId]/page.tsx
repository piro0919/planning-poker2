"use client";
import usePrevious from "@react-hook/previous";
import axios, { AxiosResponse } from "axios";
import dayjs from "dayjs";
import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  useEffectOnce,
  useEventListener,
  useSessionStorage,
} from "usehooks-ts";
import {
  PatchRoomsRoomIdAdminIdBody,
  PatchRoomsRoomIdAdminIdData,
} from "@/app/api/rooms/[roomId]/adminId/route";
import {
  PatchRoomsRoomIdStatusBody,
  PatchRoomsRoomIdStatusData,
} from "@/app/api/rooms/[roomId]/status/route";
import {
  DeleteRoomsRoomIdUsersUserIdBody,
  DeleteRoomsRoomIdUsersUserIdData,
} from "@/app/api/rooms/[roomId]/users/[userId]/route";
import {
  PatchRoomsRoomIdUsersUserIdValueBody,
  PatchRoomsRoomIdUsersUserIdValueData,
} from "@/app/api/rooms/[roomId]/users/[userId]/value/route";
import {
  PostRoomsRoomIdUsersBody,
  PostRoomsRoomIdUsersData,
} from "@/app/api/rooms/[roomId]/users/route";
import Room, { RoomProps } from "@/components/Room";
import useFibonacci from "@/hooks/useFibonacci";
import useOnSnapshot from "@/hooks/useOnSnapshot";
import db from "@/libs/db";

const MySwal = withReactContent(Swal);

export type PageProps = {
  params: { roomId: string };
};

export default function Page({ params: { roomId } }: PageProps): JSX.Element {
  const { fibonacci } = useFibonacci();
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useSessionStorage("is-admin", "");
  const handleStart = useCallback<RoomProps["onStart"]>(async () => {
    const myPromise = axios.patch<
      PatchRoomsRoomIdStatusData,
      AxiosResponse<PatchRoomsRoomIdStatusData>,
      PatchRoomsRoomIdStatusBody
    >(`/api/rooms/${roomId}/status`, {
      status: "start",
    });

    await toast.promise(myPromise, {
      error: "開始に失敗しました…",
      loading: "開始中です…",
      success: "開始しました",
    });
  }, [roomId]);
  const handleStop = useCallback<RoomProps["onStop"]>(async () => {
    await axios.patch<
      PatchRoomsRoomIdStatusData,
      AxiosResponse<PatchRoomsRoomIdStatusData>,
      PatchRoomsRoomIdStatusBody
    >(`/api/rooms/${roomId}/status`, {
      status: "wait",
    });
  }, [roomId]);
  const { data: usersData } = useOnSnapshot<
    CollectionReference,
    Firestore.User
  >({
    query: collection(
      db,
      "rooms",
      roomId,
      "users"
    ) as CollectionReference<Firestore.User>,
  });
  const users = useMemo<RoomProps["users"]>(() => {
    let users: RoomProps["users"] = [];

    usersData?.forEach((result) => {
      const { createdDate, name, value } = result.data();

      users = [
        ...users,
        {
          createdDate,
          name,
          value,
          id: result.id,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick: async ({ value }): Promise<void> => {
            if (typeof value !== "string") {
              return;
            }

            await axios.patch<
              PatchRoomsRoomIdAdminIdData,
              AxiosResponse<PatchRoomsRoomIdAdminIdData>,
              PatchRoomsRoomIdAdminIdBody
            >(`/api/rooms/${roomId}/adminId`, {
              adminId: value,
            });
          },
        },
      ];
    });

    return users;
  }, [roomId, usersData]);
  const prevUsers = usePrevious(users);
  const { data: roomData, loading: roomLoading } = useOnSnapshot<
    DocumentReference,
    Firestore.Room
  >({
    reference: doc(db, "rooms", roomId) as DocumentReference<Firestore.Room>,
  });
  const adminUserId = useMemo<RoomProps["adminUserId"]>(() => {
    if (!roomData) {
      return "";
    }

    const room = roomData.data();

    return room?.adminId || "";
  }, [roomData]);
  const handleLeave = useCallback<RoomProps["onLeave"]>(async () => {
    setIsAdmin("");

    const myPromise = axios.delete<
      DeleteRoomsRoomIdUsersUserIdData,
      AxiosResponse<DeleteRoomsRoomIdUsersUserIdData>,
      DeleteRoomsRoomIdUsersUserIdBody
    >(`/api/rooms/${roomId}/users/${userId}`);

    await toast.promise(myPromise, {
      error: "退室に失敗しました…",
      loading: "退室中です…",
      success: "退室しました",
    });

    router.push("/");
  }, [roomId, router, setIsAdmin, userId]);
  const cards = useMemo<RoomProps["cards"]>(
    () =>
      fibonacci.map((value) => ({
        value,
        onSelect: async (): Promise<void> => {
          const myPromise = axios.patch<
            PatchRoomsRoomIdUsersUserIdValueData,
            AxiosResponse<PatchRoomsRoomIdUsersUserIdValueData>,
            PatchRoomsRoomIdUsersUserIdValueBody
          >(`/api/rooms/${roomId}/users/${userId}/value`, {
            value,
          });

          await toast.promise(myPromise, {
            error: "投票に失敗しました…",
            loading: "投票中です…",
            success: "投票しました",
          });

          if (
            users.filter(({ id }) => userId !== id).some(({ value }) => !value)
          ) {
            return;
          }

          await axios.patch(`/api/rooms/${roomId}/status`, {
            status: "wait",
          });
        },
      })),
    [fibonacci, roomId, userId, users]
  );
  const selectedValue = useMemo<RoomProps["selectedValue"]>(() => {
    const user = users.find(({ id }) => userId === id);

    return user?.value || "";
  }, [userId, users]);
  const status = useMemo<RoomProps["status"]>(() => {
    if (!roomData) {
      return "reserve";
    }

    const room = roomData.data();

    return room?.status || "reserve";
  }, [roomData]);

  useEffect(() => {
    if (roomLoading || roomData?.exists()) {
      return;
    }

    router.push("/404");
  }, [roomData, roomLoading, router]);

  useEffectOnce(() => {
    const callback = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { value } = await MySwal.fire({
        allowOutsideClick: false,
        icon: "question",
        input: "text",
        inputValidator: (value) =>
          value ? null : "お名前が入力されていません",
        titleText: "お名前を入力してください",
      });

      if (typeof value !== "string") {
        return;
      }

      const myPromise = axios.post<
        PostRoomsRoomIdUsersData,
        AxiosResponse<PostRoomsRoomIdUsersData>,
        PostRoomsRoomIdUsersBody
      >(`/api/rooms/${roomId}/users`, {
        createdDate: dayjs().format("YYYY-MM-DD"),
        name: value,
        value: "",
      });
      const {
        data: { id },
      } = await toast.promise(myPromise, {
        error: "入室に失敗しました…",
        loading: "入室中です…",
        success: "入室しました",
      });

      setUserId(id);

      if (!isAdmin) {
        return;
      }

      await axios.patch<
        PatchRoomsRoomIdAdminIdData,
        AxiosResponse<PatchRoomsRoomIdAdminIdData>,
        PatchRoomsRoomIdAdminIdBody
      >(`/api/rooms/${roomId}/adminId`, {
        adminId: id,
      });
    };

    // eslint-disable-next-line no-void
    void callback();

    return () => {
      MySwal.close();
    };
  });

  useEffect(() => {
    if (!userId || !prevUsers) {
      return;
    }

    const isEnter = users.length - prevUsers.length > 0;
    const { usersA, usersB } = isEnter
      ? { usersA: users, usersB: prevUsers }
      : { usersA: prevUsers, usersB: users };

    usersA
      .filter(({ id }) => userId !== id)
      .filter(({ id }) => !usersB.some(({ id: prevId }) => id === prevId))
      .forEach(({ name }) => {
        toast.success(`${name}さんが${isEnter ? "入室" : "退室"}しました`);
      });
  }, [prevUsers, userId, users]);

  useEffect(() => {
    const callback = async (): Promise<void> => {
      if (status !== "start") {
        return;
      }

      // eslint-disable-next-line no-void
      await axios.patch<
        PatchRoomsRoomIdUsersUserIdValueData,
        AxiosResponse<PatchRoomsRoomIdUsersUserIdValueData>,
        PatchRoomsRoomIdUsersUserIdValueBody
      >(`/api/rooms/${roomId}/users/${userId}/value`, {
        value: "",
      });
    };

    // eslint-disable-next-line no-void
    void callback();
  }, [roomId, status, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    if (!isAdmin && status === "start") {
      toast.success("開始しました");

      return;
    }

    if (status === "wait") {
      toast.success("公開しました");
    }
  }, [isAdmin, status, userId]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useEventListener("beforeunload", async (e) => {
    e.preventDefault();

    setIsAdmin("");

    await axios.delete<
      DeleteRoomsRoomIdUsersUserIdData,
      AxiosResponse<DeleteRoomsRoomIdUsersUserIdData>,
      DeleteRoomsRoomIdUsersUserIdBody
    >(`/api/rooms/${roomId}/users/${userId}`);
  });

  return (
    <Room
      adminUserId={adminUserId}
      cards={cards}
      onLeave={handleLeave}
      onStart={handleStart}
      onStop={handleStop}
      selectedValue={selectedValue}
      status={status}
      userId={userId}
      users={users}
    />
  );
}
