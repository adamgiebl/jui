import { mount } from "@cypress/react";
import React from "react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Button.stories";

const { SimpleUsage } = composeStories(stories);

const BUTTON_TEXT = "Button";

describe("Button", () => {
  it("works!", () => {
    const onPress = cy.stub();
    mount(<SimpleUsage onPress={onPress} />, { styles: "body{padding: 10px}" });
    matchImageSnapshot("Button-simple");
    cy.contains(BUTTON_TEXT).click();
    cy.wrap(onPress).should("be.calledOnce");
    cy.get("button").focused();
    matchImageSnapshot("Button-simple-focused");

    // disabled
    mount(<SimpleUsage isDisabled onPress={onPress} />, {
      styles: "body{padding: 10px}",
    });
    matchImageSnapshot("Button-simple-disabled");
    cy.contains(BUTTON_TEXT).click({ force: true });
    cy.wrap(onPress).should("be.calledOnce"); // no new calls
  });

  it('supports "default" variant', () => {
    mount(<SimpleUsage isDefault />, { styles: "body{padding: 10px}" });
    matchImageSnapshot("Button-default");
    cy.get("button").click();
    cy.get("button").focused();
    matchImageSnapshot("Button-default-focused");

    // disabled
    mount(<SimpleUsage isDisabled />, { styles: "body{padding: 10px}" });
    matchImageSnapshot("Button-default-disabled");
  });

  it("supports autoFocus and excludeFromTabOrder", () => {
    mount(
      <>
        <SimpleUsage autoFocus id="firstButton" />
        <SimpleUsage excludeFromTabOrder />
        <SimpleUsage id="thirdButton" />
      </>,
      { styles: "body{padding: 10px}" }
    );
    // autoFocus should move focus to the first Button
    cy.focused().should("have.id", "firstButton");

    // Tabbing should move focus to the third Button.
    cy.realPress("Tab"); // next tab should move focus to the checkbox
    cy.focused().should("have.id", "thirdButton");
  });

  it("supports preventFocus", () => {
    const onPress = cy.stub();
    mount(
      // The first element is intentionally something other than Button, to not tangle preventFocus testing with autoFocus
      <>
        <input autoFocus id="focused-element" />
        <SimpleUsage preventFocusOnPress onPress={onPress} />
      </>
    );
    cy.focused().should("have.id", "focused-element");
    cy.contains(BUTTON_TEXT).click();
    // focus should stay where it was before clicking the button. It's important that not only the button is not
    // focused, but also the focus is not changed after interaction with the button.
    cy.focused().should("have.id", "focused-element");
    cy.wrap(onPress).should("be.calledOnce");
  });
});

function matchImageSnapshot(snapshotsName: string) {
  // NOTE: right now focus state is lost in percy snapshots. Seems like an issue in percy at the moment, since the
  // element is properly focused before and after percy snapshot.
  cy.percySnapshot(snapshotsName);
}
