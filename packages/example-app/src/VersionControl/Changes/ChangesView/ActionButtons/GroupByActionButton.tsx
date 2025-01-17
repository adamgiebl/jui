import React from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  availableGroupingsState,
  changesGroupingState,
  GroupingIds,
} from "../ChangesView.state";
import {
  IconButtonWithMenu,
  Item,
  Menu,
  PlatformIcon,
  Section,
} from "@intellij-platform/core";

export const GroupByActionButton = (): React.ReactElement => {
  // Grouping is extensible in Intellij platform, but we only support grouping by directory here.

  const availableGroupings = useRecoilValue(availableGroupingsState);

  const toggleGroup = useRecoilCallback(
    ({ set }) =>
      (id: GroupingIds) => {
        set(changesGroupingState(id), (value) => !value);
      },
    []
  );

  return (
    <IconButtonWithMenu
      renderMenu={({ menuProps }) => (
        <Menu
          {...menuProps}
          selectedKeys={availableGroupings
            .filter(({ isActive }) => isActive)
            .map(({ grouping }) => grouping.id)}
          onAction={(key) => {
            const id = availableGroupings.find(
              ({ grouping }) => grouping.id === key
            )?.grouping.id;
            if (id) {
              toggleGroup(id);
            }
          }}
        >
          <Section title="Group By">
            {availableGroupings.map(({ grouping }) => (
              <Item key={grouping.id}>{grouping.title}</Item>
            ))}
          </Section>
        </Menu>
      )}
    >
      <PlatformIcon icon="actions/groupBy.svg" />
    </IconButtonWithMenu>
  );
};
