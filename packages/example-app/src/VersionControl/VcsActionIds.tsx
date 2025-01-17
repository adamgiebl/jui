import { CommonActionId } from "@intellij-platform/core";

export const VcsActionIds = {
  ROLLBACK: "ChangesView.Revert",
  REFRESH: "ChangesView.Refresh",
  SHELVE_SILENTLY: "ChangesView.ShelveSilently",
  SHELVE: "ChangesView.Shelve",
  UNSHELVE_SILENTLY: "ChangesView.UnshelveSilently",
  NEW_CHANGELIST: "ChangesView.NewChangeList",
  RENAME_CHANGELIST: "ChangesView.Rename",
  REMOVE_CHANGELIST: "ChangesView.RemoveChangeList",
  SET_DEFAULT_CHANGELIST: "ChangesView.SetDefault",
  MOVE_TO_ANOTHER_CHANGELIST: "ChangesView.Move",
  SHOW_DIFF: "Diff.ShowDiff", // Maybe doesn't belong here?
  CHECKIN_FILES: "CheckinFiles",
  CHECKIN_PROJECT: "CheckinProject",
  JUMP_TO_SOURCE: CommonActionId.EDIT_SOURCE,

  GROUP_CHANGES_VIEW_POPUP_MENU: "ChangesViewPopupMenu", // Not used yet

  GIT_CREATE_NEW_BRANCH: "Git.CreateNewBranch",
  GIT_BRANCHES: "Git.Branches",
};
