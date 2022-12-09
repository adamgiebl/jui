import React from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  ActionDefinition,
  CommonActionId,
  DefaultToolWindow,
  PlatformIcon,
  useTreeActions,
} from "@intellij-platform/core";
import { Action } from "@intellij-platform/core/ActionSystem/components";

import {
  expandToPathCallback,
  projectViewTreeRefState,
  selectKeyAndFocusCallback,
} from "./ProjectView.state";
import { ProjectViewPane } from "./ProjectViewPane";
import { activeEditorTabState } from "../Editor/editor.state";
import { ProjectViewActionIds } from "./ProjectViewActionIds";

const { SELECT_IN_PROJECT_VIEW } = ProjectViewActionIds;

export function ProjectToolWindow() {
  const treeRef = useRecoilValue(projectViewTreeRefState);
  const actions = useTreeActions({ treeRef });
  // TODO: SelectInProjectView should be provided at project level, allowing potential shortcut to be globally
  //  accessible, and allowing other UI parts than editor's active tab, to set the context of "file" which needs to be
  //  opened in project view.
  const projectViewActions = useProjectViewActions();

  return (
    <DefaultToolWindow
      headerContent="Project"
      actions={{ ...actions, ...projectViewActions }}
      additionalActions={
        <>
          <Action.Button actionId={SELECT_IN_PROJECT_VIEW} />
          <Action.Button actionId={CommonActionId.EXPAND_ALL} />
          <Action.Button actionId={CommonActionId.COLLAPSE_ALL} />
        </>
      }
    >
      <ProjectViewPane />
    </DefaultToolWindow>
  );
}

function useProjectViewActions(): Record<string, ActionDefinition> {
  // improvement: for rendering, we only depend on whether activeTab is null or not. A selector can be defined for that
  // to prevent unnecessary re-rendering. The active tab, could be read from the state snapshot, in the handler callback.
  const activeTab = useRecoilValue(activeEditorTabState);

  const expandToOpenedFile = useRecoilCallback(expandToPathCallback, []);
  const selectKeyAndFocus = useRecoilCallback(selectKeyAndFocusCallback, []);
  const selectOpenedFile = () => {
    if (activeTab) {
      expandToOpenedFile(activeTab.filePath);
      selectKeyAndFocus(activeTab.filePath);
    }
  };

  return {
    [SELECT_IN_PROJECT_VIEW]: {
      title: "Select Opened File",
      icon: <PlatformIcon icon="general/locate" />,
      actionPerformed: selectOpenedFile,
      isDisabled: !activeTab,
      description: "Selects a context file in the Project View",
    },
  };
}
