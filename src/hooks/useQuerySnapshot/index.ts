import {
  DocumentData,
  Query,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useState } from "react";
import { useBoolean, useEffectOnce } from "usehooks-ts";

export type QuerySnapshotParams<T> = {
  query: Query<T>;
};

export type QuerySnapshotData<T> = {
  data?: QuerySnapshot<T>;
  loading: boolean;
};

export default function useQuerySnapshot<T = DocumentData>({
  query,
}: QuerySnapshotParams<T>): QuerySnapshotData<T> {
  const [data, setData] = useState<QuerySnapshotData<T>["data"]>();
  const { setFalse: offLoading, value: loading } = useBoolean(true);

  useEffectOnce(() => {
    const unsubscribe = onSnapshot<T>(query, (snapshot) => {
      offLoading();

      setData(snapshot);
    });

    return () => {
      unsubscribe();
    };
  });

  return { data, loading };
}
