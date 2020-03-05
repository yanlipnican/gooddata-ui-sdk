// (C) 2019 GoodData Corporation
import { mount } from "enzyme";
import * as React from "react";
import { createIntlMock } from "@gooddata/sdk-ui";
import AggregationsMenu, { IAggregationsMenuProps } from "../AggregationsMenu";
import AggregationsSubMenu from "../AggregationsSubMenu";
import { AVAILABLE_TOTALS } from "../agGridConst";
import {
    attributeLocalId,
    defWithFilters,
    emptyDef,
    ITotal,
    measureLocalId,
    newPositiveAttributeFilter,
    idRef,
    newMeasureValueFilter,
} from "@gooddata/sdk-model";
import { DataViewFirstPage, recordedDataView } from "@gooddata/sdk-backend-mockingbird";
import { ReferenceRecordings, ReferenceLdm } from "@gooddata/reference-workspace";

describe("AggregationsMenu", () => {
    const intlMock = createIntlMock();
    const attributeColumnId = "a_6_2-m_0";
    const fixture = recordedDataView(
        ReferenceRecordings.Scenarios.PivotTable.SingleMeasureWithTwoRowAndOneColumnAttributes,
        DataViewFirstPage,
    );
    const getExecutionDefinition = () => emptyDef("testWorkspace");
    const getDataView = () => fixture;
    const getTotals = () => [] as ITotal[];
    const onMenuOpenedChange = jest.fn();
    const onAggregationSelect = jest.fn();

    function render(customProps: Partial<IAggregationsMenuProps> = {}) {
        return mount(
            <AggregationsMenu
                intl={intlMock}
                isMenuOpened={true}
                isMenuButtonVisible={true}
                showSubmenu={false}
                colId={attributeColumnId}
                getExecutionDefinition={getExecutionDefinition}
                getDataView={getDataView}
                getTotals={getTotals}
                onMenuOpenedChange={onMenuOpenedChange}
                onAggregationSelect={onAggregationSelect}
                {...customProps}
            />,
        );
    }

    it("should render opened main menu", () => {
        const wrapper = render();
        const menu = wrapper.find(".s-table-header-menu");

        expect(menu.length).toBe(1);
        expect(menu.hasClass("gd-pivot-table-header-menu--open")).toBe(true);
    });

    it("should render main menu with all total items", () => {
        const wrapper = render();

        expect(wrapper.find(".s-menu-aggregation").length).toBe(AVAILABLE_TOTALS.length);
    });

    it('should render "sum" as only selected item in main menu', () => {
        const totals: ITotal[] = [
            {
                type: "sum",
                attributeIdentifier: attributeLocalId(ReferenceLdm.Product.Name), // first row attribute => grand totals, selected right in menu
                measureIdentifier: measureLocalId(ReferenceLdm.Amount),
            },
            {
                type: "min",
                attributeIdentifier: attributeLocalId(ReferenceLdm.Department), // second row attr => subtotals, selected in submenu
                measureIdentifier: measureLocalId(ReferenceLdm.Amount),
            },
        ];
        const wrapper = render({ getTotals: () => totals });

        expect(wrapper.find(".is-checked").length).toBe(1);
        expect(wrapper.find(".s-menu-aggregation-sum .is-checked").length).toBe(1);
    });

    it("should render closed main menu when isMenuOpen is set to false", () => {
        const wrapper = render({ isMenuOpened: false });

        expect(wrapper.find(".s-table-header-menu").hasClass("gd-pivot-table-header-menu--open")).toBe(false);
    });

    it("should render visible main menu button", () => {
        const wrapper = render();

        expect(wrapper.find(".s-table-header-menu").hasClass("gd-pivot-table-header-menu--show")).toBe(true);
    });

    it("should render invisible visible main menu button", () => {
        const wrapper = render({ isMenuButtonVisible: false });

        expect(wrapper.find(".s-table-header-menu").hasClass("gd-pivot-table-header-menu--hide")).toBe(true);
    });

    it("should render submenu with correct props", () => {
        const wrapper = render({
            isMenuButtonVisible: false,
            showSubmenu: true,
        });
        const subMenu = wrapper.find(".s-menu-aggregation-sum").find(AggregationsSubMenu);

        expect(subMenu.props()).toMatchObject({
            totalType: "sum",
            rowAttributeDescriptors: [
                expect.objectContaining({ attributeHeader: expect.anything() }),
                expect.objectContaining({ attributeHeader: expect.anything() }),
            ],
            columnTotals: [],
        });
    });

    it("should not render any submenu when there is no row attribute", () => {
        const fixture = recordedDataView(
            ReferenceRecordings.Scenarios.PivotTable.TwoMeasuresWithColumnAttribute,
            DataViewFirstPage,
        );

        const wrapper = render({
            showSubmenu: true,
            getDataView: () => fixture,
        });

        expect(wrapper.find(AggregationsSubMenu).length).toBe(0);
    });

    it("should not disable any item when there is no measure value filter set", () => {
        const defWithAttrFilter = defWithFilters(emptyDef("testWorkspace"), [
            newPositiveAttributeFilter(idRef("some-identifier"), ["e1", "e2"]),
        ]);
        const wrapper = render({
            showSubmenu: true,
            getExecutionDefinition: () => defWithAttrFilter,
        });
        expect(wrapper.find(".is-disabled").length).toBe(0);
        expect(wrapper.find(AggregationsSubMenu).length).toBe(6);
    });

    it("should disable native totals when there is at least one measure value filter set", () => {
        const defWithMeasureValueFilter = defWithFilters(emptyDef("testWorkspace"), [
            newMeasureValueFilter(idRef("some-identifier"), "GREATER_THAN", 10),
        ]);

        const wrapper = render({
            showSubmenu: true,
            getExecutionDefinition: () => defWithMeasureValueFilter,
        });
        expect(wrapper.find(".is-disabled").length).toBe(1);
        expect(wrapper.find(AggregationsSubMenu).length).toBe(5);
    });
});