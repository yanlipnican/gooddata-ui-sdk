// (C) 2007-2020 GoodData Corporation
import isEmpty from "lodash/isEmpty";
import { ObjRef, Identifier } from "@gooddata/sdk-model";

/**
 * Date string - ISO-8601 calendar date string, eg.: '2018-12-30'
 * TODO: https://jira.intgdc.com/browse/RAIL-2415
 * @alpha
 */
export type DateString = string;

/**
 * Type that identifies the the all time date filter
 * @alpha
 */
export type AllTimeType = "allTime";

/**
 * Type that identifies the absolute date filter form
 * @alpha
 */
export type AbsoluteFormType = "absoluteForm";

/**
 * Type that identifies the relative date filter form
 * @alpha
 */
export type RelativeFormType = "relativeForm";

/**
 * Type that identifies the absolute date filter preset
 * @alpha
 */
export type AbsolutePresetType = "absolutePreset";

/**
 * Type that identifies the relative date filter preset
 * @alpha
 */
export type RelativePresetType = "relativePreset";

/**
 * Type that identifies the date filter option
 * @alpha
 */
export type OptionType =
    | AllTimeType
    | AbsoluteFormType
    | RelativeFormType
    | AbsolutePresetType
    | RelativePresetType;

/**
 * Relative granularity offset
 * (e.g. "GDC.time.year" granularity with offset -2 means "the previous 2 years")
 * @alpha
 */
export type RelativeGranularityOffset = number;

/**
 * Supported date filter granularities for the relative date filter
 * @alpha
 */
export type DateFilterGranularity =
    | "GDC.time.date"
    | "GDC.time.week_us"
    | "GDC.time.month"
    | "GDC.time.quarter"
    | "GDC.time.year";

/**
 * Common props for date filter options
 * @alpha
 */
export interface IDateFilterOption {
    /**
     * Local identifier of the option
     */
    localIdentifier: Identifier;
    /**
     * Customized name of the option to display in the dropdown
     */
    name?: string;
    /**
     * Option type
     */
    type: OptionType;
    /**
     * Sets whether this option will be visible in the dropdown
     */
    visible: boolean;
}

/**
 * Custom absolute date filter preset
 * @alpha
 */
export interface IAbsoluteDateFilterPreset extends IDateFilterOption {
    /**
     * Type to identify an absolute date filter preset
     */
    type: AbsolutePresetType;
    /**
     * Absolute date filter start date
     */
    from: DateString;
    /**
     * Absolute date filter end date
     */
    to: DateString;
}

/**
 * Custom relative date filter preset
 * @alpha
 */
export interface IRelativeDateFilterPreset extends IDateFilterOption {
    /**
     * Type to identify a relative date filter preset
     */
    type: RelativePresetType;
    /**
     * Relative date filter granularity (day/week/year,etc.)
     */
    granularity: DateFilterGranularity;
    /**
     * Relative date filter granularity start offset
     */
    from: RelativeGranularityOffset;
    /**
     * Relative date filter granularity end offset
     */
    to: RelativeGranularityOffset;
}

/**
 * Generic type to express relative date filter preset of a particular granularity
 * @alpha
 */
export interface IRelativeDateFilterPresetOfGranularity<Key extends DateFilterGranularity>
    extends IRelativeDateFilterPreset {
    /**
     * Particular relative date filter preset granularity
     */
    granularity: Key;
}

/**
 * Customized options for the global absolute date filter
 * @alpha
 */
export interface IAbsoluteDateFilterForm extends IDateFilterOption {
    /**
     * Type to identify the global absolute date filter
     */
    type: AbsoluteFormType;
}

/**
 * Customized options for the global relative date filter
 * @alpha
 */
export interface IRelativeDateFilterForm extends IDateFilterOption {
    /**
     * Type to identify the global relative date filter
     */
    type: RelativeFormType;
    /**
     * Available granularities for the global relative date filter
     */
    availableGranularities: DateFilterGranularity[];
}

/**
 * Customized options for the global all time date filter
 * @alpha
 */
export interface IAllTimeDateFilter extends IDateFilterOption {
    /**
     * Type to identify the global all time date filter
     */
    type: AllTimeType;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IAllTimeDateFilter}.
 * @alpha
 */
export const isAllTimeDateFilter = (obj: unknown): obj is IAllTimeDateFilter =>
    !isEmpty(obj) && (obj as IAllTimeDateFilter).type === "allTime";

/**
 * Type-guard testing whether the provided object is an instance of {@link IAbsoluteDateFilterForm}.
 * @alpha
 */
export const isAbsoluteDateFilterForm = (obj: unknown): obj is IAbsoluteDateFilterForm =>
    !isEmpty(obj) && (obj as IAbsoluteDateFilterForm).type === "absoluteForm";

/**
 * Type-guard testing whether the provided object is an instance of {@link IAbsoluteDateFilterPreset}.
 * @alpha
 */
export const isAbsoluteDateFilterPreset = (obj: unknown): obj is IAbsoluteDateFilterPreset =>
    !isEmpty(obj) && (obj as IAbsoluteDateFilterPreset).type === "absolutePreset";

/**
 * Type-guard testing whether the provided object is an instance of {@link IRelativeDateFilterForm}.
 * @alpha
 */
export const isRelativeDateFilterForm = (obj: unknown): obj is IRelativeDateFilterForm =>
    !isEmpty(obj) && (obj as IRelativeDateFilterForm).type === "relativeForm";

/**
 * Type-guard testing whether the provided object is an instance of {@link IRelativeDateFilterPreset}.
 * @alpha
 */
export const isRelativeDateFilterPreset = (obj: unknown): obj is IRelativeDateFilterPreset =>
    !isEmpty(obj) && (obj as IRelativeDateFilterPreset).type === "relativePreset";

/**
 * Date filter configs allow to define your own date filter options, that appear in the date filter.
 *
 * @alpha
 */
export interface IDateFilterConfig {
    /**
     * Extended date filter config reference
     */
    ref: ObjRef;
    /**
     * Local identifier of the default selected date filter preset
     */
    selectedOption: Identifier;
    /**
     * Options to customize displaying of the global all time date filter
     */
    allTime?: IAllTimeDateFilter;
    /**
     * Options to customize displaying of the global absolute date filter
     */
    absoluteForm?: IAbsoluteDateFilterForm;
    /**
     * Options to customize displaying of the global relative date filter
     */
    relativeForm?: IRelativeDateFilterForm;
    /**
     * Custom absolute date filter presets (options to display in the extended date filter dropdown)
     */
    absolutePresets?: IAbsoluteDateFilterPreset[];
    /**
     * Custom relative date filter presets (options to display in the extended date filter dropdown)
     */
    relativePresets?: IRelativeDateFilterPreset[];
}
