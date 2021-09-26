import { Node } from "@react-types/shared";
import { ListState } from "@react-stately/list";
import React from "react";
import { useSelectableItem } from "@react-aria/selection";
import { usePress } from "@react-aria/interactions";
import { StyledListItem } from "./StyledListItem";

export interface ListItemProps<T> {
  listFocused: boolean;
  item: Node<T>;
  state: ListState<T>;
  children?: React.ReactNode;
}

export function ListItem<T>({
  listFocused,
  item,
  state,
  children,
}: ListItemProps<T>) {
  const ref = React.useRef(null);
  const disabled = state.disabledKeys.has(item.key);
  const selected = state.selectionManager.isSelected(item.key);

  const { itemProps } = useSelectableItem({
    key: item.key,
    ref,
    selectionManager: state.selectionManager,
  });
  let { pressProps } = usePress({
    ...itemProps,
    isDisabled: disabled,
    preventFocusOnPress: false,
  });

  return (
    <StyledListItem
      containerFocused={listFocused}
      selected={selected}
      disabled={disabled}
      aria-disabled={disabled}
      aria-selected={selected}
      {...pressProps}
      ref={ref}
    >
      {children || item.rendered}
    </StyledListItem>
  );
}