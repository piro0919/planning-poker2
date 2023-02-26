import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useState } from "react";
import { useBoolean, useEffectOnce } from "usehooks-ts";

export type ReferenceSnapshotParams<T> = {
  reference: DocumentReference<T>;
};

export type ReferenceSnapshotData<T> = {
  data?: DocumentSnapshot<T>;
  loading: boolean;
};

export default function useReferenceSnapshot<T = DocumentData>({
  reference,
}: ReferenceSnapshotParams<T>): ReferenceSnapshotData<T> {
  const [data, setData] = useState<ReferenceSnapshotData<T>["data"]>();
  const { setFalse: offLoading, value: loading } = useBoolean(true);

  useEffectOnce(() => {
    const unsubscribe = onSnapshot<T>(reference, (snapshot) => {
      offLoading();

      setData(snapshot);
    });

    return () => {
      unsubscribe();
    };
  });

  return { data, loading };
}
