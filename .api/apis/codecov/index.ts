import type * as types from './types'
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas'
import APICore from 'api/dist/core'
import definition from './openapi.json'

class SDK {
  spec: Oas
  core: APICore

  constructor() {
    this.spec = Oas.init(definition)
    this.core = new APICore(this.spec, 'codecov/2.0.0 (api/6.1.3)')
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config)
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values)
    return this
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables)
  }

  /**
   * Returns all owners to which the currently authenticated user has access
   *
   * @summary Service owners
   */
  root_list(
    metadata: types.RootListMetadataParam,
  ): Promise<FetchResponse<200, types.RootListResponse200>> {
    return this.core.fetch('/{service}/', 'get', metadata)
  }

  /**
   * Returns a single owner by name
   *
   * @summary Owner detail
   */
  root_retrieve(
    metadata: types.RootRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.RootRetrieveResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/', 'get', metadata)
  }

  /**
   * Returns a paginated list of repositories for the specified provider service and owner
   * username
   *
   * Optionally filterable by:
   * * a list of repository `name`s
   * * a `search` term which matches against the name
   * * whether the repository is `active` or not
   *
   * @summary Repository list
   */
  repos_list(
    metadata: types.ReposListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposListResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/repos/', 'get', metadata)
  }

  /**
   * Returns a single repository by name
   *
   * @summary Repository detail
   */
  repos_retrieve(
    metadata: types.ReposRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposRetrieveResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/repos/{repo_name}/', 'get', metadata)
  }

  /**
   * Returns a paginated list of branches for the specified repository
   *
   * @summary Branch list
   */
  repos_branches_list(
    metadata: types.ReposBranchesListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposBranchesListResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/branches/',
      'get',
      metadata,
    )
  }

  /**
   * Returns a single branch by name.
   * Includes head commit information embedded in the response.
   *
   * @summary Branch detail
   */
  repos_branches_retrieve(
    metadata: types.ReposBranchesRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposBranchesRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/branches/{name}/',
      'get',
      metadata,
    )
  }

  /**
   * Returns a paginated list of commits for the specified repository
   *
   * Optionally filterable by:
   * * a `branch` name
   *
   * @summary Commit list
   */
  repos_commits_list(
    metadata: types.ReposCommitsListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCommitsListResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/commits/',
      'get',
      metadata,
    )
  }

  /**
   * Returns a single commit by commitid (SHA)
   *
   * @summary Commit detail
   */
  repos_commits_retrieve(
    metadata: types.ReposCommitsRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCommitsRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/commits/{commitid}/',
      'get',
      metadata,
    )
  }

  /**
   * Returns a paginated list of uploads for a single commit by commitid (SHA)
   *
   * @summary Commit uploads
   */
  repos_commits_uploads_list(
    metadata: types.ReposCommitsUploadsListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCommitsUploadsListResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/commits/{commitid}/uploads/',
      'get',
      metadata,
    )
  }

  /**
   * Returns a comparison for either a pair of commits or a pull
   *
   * @summary Comparison
   */
  repos_compare_retrieve(
    metadata: types.ReposCompareRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCompareRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/compare/',
      'get',
      metadata,
    )
  }

  /**
   * Component comparison
   *
   */
  repos_compare_components_retrieve(
    metadata: types.ReposCompareComponentsRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCompareComponentsRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/compare/components',
      'get',
      metadata,
    )
  }

  /**
   * Returns a comparison for a specific file path
   *
   * @summary File comparison
   */
  repos_compare_file_retrieve(
    metadata: types.ReposCompareFileRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCompareFileRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/compare/file/{file_path}',
      'get',
      metadata,
    )
  }

  /**
   * Returns flag comparisons
   *
   * @summary Flag comparison
   */
  repos_compare_flags_retrieve(
    metadata: types.ReposCompareFlagsRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCompareFlagsRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/compare/flags',
      'get',
      metadata,
    )
  }

  /**
   * Returns a comparison for either a pair of commits or a pull
   * Will only return pre-computed impacted files comparisons if available
   * If unavailable `files` will be empty, however once the computation is ready
   * the files will appear on subsequent calls
   * `state: "processed"` means `files` are finished computing and returned
   * `state: "pending"` means `files` are still computing, poll again later
   *
   * @summary Impacted files comparison
   */
  repos_compare_impacted_files_retrieve(
    metadata: types.ReposCompareImpactedFilesRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCompareImpactedFilesRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/compare/impacted_files',
      'get',
      metadata,
    )
  }

  /**
   * Returns a comparison for a specific file path only showing the segments
   * of the file that are impacted instead of all lines in file
   *
   * @summary Segmented file comparison
   */
  repos_compare_segments_retrieve(
    metadata: types.ReposCompareSegmentsRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCompareSegmentsRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/compare/segments/{file_path}',
      'get',
      metadata,
    )
  }

  /**
   * Returns a list of components for the specified repository
   *
   * @summary Component list
   */
  repos_components_list(
    metadata: types.ReposComponentsListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposComponentsListResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/components/',
      'get',
      metadata,
    )
  }

  /**
   * Repository config
   *
   */
  repos_config_retrieve(
    metadata: types.ReposConfigRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposConfigRetrieveResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/repos/{repo_name}/config/', 'get', metadata)
  }

  /**
   * Returns a paginated list of timeseries measurements aggregated by the specified
   * `interval`.  If there are no measurements on `start_date` then the response will include
   * 1 measurement older than `start_date` so that the coverage value can be carried forward
   * if necessary.
   *
   * Optionally filterable by:
   * * `branch`
   * * `start_date`
   * * `end_date`
   *
   * @summary Coverage trend
   */
  repos_coverage_list(
    metadata: types.ReposCoverageListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposCoverageListResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/coverage/',
      'get',
      metadata,
    )
  }

  /**
   * Similar to the coverage report endpoint but only returns coverage info for a single
   * file specified by `path`.
   *
   * By default that commit is the head of the default branch but can also be specified
   * explictily by:
   * * `sha` - return report for the commit with the given SHA
   * * `branch` - return report for the head commit of the branch with the given name
   *
   * @summary File coverage report
   */
  repos_file_report_retrieve(
    metadata: types.ReposFileReportRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposFileReportRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/file_report/{path}/',
      'get',
      metadata,
    )
  }

  /**
   * Returns a paginated list of flags for the specified repository
   *
   * @summary Flag list
   */
  repos_flags_list(
    metadata: types.ReposFlagsListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposFlagsListResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/repos/{repo_name}/flags/', 'get', metadata)
  }

  /**
   * Returns a paginated list of timeseries measurements aggregated by the specified
   * `interval`.  If there are no measurements on `start_date` then the response will include
   * 1 measurement older than `start_date` so that the coverage value can be carried forward
   * if necessary.
   *
   * Optionally filterable by:
   * * `branch`
   * * `start_date`
   * * `end_date`
   *
   * @summary Coverage trend
   */
  repos_flags_coverage_list(
    metadata: types.ReposFlagsCoverageListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposFlagsCoverageListResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/flags/{flag_name}/coverage/',
      'get',
      metadata,
    )
  }

  /**
   * Returns a paginated list of pulls for the specified repository
   *
   * Optionally filterable by:
   * * `state`
   * * `start_date`
   *
   * Orderable by:
   * * `pullid`
   *
   * @summary Pull list
   */
  repos_pulls_list(
    metadata: types.ReposPullsListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposPullsListResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/repos/{repo_name}/pulls/', 'get', metadata)
  }

  /**
   * Returns a single pull by ID
   *
   * @summary Pull detail
   */
  repos_pulls_retrieve(
    metadata: types.ReposPullsRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposPullsRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/pulls/{pullid}/',
      'get',
      metadata,
    )
  }

  /**
   * Similar to the coverage totals endpoint but also returns line-by-line
   * coverage info (hit=0/miss=1/partial=2).
   *
   * By default that commit is the head of the default branch but can also be specified
   * explictily by:
   * * `sha` - return report for the commit with the given SHA
   * * `branch` - return report for the head commit of the branch with the given name
   *
   * The report can be optionally filtered by specifying:
   * * `path` - only show report info for pathnames that start with this value
   * * `flag` - only show report info that applies to the specified flag name
   * * `component_id` - only show report info that applies to the specified component
   *
   * @summary Commit coverage report
   */
  repos_report_retrieve(
    metadata: types.ReposReportRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposReportRetrieveResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/repos/{repo_name}/report/', 'get', metadata)
  }

  /**
   * Returns a hierarchical view of the report that matches the file structure of the covered
   * files
   * with coverage info rollups at each level.
   *
   * Returns only top-level data by default but the depth of the traversal can be controlled
   * via
   * the `depth` parameter.
   *
   * * `depth` - how deep in the tree to traverse (default=1)
   * * `path` - path in the tree from which to start the traversal (default is the root)
   *
   * @summary Coverage report tree
   */
  repos_report_tree_retrieve(
    metadata: types.ReposReportTreeRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposReportTreeRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/report/tree',
      'get',
      metadata,
    )
  }

  /**
   * Returns a list of test results for the specified repository and commit
   *
   * @summary Test results list
   */
  repos_test_results_list(
    metadata: types.ReposTestResultsListMetadataParam,
  ): Promise<FetchResponse<200, types.ReposTestResultsListResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/test-results/',
      'get',
      metadata,
    )
  }

  /**
   * Returns a single test result by ID
   *
   * @summary Test results detail
   */
  repos_test_results_retrieve(
    metadata: types.ReposTestResultsRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposTestResultsRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/repos/{repo_name}/test-results/{id}/',
      'get',
      metadata,
    )
  }

  /**
   * Returns the coverage totals for a given commit and the
   * coverage totals broken down by file.
   *
   * By default that commit is the head of the default branch but can also be specified
   * explictily by:
   * * `sha` - return totals for the commit with the given SHA
   * * `branch` - return totals for the head commit of the branch with the given name
   *
   * The totals can be optionally filtered by specifying:
   * * `path` - only show totals for pathnames that start with this value
   * * `flag` - only show totals that applies to the specified flag name
   * * `component_id` - only show totals that applies to the specified component
   *
   * @summary Commit coverage totals
   */
  repos_totals_retrieve(
    metadata: types.ReposTotalsRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.ReposTotalsRetrieveResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/repos/{repo_name}/totals/', 'get', metadata)
  }

  /**
   * Returns a paginated list of users' login session for the specified owner (org)
   *
   * Note: Requires the caller to be an admin of the requested organization
   *
   * @summary User session list
   */
  user_sessions_list(
    metadata: types.UserSessionsListMetadataParam,
  ): Promise<FetchResponse<200, types.UserSessionsListResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/user-sessions/', 'get', metadata)
  }

  /**
   * Returns a paginated list of users for the specified owner (org)
   *
   * @summary User list
   */
  users_list(
    metadata: types.UsersListMetadataParam,
  ): Promise<FetchResponse<200, types.UsersListResponse200>> {
    return this.core.fetch('/{service}/{owner_username}/users/', 'get', metadata)
  }

  /**
   * Returns a user for the specified owner_username or ownerid
   *
   * @summary User detail
   */
  users_retrieve(
    metadata: types.UsersRetrieveMetadataParam,
  ): Promise<FetchResponse<200, types.UsersRetrieveResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/users/{user_username_or_ownerid}/',
      'get',
      metadata,
    )
  }

  /**
   * Updates a user for the specified owner_username or ownerid
   *
   * Allowed fields
   *   - activated: boolean value to activate or deactivate the user
   *
   * @summary Update a user
   */
  users_partial_update(
    body: types.UsersPartialUpdateBodyParam,
    metadata: types.UsersPartialUpdateMetadataParam,
  ): Promise<FetchResponse<200, types.UsersPartialUpdateResponse200>>
  users_partial_update(
    metadata: types.UsersPartialUpdateMetadataParam,
  ): Promise<FetchResponse<200, types.UsersPartialUpdateResponse200>>
  users_partial_update(
    body?: types.UsersPartialUpdateBodyParam | types.UsersPartialUpdateMetadataParam,
    metadata?: types.UsersPartialUpdateMetadataParam,
  ): Promise<FetchResponse<200, types.UsersPartialUpdateResponse200>> {
    return this.core.fetch(
      '/{service}/{owner_username}/users/{user_username_or_ownerid}/',
      'patch',
      body,
      metadata,
    )
  }
}

