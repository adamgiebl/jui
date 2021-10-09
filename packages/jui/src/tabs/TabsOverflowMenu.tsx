import { Collection, Node } from "@react-types/shared";
import { ActionButton, Item, Menu, MenuTrigger, PlatformIcon } from "jui";
import React, { Key } from "react";

export const TabsOverflowMenu = <T extends unknown>({
  collection,
  overflowedKeys,
  onSelect,
}: {
  collection: Collection<Node<T>>;
  overflowedKeys: Set<Key>;
  onSelect: (key: Key) => void;
}) => (
  <>
    {overflowedKeys.size > 0 && (
      <MenuTrigger
        align="end"
        renderMenu={({ menuProps, close }) => {
          const items: Iterable<Node<unknown>> = [
            ...collection,
          ].filter((menuItem) => overflowedKeys.has(menuItem.key));
          return (
            <Menu
              {...menuProps}
              onAction={(key) => {
                close();
                onSelect(key);
              }}
              items={items}
            >
              {(item) => (
                <Item key={item.key} textValue={item.textValue}>
                  {item.props.inOverflowMenu || item.textValue}
                </Item>
              )}
            </Menu>
          );
        }}
      >
        {(props, ref) => (
          <ActionButton {...props} ref={ref}>
            <PlatformIcon icon="actions/findAndShowNextMatches" />
          </ActionButton>
        )}
      </MenuTrigger>
    )}
  </>
);