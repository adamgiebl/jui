import React, {
  CSSProperties,
  Key,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ThreeViewSplitter } from "../ThreeViewSplitter/ThreeViewSplitter";
import { StyledToolWindowOuterLayout } from "./StyledToolWindowOuterLayout";
import { ToolWindowContextProvider } from "./ToolWindowContextProvider";
import {
  getToolWindowsLayoutState,
  SideDockedState,
  StripesState,
  ToolWindowsLayoutState,
} from "./ToolWindowsState/ToolWindowsLayoutState";
import { ToolWindowsState } from "./ToolWindowsState/ToolWindowsState";
import { ToolWindowStripe } from "./ToolWindowStripe";
import { Anchor, isHorizontal } from "./utils";

export interface ToolWindowsProps {
  toolWindowsState: Readonly<ToolWindowsState>;
  onToolWindowStateChange: (newState: ToolWindowsState) => void;

  renderToolbarButton: (id: Key) => React.ReactNode;
  renderWindow: (id: Key) => React.ReactNode;
  /**
   * Whether stripe buttons should be hidden or not.
   * `hideToolStripes` UISettings in Intellij Platform
   */
  hideToolWindowBars?: boolean;

  /**
   *
   * `wideScreenSupport` in UISettings in Intellij Platform
   */
  useWidescreenLayout?: boolean;

  height?: CSSProperties["height"];
}

/**
 * @constructor
 *
 * Corresponding to ToolWindowPane in Intellij Platform
 */
export const ToolWindows: React.FC<ToolWindowsProps> = ({
  hideToolWindowBars = false,
  useWidescreenLayout = false,
  height = "100%",
  toolWindowsState,
  onToolWindowStateChange,
  renderToolbarButton,
  renderWindow,
  children,
}): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layoutState, setLayoutState] = useState<ToolWindowsLayoutState>();
  useLayoutEffect(() => {
    setLayoutState(
      getToolWindowsLayoutState(
        toolWindowsState,
        containerRef.current!.getBoundingClientRect()
      )
    );
  }, [toolWindowsState]);

  // TODO: extract component candidate
  const renderStripe = ({
    anchor,
    state,
  }: {
    anchor: Anchor;
    state: StripesState;
  }) => (
    <ToolWindowStripe
      anchor={anchor}
      items={state.main}
      splitItems={state.split}
      getKey={(item) => item}
      renderItem={(item) => renderToolbarButton(item)}
      onItemPress={(key) =>
        onToolWindowStateChange(toolWindowsState.toggle(key))
      }
      selectedKeys={state.activeKeys}
      onItemDropped={({ to, key }) =>
        onToolWindowStateChange(
          toolWindowsState.move(
            key,
            { anchor: anchor, isSplit: to.split },
            to.index
          )
        )
      }
    />
  );

  // TODO: extract component candidate
  const renderSideDockedView = ({
    anchor,
    state,
  }: {
    anchor: Anchor;
    state: SideDockedState;
  }) => {
    if (!state) {
      return null;
    }
    return (
      <ThreeViewSplitter
        innerView={
          <ToolWindowContextProvider
            id={state.mainKey}
            toolWindowsState={toolWindowsState}
            onToolWindowStateChange={onToolWindowStateChange}
          >
            {renderWindow(state.mainKey)}
          </ToolWindowContextProvider>
        }
        lastView={
          state.split && (
            <ToolWindowContextProvider
              id={state.split.key}
              toolWindowsState={toolWindowsState}
              onToolWindowStateChange={onToolWindowStateChange}
            >
              {renderWindow(state.split.key)}
            </ToolWindowContextProvider>
          )
        }
        lastSize={state.split?.sizeFraction}
        onLastResize={(newSize) => {
          onToolWindowStateChange(
            toolWindowsState.resizeDockSplitView(anchor, newSize)
          );
        }}
        orientation={isHorizontal(anchor) ? "horizontal" : "vertical"}
      />
    );
  };
  const onDockResize = (anchor: Anchor) => (size: number) => {
    const containerBounds = containerRef.current?.getBoundingClientRect();
    // containerBounds should have value in normal course of events
    if (containerBounds) {
      onToolWindowStateChange(
        toolWindowsState.resizeDock(anchor, size, containerBounds)
      );
    }
  };
  const getSplitViewProps = (
    layoutState: ToolWindowsLayoutState,
    orientation: "horizontal" | "vertical"
  ) => {
    const firstAnchor = orientation === "horizontal" ? "left" : "top";
    const secondAnchor = orientation === "horizontal" ? "right" : "bottom";
    return {
      orientation,
      firstView: renderSideDockedView({
        anchor: firstAnchor,
        state: layoutState[firstAnchor].docked,
      }),
      firstSize: layoutState[firstAnchor].docked?.size,
      onFirstResize: onDockResize(firstAnchor),
      lastView: renderSideDockedView({
        anchor: secondAnchor,
        state: layoutState[secondAnchor].docked,
      }),
      lastSize: layoutState[secondAnchor].docked?.size,
      onLastResize: onDockResize(secondAnchor),
    };
  };

  const renderInnerLayout = (layoutState: ToolWindowsLayoutState) => {
    const horizontalSplitterProps = getSplitViewProps(
      layoutState,
      "horizontal"
    );
    const verticalSplitterProps = getSplitViewProps(layoutState, "vertical");

    const [outerSplitterProps, innerSplitterProps] = useWidescreenLayout
      ? [horizontalSplitterProps, verticalSplitterProps]
      : [verticalSplitterProps, horizontalSplitterProps];

    return (
      <>
        {/**
         * ToolWindow bars, aka Stripes. Order of children is irrelevant.
         * layout is handled by `StyledToolWindowOuterLayout`
         */}
        <StyledToolWindowOuterLayout.LeftStripe>
          {renderStripe({
            anchor: "left",
            state: layoutState["left"].stripes,
          })}
        </StyledToolWindowOuterLayout.LeftStripe>
        <StyledToolWindowOuterLayout.TopStripe>
          {renderStripe({
            anchor: "top",
            state: layoutState["top"].stripes,
          })}
        </StyledToolWindowOuterLayout.TopStripe>
        <StyledToolWindowOuterLayout.RightStripe>
          {renderStripe({
            anchor: "right",
            state: layoutState["right"].stripes,
          })}
        </StyledToolWindowOuterLayout.RightStripe>
        <StyledToolWindowOuterLayout.BottomStripe>
          {renderStripe({
            anchor: "bottom",
            state: layoutState["bottom"].stripes,
          })}
        </StyledToolWindowOuterLayout.BottomStripe>

        {/**
         * The inner layout of the ToolWindow, including four tool windows and
         * a main content in the center.
         */}
        <StyledToolWindowOuterLayout.MainView>
          <ThreeViewSplitter
            {...outerSplitterProps}
            innerView={
              <ThreeViewSplitter innerView={children} {...innerSplitterProps} />
            }
          />
        </StyledToolWindowOuterLayout.MainView>
      </>
    );
  };
  return (
    /**
     * Potential refactoring: hideStripes can also be handled by conditionally
     * rendering tool window bars, instead of considering it as a feature of
     * StyledToolWindowOuterLayout
     **/
    <StyledToolWindowOuterLayout.Shell
      ref={containerRef}
      hideStripes={hideToolWindowBars}
      style={{ height }}
    >
      {layoutState && renderInnerLayout(layoutState)}
    </StyledToolWindowOuterLayout.Shell>
  );
};