import { MouseEventHandler, useMemo } from "react";
import styles from "./style.module.scss";

type Card = {
  onSelect: MouseEventHandler<HTMLDivElement>;
  value: string;
};

export type HandProps = {
  cards: Card[];
  selectedValue: string;
  status: "reserve" | "start" | "wait";
};

export default function Hand({
  cards,
  selectedValue,
  status,
}: HandProps): JSX.Element {
  const items = useMemo(
    () =>
      cards.map(({ onSelect, value }, index, cards) => (
        <div
          className={`${styles.card} ${
            selectedValue === value ? styles.selected : ""
          }`}
          key={value}
          onClick={status === "start" ? onSelect : undefined}
          style={{
            left: `calc(100% / ${cards.length - 1} * ${index} - 100% / ${
              cards.length - 4
            } / ${cards.length - 1} * ${index})`,
            width: `calc(100% / ${cards.length - 4})`,
          }}
        >
          {value}
        </div>
      )),
    [cards, selectedValue, status]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>{items}</div>
    </div>
  );
}