const createSDK = (() => {
  return new SDK()
})()

export default createSDK

export type {
  ReposBranchesListMetadataParam,
  ReposBranchesListResponse200,
  ReposBranchesRetrieveMetadataParam,
  ReposBranchesRetrieveResponse200,
  ReposCommitsListMetadataParam,
  ReposCommitsListResponse200,
  ReposCommitsRetrieveMetadataParam,
  ReposCommitsRetrieveResponse200,
  ReposCommitsUploadsListMetadataParam,
  ReposCommitsUploadsListResponse200,
  ReposCompareComponentsRetrieveMetadataParam,
  ReposCompareComponentsRetrieveResponse200,
  ReposCompareFileRetrieveMetadataParam,
  ReposCompareFileRetrieveResponse200,
  ReposCompareFlagsRetrieveMetadataParam,
  ReposCompareFlagsRetrieveResponse200,
  ReposCompareImpactedFilesRetrieveMetadataParam,
  ReposCompareImpactedFilesRetrieveResponse200,
  ReposCompareRetrieveMetadataParam,
  ReposCompareRetrieveResponse200,
  ReposCompareSegmentsRetrieveMetadataParam,
  ReposCompareSegmentsRetrieveResponse200,
  ReposComponentsListMetadataParam,
  ReposComponentsListResponse200,
  ReposConfigRetrieveMetadataParam,
  ReposConfigRetrieveResponse200,
  ReposCoverageListMetadataParam,
  ReposCoverageListResponse200,
  ReposFileReportRetrieveMetadataParam,
  ReposFileReportRetrieveResponse200,
  ReposFlagsCoverageListMetadataParam,
  ReposFlagsCoverageListResponse200,
  ReposFlagsListMetadataParam,
  ReposFlagsListResponse200,
  ReposListMetadataParam,
  ReposListResponse200,
  ReposPullsListMetadataParam,
  ReposPullsListResponse200,
  ReposPullsRetrieveMetadataParam,
  ReposPullsRetrieveResponse200,
  ReposReportRetrieveMetadataParam,
  ReposReportRetrieveResponse200,
  ReposReportTreeRetrieveMetadataParam,
  ReposReportTreeRetrieveResponse200,
  ReposRetrieveMetadataParam,
  ReposRetrieveResponse200,
  ReposTestResultsListMetadataParam,
  ReposTestResultsListResponse200,
  ReposTestResultsRetrieveMetadataParam,
  ReposTestResultsRetrieveResponse200,
  ReposTotalsRetrieveMetadataParam,
  ReposTotalsRetrieveResponse200,
  RootListMetadataParam,
  RootListResponse200,
  RootRetrieveMetadataParam,
  RootRetrieveResponse200,
  UserSessionsListMetadataParam,
  UserSessionsListResponse200,
  UsersListMetadataParam,
  UsersListResponse200,
  UsersPartialUpdateBodyParam,
  UsersPartialUpdateMetadataParam,
  UsersPartialUpdateResponse200,
  UsersRetrieveMetadataParam,
  UsersRetrieveResponse200,
} from './types'
