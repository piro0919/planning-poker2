import { Menu, MenuButton, MenuItem, MenuItemProps } from "@szhsin/react-menu";
import dayjs from "dayjs";
import { MouseEventHandler, useMemo } from "react";
import { FaCrown } from "react-icons/fa";
import Spacer from "react-spacer";
import styles from "./style.module.scss";

type User = Pick<MenuItemProps, "onClick"> & {
  createdDate: string;
  id: string;
  name: string;
};

export type ControlProps = {
  isAdmin: boolean;
  onLeave: MouseEventHandler<HTMLButtonElement>;
  onStart: MouseEventHandler<HTMLButtonElement>;
  onStop: MouseEventHandler<HTMLButtonElement>;
  status: "reserve" | "start" | "wait";
  userId: string;
  users: User[];
};

export default function Control({
  isAdmin,
  onLeave,
  onStart,
  onStop,
  status,
  userId,
  users,
}: ControlProps): JSX.Element {
  const adminButton = useMemo(() => {
    if (!isAdmin) {
      return null;
    }

    switch (status) {
      case "reserve":
      case "wait": {
        return (
          <button
            className={styles.button}
            disabled={users.length <= 1}
            onClick={onStart}
          >
            開始する
          </button>
        );
      }
      case "start": {
        return (
          <button className={styles.button} onClick={onStop}>
            締め切る
          </button>
        );
      }
      default: {
        return null;
      }
    }
  }, [isAdmin, onStart, onStop, status, users.length]);
  const statusLabel = useMemo(() => {
    switch (status) {
      case "reserve": {
        return (
          <div className={styles.reserveLabel}>
            <span>待機中</span>
          </div>
        );
      }
      case "start": {
        return (
          <div className={styles.startLabel}>
            <span>投票中</span>
          </div>
        );
      }
      case "wait": {
        return (
          <div className={styles.waitLabel}>
            <span>公開中</span>
          </div>
        );
      }
      default: {
        return null;
      }
    }
  }, [status]);
  const menuItems = useMemo(
    () =>
      users
        .filter(({ id }) => userId !== id)
        .sort(({ createdDate: createdDateA }, { createdDate: createdDateB }) =>
          dayjs(createdDateA).isBefore(createdDateB) ? -1 : 1
        )
        .map(({ id, name, onClick }) => (
          <MenuItem
            key={id}
            onClick={onClick}
            value={id}
          >{`${name}さん`}</MenuItem>
        )),
    [userId, users]
  );
  const disabled = useMemo(
    () => isAdmin && users.some(({ id }) => userId !== id),
    [isAdmin, userId, users]
  );

  return (
    <div className={styles.wrapper}>
      {adminButton}
      {isAdmin ? (
        <Menu
          align="center"
          arrow={true}
          menuButton={
            <MenuButton disabled={!menuItems.length}>
              <FaCrown color="#ead665" size={24} />
            </MenuButton>
          }
          transition={true}
        >
          {menuItems}
        </Menu>
      ) : null}
      <Spacer grow={1} />
      {statusLabel}
      <button className={styles.button} disabled={disabled} onClick={onLeave}>
        退出する
      </button>
    </div>
  );
}
