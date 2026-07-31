import { useState, useEffect, useCallback } from 'react';
import { projectApi } from '../api/projectApi';
import { ITEMS_PER_PAGE } from '../utils/constants';

export function useProjects(initialFilters) {
  initialFilters = initialFilters || {};

  var projectsState = useState([]);
  var projects = projectsState[0];
  var setProjects = projectsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var paginationState = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: ITEMS_PER_PAGE,
    hasNext: false,
    hasPrev: false,
  });
  var pagination = paginationState[0];
  var setPagination = paginationState[1];

  var filtersState = useState({
    search: '',
    category: '',
    status: '',
    sort: 'newest',
    page: 1,
    limit: ITEMS_PER_PAGE,
  });
  var filters = filtersState[0];
  var setFilters = filtersState[1];

  // Apply initial filters on mount
  useEffect(function () {
    if (initialFilters.search) {
      setFilters(function (prev) { return Object.assign({}, prev, { search: initialFilters.search }); });
    }
    if (initialFilters.category) {
      setFilters(function (prev) { return Object.assign({}, prev, { category: initialFilters.category }); });
    }
  }, []);

  var fetchProjects = useCallback(function () {
    setLoading(true);
    projectApi.getProjects(filters)
      .then(function (res) {
        if (res.data.success) {
          setProjects(res.data.data.projects);
          setPagination(res.data.data.pagination);
        }
      })
      .catch(function (err) {
        console.error('Failed to fetch projects:', err);
      })
      .finally(function () {
        setLoading(false);
      });
  }, [filters]);

  useEffect(function () {
    fetchProjects();
  }, [fetchProjects]);

  var updateFilters = function (newFilters) {
    setFilters(function (prev) {
      var updated = Object.assign({}, prev, newFilters);
      if (newFilters.page === undefined) {
        updated.page = 1;
      }
      return updated;
    });
  };

  var goToPage = function (page) {
    updateFilters({ page: page });
  };

  var resetFilters = function () {
    setFilters({
      search: '',
      category: '',
      status: '',
      sort: 'newest',
      page: 1,
      limit: ITEMS_PER_PAGE,
    });
  };

  return {
    projects: projects,
    loading: loading,
    pagination: pagination,
    filters: filters,
    updateFilters: updateFilters,
    goToPage: goToPage,
    resetFilters: resetFilters,
    refetch: fetchProjects,
  };
}