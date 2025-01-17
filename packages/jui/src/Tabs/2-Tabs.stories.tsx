import { Meta, StoryObj } from "@storybook/react";
import { MenuItemLayout, PlatformIcon } from "@intellij-platform/core";
import React from "react";
import { TabContentLayout, TabItem, TabsProps } from ".";
import { Tabs } from "./Tabs";
import { DOMProps } from "@react-types/shared";

type StoryProps<T extends TabsProps<unknown> = TabsProps<unknown>> = Pick<
  T,
  | "active"
  | "focusable"
  | "defaultSelectedKey"
  | "multiRow"
  | "noOverflowMenu"
  | "noBorders"
  | keyof DOMProps
>;

export default {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    controls: { exclude: "TabComponent" },
  },
} as Meta;

export const StaticItems: StoryObj<StoryProps> = {
  render: (props) => {
    return (
      <Tabs {...props}>
        <TabItem>Tab 1</TabItem>
        <TabItem>Tab 2</TabItem>
        <TabItem>Tab 3</TabItem>
      </Tabs>
    );
  },
};

export const DynamicItems: StoryObj<StoryProps> = {
  render: (props: StoryProps) => {
    return (
      <Tabs
        {...props}
        items={["Tab 1", "Tab 2", "Tab 3"].map((title) => ({ title }))}
      >
        {({ title }: { title: string }) => (
          <TabItem key={title}>{title}</TabItem>
        )}
      </Tabs>
    );
  },
};

export const Overflow: StoryObj<StoryProps & { maxWidth: number }> = {
  render: ({ maxWidth = 800, ...props }) => {
    const tabs = Array(10)
      .fill(null)
      .map((_, index) => ({
        title: `Big tab title #${index}`,
        icon: "nodes/folder",
      }));
    return (
      <div style={{ maxWidth }}>
        <Tabs {...props} items={tabs}>
          {(tab) => {
            const icon = <PlatformIcon icon={tab.icon} />;
            return (
              <TabItem
                key={tab.title}
                textValue={tab.title}
                inOverflowMenu={
                  <MenuItemLayout content={tab.title} icon={icon} />
                }
              >
                <TabContentLayout startIcon={icon} title={tab.title} />
              </TabItem>
            );
          }}
        </Tabs>
      </div>
    );
  },
};
