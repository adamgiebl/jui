import { FocusScope } from "@react-aria/focus";
import React, {
  CSSProperties,
  Key,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ThreeViewSplitter } from "../ThreeViewSplitter/ThreeViewSplitter";
import { MovableToolWindowStripeProvider } from "./MovableToolWindowStripeProvider";
import { StyledToolWindowOuterLayout } from "./StyledToolWindowOuterLayout";
import { ToolWindowStateProvider } from "./ToolWindowsState/ToolWindowStateProvider";
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
 *
 * TODO:
 * - Add support for tool windows with viewMode === 'undocked'
 * - Add support for tool windows with viewMode === 'float'
 * - Add support for tool windows with viewMode === 'window'
 *
 * Known issues:
 * - in Firefox and Safari, left and right toolbars are not properly shown. Seems like a nasty bug, since adding and
 * then removing some min-width: fit-content style fixes it.
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
          <ToolWindowStateProvider
            id={state.mainKey}
            containerRef={containerRef}
            toolWindowsState={toolWindowsState}
            onToolWindowStateChange={onToolWindowStateChange}
          >
            {renderWindow(state.mainKey)}
          </ToolWindowStateProvider>
        }
        lastView={
          state.split && (
            <ToolWindowStateProvider
              id={state.split.key}
              containerRef={containerRef}
              toolWindowsState={toolWindowsState}
              onToolWindowStateChange={onToolWindowStateChange}
            >
              {renderWindow(state.split.key)}
            </ToolWindowStateProvider>
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
        <MovableToolWindowStripeProvider
          onMove={({ to, from }) => {
            onToolWindowStateChange(
              toolWindowsState.move(
                layoutState[from.anchor].stripes[
                  from.isSplit ? "split" : "main"
                ][from.index],
                { anchor: to.anchor, isSplit: to.isSplit },
                to.index
              )
            );
          }}
        >
          {/**
           * ToolWindow bars, aka Stripes. Order of stripes is irrelevant for layout but relevant for
           * priority when stripe buttons are moved across stripes.
           * layout is handled by `StyledToolWindowOuterLayout`.
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
        </MovableToolWindowStripeProvider>
        {/**
         * The inner layout of the ToolWindow, including four tool windows and
         * a main content in the center.
         */}
        <StyledToolWindowOuterLayout.MainView>
          <ThreeViewSplitter
            {...outerSplitterProps}
            innerView={
              <ThreeViewSplitter
                innerView={<FocusScope>{children}</FocusScope>}
                {...innerSplitterProps}
              />
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
