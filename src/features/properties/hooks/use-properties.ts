"use client";

// File: src/features/properties/hooks/use-properties.ts

/**
 * Asancha Properties Hook
 *
 * Purpose:
 * Provides property-owner and property-agent workspace components with
 * property list, detail, creation, update, submission, deletion, filter,
 * pagination, and request state.
 *
 * Responsibilities:
 * - Load active-profile-scoped property records.
 * - Load one property by public ID.
 * - Create and update property drafts.
 * - Submit eligible properties for backend review.
 * - Delete eligible property drafts.
 * - Maintain filter and pagination state.
 * - Expose safe success and error messages.
 *
 * Security notes:
 * - This hook stores public-user-safe property workspace data in memory only.
 * - It must not store private document contents, internal staff notes,
 *   duplicate-check details, private risk details, secrets, or ObjectIds.
 * - Client-side action states do not authorize property mutations.
 * - Backend checks remain final.
 */

import { useCallback, useRef, useState } from "react";

import { propertiesApi } from "../api/properties.api";
import {
  DEFAULT_PROPERTY_FILTERS,
  PROPERTY_SAFE_MESSAGES,
} from "../constants/properties.constants";
import type {
  CreatePropertyPayload,
  CreatePropertyResult,
  DeletePropertyResult,
  PropertiesHookState,
  PropertyCollection,
  PropertyDetail,
  PropertyFilters,
  PropertySummary,
  PropertyUpdatePayload,
  SubmitPropertyPayload,
  SubmitPropertyResult,
  UpdatePropertyResult,
  UsePropertiesResult,
} from "../types/properties.types";

const INITIAL_PROPERTIES_STATE: PropertiesHookState = {
  requestState: "idle",
  properties: [],
  selectedProperty: null,
  filters: DEFAULT_PROPERTY_FILTERS,
  pagination: null,

  errorMessage: null,
  successMessage: null,

  isLoading: false,
  isRefreshing: false,
  isCreating: false,
  isSaving: false,
  isSubmitting: false,
  isDeleting: false,
  isEmpty: false,
};

function replacePropertySummary(
  properties: PropertySummary[],
  property: PropertyDetail,
): PropertySummary[] {
  const exists = properties.some(
    (currentProperty) =>
      currentProperty.propertyPublicId === property.propertyPublicId,
  );

  if (!exists) {
    return [property, ...properties];
  }

  return properties.map((currentProperty) =>
    currentProperty.propertyPublicId === property.propertyPublicId
      ? property
      : currentProperty,
  );
}

