namespace Firestore {
  type User = {
    createdDate: string;
    name: string;
    value: string;
  };

  type Room = {
    adminId: string;
    createdDate: string;
    status: "reserve" | "start" | "wait";
  };
}
