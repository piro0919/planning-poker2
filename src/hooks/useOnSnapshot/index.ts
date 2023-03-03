import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useState } from "react";
import { useBoolean, useEffectOnce } from "usehooks-ts";

export type QuerySnapshotParams<U = DocumentData> = {
  query: CollectionReference<U>;
};

export type ReferenceSnapshotParams<U = DocumentData> = {
  reference: DocumentReference<U>;
};

export type OnSnapshotParams<U = DocumentData> =
  | QuerySnapshotParams<U>
  | ReferenceSnapshotParams<U>;

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
>(params: OnSnapshotParams<U>): OnSnapshotData<T, U> {
  const [queryData, setQueryData] = useState<QuerySnapshotData<U>["data"]>();
  const [referenceData, setReferenceData] = useState<
    QuerySnapshotData<U> | ReferenceSnapshotData<U>["data"]
  >();
  const { setFalse: offLoading, value: loading } = useBoolean(true);
  const [error, setError] = useState<OnSnapshotData<T, U>["error"]>();

  useEffectOnce(() => {
    const unsubscribe =
      "query" in params
        ? onSnapshot<U>(
            params.query,
            (snapshot) => {
              offLoading();

              setQueryData(snapshot);
            },
            (error) => {
              offLoading();

              setError(error);
            }
          )
        : onSnapshot<U>(
            params.reference,
            (snapshot) => {
              offLoading();

              setReferenceData(snapshot);
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

  return "query" in params
    ? <OnSnapshotData<T, U>>{ error, loading, data: queryData }
    : <OnSnapshotData<T, U>>{ error, loading, data: referenceData };
}
