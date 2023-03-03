"use client";
import axios, { AxiosResponse } from "axios";
import copy from "copy-to-clipboard";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useSessionStorage } from "usehooks-ts";
import { PostRoomsBody, PostRoomsData } from "./api/rooms/route";
import Home, { HomeProps } from "@/components/Home";

export default function Page(): JSX.Element {
  const router = useRouter();
  const [_, setIsAdmin] = useSessionStorage("is-admin", "");
  const handleCreate = useCallback<HomeProps["onCreate"]>(async () => {
    setIsAdmin("true");

    const myPromise = axios.post<
      PostRoomsData,
      AxiosResponse<PostRoomsData>,
      PostRoomsBody
    >("/api/rooms", {
      adminId: "",
      createdDate: dayjs().format("YYYY-MM-DD"),
      status: "reserve",
    });
    const {
      data: { id },
    } = await toast.promise(myPromise, {
      error: "新しい部屋を作成に失敗しました…",
      loading: "新しい部屋を作成中です…",
      success: "新しい部屋を作成しました",
    });

    copy(`${window.location.origin}/rooms/${id}`);

    toast.success("部屋のURLをコピーしました");

    router.push(`/rooms/${id}`);
  }, [router, setIsAdmin]);
  const handleSubmit: HomeProps["onSubmit"] = ({ roomId }) => {
    router.push(`/rooms/${roomId.split("/").at(-1) || ""}`);
  };

  return <Home onCreate={handleCreate} onSubmit={handleSubmit} />;
}