export function useProperties(): UsePropertiesResult {
  const [hookState, setHookState] = useState<PropertiesHookState>(
    INITIAL_PROPERTIES_STATE,
  );

  const filtersRef = useRef<PropertyFilters>(DEFAULT_PROPERTY_FILTERS);

  const applyFilters = useCallback((filters: PropertyFilters): void => {
    filtersRef.current = filters;

    setHookState((currentState) => ({
      ...currentState,
      filters,
    }));
  }, []);

  const setError = useCallback((message: string): void => {
    setHookState((currentState) => ({
      ...currentState,
      requestState: "error",
      errorMessage: message,
      successMessage: null,

      isLoading: false,
      isRefreshing: false,
      isCreating: false,
      isSaving: false,
      isSubmitting: false,
      isDeleting: false,
    }));
  }, []);

  const loadProperties = useCallback(
    async (
      filters?: Partial<PropertyFilters>,
    ): Promise<PropertyCollection | null> => {
      const nextFilters: PropertyFilters = {
        ...filtersRef.current,
        ...filters,
        page: filters?.page ?? 1,
      };

      applyFilters(nextFilters);

      setHookState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        isRefreshing: false,
        isEmpty: false,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const collection = await propertiesApi.getProperties(nextFilters);

        setHookState((currentState) => ({
          ...currentState,
          requestState: collection.items.length === 0 ? "empty" : "success",

          properties: collection.items,
          pagination: collection.pagination,
          filters: nextFilters,

          isLoading: false,
          isRefreshing: false,
          isEmpty: collection.items.length === 0,
          errorMessage: null,
        }));

        return collection;
      } catch {
        setError(PROPERTY_SAFE_MESSAGES.loadError);
        return null;
      }
    },
    [applyFilters, setError],
  );

  const refreshProperties =
    useCallback(async (): Promise<PropertyCollection | null> => {
      setHookState((currentState) => ({
        ...currentState,
        requestState: "refreshing",
        isLoading: false,
        isRefreshing: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const collection = await propertiesApi.getProperties(
          filtersRef.current,
        );

        setHookState((currentState) => ({
          ...currentState,
          requestState: collection.items.length === 0 ? "empty" : "success",

          properties: collection.items,
          pagination: collection.pagination,

          isRefreshing: false,
          isEmpty: collection.items.length === 0,
          errorMessage: null,
        }));

        return collection;
      } catch {
        setError(PROPERTY_SAFE_MESSAGES.loadError);
        return null;
      }
    }, [setError]);

  const loadProperty = useCallback(
    async (propertyPublicId: string): Promise<PropertyDetail | null> => {
      const normalizedPublicId = propertyPublicId.trim();

      if (!normalizedPublicId) {
        setError(PROPERTY_SAFE_MESSAGES.detailLoadError);

        return null;
      }

      setHookState((currentState) => ({
        ...currentState,
        requestState: "loading",
        isLoading: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const property = await propertiesApi.getProperty(normalizedPublicId);

        setHookState((currentState) => ({
          ...currentState,
          requestState: "success",
          selectedProperty: property,
          properties: replacePropertySummary(currentState.properties, property),
          isLoading: false,
          errorMessage: null,
        }));

        return property;
      } catch {
        setError(PROPERTY_SAFE_MESSAGES.detailLoadError);

        return null;
      }
    },
    [setError],
  );

  const createProperty = useCallback(
    async (payload: CreatePropertyPayload): Promise<CreatePropertyResult> => {
      setHookState((currentState) => ({
        ...currentState,
        requestState: "creating",
        isCreating: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await propertiesApi.createProperty(payload);

        setHookState((currentState) => ({
          ...currentState,
          requestState: "success",
          properties: replacePropertySummary(
            currentState.properties,
            result.property,
          ),
          selectedProperty: result.property,
          isCreating: false,
          isEmpty: false,
          errorMessage: null,
          successMessage: result.message || PROPERTY_SAFE_MESSAGES.created,
        }));

        return result;
      } catch {
        setError(PROPERTY_SAFE_MESSAGES.createError);

        throw new Error(PROPERTY_SAFE_MESSAGES.createError);
      }
    },
    [setError],
  );

  const updateProperty = useCallback(
    async (
      propertyPublicId: string,
      payload: PropertyUpdatePayload,
    ): Promise<UpdatePropertyResult> => {
      setHookState((currentState) => ({
        ...currentState,
        requestState: "saving",
        isSaving: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await propertiesApi.updateProperty(
          propertyPublicId,
          payload,
        );

        setHookState((currentState) => ({
          ...currentState,
          requestState: "success",
          properties: replacePropertySummary(
            currentState.properties,
            result.property,
          ),
          selectedProperty: result.property,
          isSaving: false,
          errorMessage: null,
          successMessage: result.message || PROPERTY_SAFE_MESSAGES.saved,
        }));

        return result;
      } catch {
        setError(PROPERTY_SAFE_MESSAGES.saveError);

        throw new Error(PROPERTY_SAFE_MESSAGES.saveError);
      }
    },
    [setError],
  );

  const submitProperty = useCallback(
    async (
      propertyPublicId: string,
      payload: SubmitPropertyPayload,
    ): Promise<SubmitPropertyResult> => {
      setHookState((currentState) => ({
        ...currentState,
        requestState: "submitting",
        isSubmitting: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await propertiesApi.submitProperty(
          propertyPublicId,
          payload,
        );

        setHookState((currentState) => ({
          ...currentState,
          requestState: "success",
          properties: replacePropertySummary(
            currentState.properties,
            result.property,
          ),
          selectedProperty: result.property,
          isSubmitting: false,
          errorMessage: null,
          successMessage: result.message || PROPERTY_SAFE_MESSAGES.submitted,
        }));

        return result;
      } catch {
        setError(PROPERTY_SAFE_MESSAGES.submitError);

        throw new Error(PROPERTY_SAFE_MESSAGES.submitError);
      }
    },
    [setError],
  );

  const deleteProperty = useCallback(
    async (propertyPublicId: string): Promise<DeletePropertyResult> => {
      setHookState((currentState) => ({
        ...currentState,
        requestState: "deleting",
        isDeleting: true,
        errorMessage: null,
        successMessage: null,
      }));

      try {
        const result = await propertiesApi.deleteProperty(propertyPublicId);

        setHookState((currentState) => {
          const nextProperties = currentState.properties.filter(
            (property) => property.propertyPublicId !== result.propertyPublicId,
          );

          return {
            ...currentState,
            requestState: "success",
            properties: nextProperties,
            selectedProperty:
              currentState.selectedProperty?.propertyPublicId ===
              result.propertyPublicId
                ? null
                : currentState.selectedProperty,

            isDeleting: false,
            isEmpty: nextProperties.length === 0,
            errorMessage: null,
            successMessage: PROPERTY_SAFE_MESSAGES.deleted,
          };
        });

        return result;
      } catch {
        setError(PROPERTY_SAFE_MESSAGES.deleteError);

        throw new Error(PROPERTY_SAFE_MESSAGES.deleteError);
      }
    },
    [setError],
  );

  const setFilters = useCallback(
    (filters: Partial<PropertyFilters>): void => {
      const filterKeys = Object.keys(filters);

      const changesSearchCriteria = filterKeys.some(
        (key) => key !== "page" && key !== "pageSize",
      );

      const nextFilters: PropertyFilters = {
        ...filtersRef.current,
        ...filters,
        page:
          filters.page ?? (changesSearchCriteria ? 1 : filtersRef.current.page),
      };

      applyFilters(nextFilters);
    },
    [applyFilters],
  );

  const replaceFilters = useCallback(
    (filters: PropertyFilters): void => {
      applyFilters(filters);
    },
    [applyFilters],
  );

  const resetFilters = useCallback((): void => {
    const nextFilters = {
      ...DEFAULT_PROPERTY_FILTERS,
    };

    applyFilters(nextFilters);

    setHookState((currentState) => ({
      ...currentState,
      requestState: "idle",
      properties: [],
      pagination: null,
      isEmpty: false,
      errorMessage: null,
      successMessage: null,
    }));
  }, [applyFilters]);

  const clearSelectedProperty = useCallback((): void => {
    setHookState((currentState) => ({
      ...currentState,
      selectedProperty: null,
    }));
  }, []);

  const clearMessages = useCallback((): void => {
    setHookState((currentState) => ({
      ...currentState,
      requestState:
        currentState.properties.length > 0 || currentState.selectedProperty
          ? "success"
          : "idle",

      errorMessage: null,
      successMessage: null,
    }));
  }, []);

  const reset = useCallback((): void => {
    filtersRef.current = {
      ...DEFAULT_PROPERTY_FILTERS,
    };

    setHookState({
      ...INITIAL_PROPERTIES_STATE,
      filters: {
        ...DEFAULT_PROPERTY_FILTERS,
      },
    });
  }, []);

  return {
    ...hookState,

    loadProperties,
    refreshProperties,
    loadProperty,
    createProperty,
    updateProperty,
    submitProperty,
    deleteProperty,

    setFilters,
    replaceFilters,
    resetFilters,

    clearSelectedProperty,
    clearMessages,
    reset,
  };
}
