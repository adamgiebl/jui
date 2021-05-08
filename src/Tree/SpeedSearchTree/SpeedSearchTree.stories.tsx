import { Item } from "@react-stately/collections";
import { Meta } from "@storybook/react";
import React, { Key, useState } from "react";
import { SpeedSearchTree } from "./SpeedSearchTree";
import { Pane, SelectionLog } from "../../story-components";

export default {
  title: "Tree/Speed search",
  Component: SpeedSearchTree,
} as Meta;

export const Static = () => {
  const [selectedKeys, setSelectedKeys] = useState<"all" | Set<Key>>(
    new Set(["Theme", "index.ts"])
  );
  return (
    <div style={{ display: "flex" }}>
      <Pane>
        <SpeedSearchTree
          fillAvailableSpace
          selectionMode="multiple"
          defaultExpandedKeys={["List", "Theme", "BasicList", "Foo"]}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <Item key="index.ts">index.ts</Item>
          <Item title="List" key="List">
            <Item title="BasicList" key="BasicList">
              <Item>BasicList.stories.tsx</Item>
              <Item>BasicList.tsx</Item>
              <Item>BasicListItem.tsx</Item>
              <Item>useBasicList.ts</Item>
            </Item>

            <Item title="SpeedSearchList" key="SpeedSearchList">
              <Item>SpeedSearchList.stories.tsx</Item>
              <Item>SpeedSearchList.tsx</Item>
              <Item>SpeedSearchListItem.tsx</Item>
              <Item>useSpeedSearchList.ts</Item>
            </Item>

            <Item>ListDivider.tsx</Item>
          </Item>
          <Item title="Theme" key="Theme">
            <Item>createTheme.ts</Item>
          </Item>
        </SpeedSearchTree>
      </Pane>
      <div style={{ marginLeft: 20 }}>
        <h4>Selection</h4>
        <SelectionLog selection={selectedKeys} />
      </div>
    </div>
  );
};