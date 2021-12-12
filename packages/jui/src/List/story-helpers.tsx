import { Legend, legends } from "../../test-data";
import React, { ReactNode } from "react";
import { Item, Section } from "@react-stately/collections";
import { Divider, DividerItem } from "@intellij-platform/core";

export const renderItemCustomUI = (item: Legend, content?: ReactNode) => (
  <Item key={item.name} textValue={item.name}>
    <div style={{ height: 40, display: "flex", alignItems: "center" }}>
      🎸 &nbsp;
      <b>{content || item.name}</b>
    </div>
  </Item>
);
export const itemRenderer = (
  renderItem: (item: Legend, content?: ReactNode) => JSX.Element,
  content?: ReactNode
) => (item: typeof legends[number]) => {
  if (item instanceof DividerItem) {
    return <Divider key={item.key} />;
  }
  if ("items" in item) {
    return (
      <Section items={item.items} key={item.title} title={item.title}>
        {(item) => renderItem(item, content)}
      </Section>
    );
  }
  return renderItem(item as Legend, content);
};
export const renderItemString = (item: Legend) => (
  <Item key={item.name} textValue={item.name}>
    {item.name}
  </Item>
);
