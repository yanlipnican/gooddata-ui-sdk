// (C) 2021 GoodData Corporation
import { put } from "redux-saga/effects";
import { ChangeAttributeFilterSelection } from "../../commands/filters";
import { filterContextActions } from "../../state/filterContext";
import { DashboardContext } from "../../types/commonTypes";

export function* attributeFilterChangeSelectionCommandHandler(
    _ctx: DashboardContext,
    cmd: ChangeAttributeFilterSelection,
) {
    yield put(
        filterContextActions.updateAttributeFilterSelection({
            elements: cmd.payload.elements,
            filterLocalId: cmd.payload.filterLocalId,
            negativeSelection: cmd.payload.selectionType === "NOT_IN",
        }),
    );
}