import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  FirestoreError,
  QuerySnapshot,
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useState } from "react";
import { useBoolean, useEffectOnce } from "usehooks-ts";

export type OnSnapshotFirestoreParams = {
  firestore: Firestore;
  paths: string[];
  type: "query" | "reference";
};

export type QuerySnapshotData<U = DocumentData> = {
  data?: QuerySnapshot<U>;
  error?: FirestoreError;
  loading: boolean;
};

export type ReferenceSnapshotData<U = DocumentData> = {
  data?: DocumentSnapshot<U>;
  error?: FirestoreError;
  loading: boolean;
};

export type OnSnapshotData<
  T = CollectionReference | DocumentReference,
  U = DocumentData
> = T extends CollectionReference
  ? QuerySnapshotData<U>
  : ReferenceSnapshotData<U>;

export default function useOnSnapshot<
  T = CollectionReference | DocumentReference,
  U = DocumentData
>({ firestore, paths, type }: OnSnapshotFirestoreParams): OnSnapshotData<T, U> {
  const [queryData, setQueryData] = useState<QuerySnapshotData<U>["data"]>();
  const [referenceData, setReferenceData] = useState<
    QuerySnapshotData<U> | ReferenceSnapshotData<U>["data"]
  >();
  const { setFalse: offLoading, value: loading } = useBoolean(true);
  const [error, setError] = useState<OnSnapshotData<T, U>["error"]>();

  useEffectOnce(() => {
    const [path, ...pathSegments] = paths;
    const unsubscribe =
      type === "query"
        ? onSnapshot(
            collection(firestore, path, ...pathSegments),
            (snapshot) => {
              offLoading();

              setQueryData(snapshot as QuerySnapshot<U>);
            },
            (error) => {
              offLoading();

              setError(error);
            }
          )
        : onSnapshot(
            doc(firestore, path, ...pathSegments),
            (snapshot) => {
              offLoading();

              setReferenceData(snapshot as DocumentSnapshot<U>);
            },
            (error) => {
              offLoading();

              setError(error);
            }
          );

    return () => {
      unsubscribe();
    };
  });

  return type === "query"
    ? <OnSnapshotData<T, U>>{ error, loading, data: queryData }
    : <OnSnapshotData<T, U>>{ error, loading, data: referenceData };
}
