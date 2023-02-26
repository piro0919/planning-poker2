import { useMemo } from "react";

export type FibonacciData = {
  fibonacci: string[];
};

export default function useFibonacci(): FibonacciData {
  const fibonacci = useMemo<FibonacciData["fibonacci"]>(
    () => [
      "0",
      "1/2",
      "1",
      "2",
      "3",
      "5",
      "8",
      "13",
      "20",
      "40",
      "100",
      "∞",
      "?",
    ],
    []
  );

  return { fibonacci };
}
