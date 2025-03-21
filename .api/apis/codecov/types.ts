import type { FromSchema } from 'json-schema-to-ts'
import * as schemas from './schemas'

export type ReposBranchesListMetadataParam = FromSchema<typeof schemas.ReposBranchesList.metadata>
export type ReposBranchesListResponse200 = FromSchema<
  (typeof schemas.ReposBranchesList.response)['200']
>
export type ReposBranchesRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposBranchesRetrieve.metadata
>
export type ReposBranchesRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposBranchesRetrieve.response)['200']
>
export type ReposCommitsListMetadataParam = FromSchema<typeof schemas.ReposCommitsList.metadata>
export type ReposCommitsListResponse200 = FromSchema<
  (typeof schemas.ReposCommitsList.response)['200']
>
export type ReposCommitsRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposCommitsRetrieve.metadata
>
export type ReposCommitsRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposCommitsRetrieve.response)['200']
>
export type ReposCommitsUploadsListMetadataParam = FromSchema<
  typeof schemas.ReposCommitsUploadsList.metadata
>
export type ReposCommitsUploadsListResponse200 = FromSchema<
  (typeof schemas.ReposCommitsUploadsList.response)['200']
>
export type ReposCompareComponentsRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposCompareComponentsRetrieve.metadata
>
export type ReposCompareComponentsRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposCompareComponentsRetrieve.response)['200']
>
export type ReposCompareFileRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposCompareFileRetrieve.metadata
>
export type ReposCompareFileRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposCompareFileRetrieve.response)['200']
>
export type ReposCompareFlagsRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposCompareFlagsRetrieve.metadata
>
export type ReposCompareFlagsRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposCompareFlagsRetrieve.response)['200']
>
export type ReposCompareImpactedFilesRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposCompareImpactedFilesRetrieve.metadata
>
export type ReposCompareImpactedFilesRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposCompareImpactedFilesRetrieve.response)['200']
>
export type ReposCompareRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposCompareRetrieve.metadata
>
export type ReposCompareRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposCompareRetrieve.response)['200']
>
export type ReposCompareSegmentsRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposCompareSegmentsRetrieve.metadata
>
export type ReposCompareSegmentsRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposCompareSegmentsRetrieve.response)['200']
>
export type ReposComponentsListMetadataParam = FromSchema<
  typeof schemas.ReposComponentsList.metadata
>
export type ReposComponentsListResponse200 = FromSchema<
  (typeof schemas.ReposComponentsList.response)['200']
>
export type ReposConfigRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposConfigRetrieve.metadata
>
export type ReposConfigRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposConfigRetrieve.response)['200']
>
export type ReposCoverageListMetadataParam = FromSchema<typeof schemas.ReposCoverageList.metadata>
export type ReposCoverageListResponse200 = FromSchema<
  (typeof schemas.ReposCoverageList.response)['200']
>
export type ReposFileReportRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposFileReportRetrieve.metadata
>
export type ReposFileReportRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposFileReportRetrieve.response)['200']
>
export type ReposFlagsCoverageListMetadataParam = FromSchema<
  typeof schemas.ReposFlagsCoverageList.metadata
>
export type ReposFlagsCoverageListResponse200 = FromSchema<
  (typeof schemas.ReposFlagsCoverageList.response)['200']
>
export type ReposFlagsListMetadataParam = FromSchema<typeof schemas.ReposFlagsList.metadata>
export type ReposFlagsListResponse200 = FromSchema<(typeof schemas.ReposFlagsList.response)['200']>
export type ReposListMetadataParam = FromSchema<typeof schemas.ReposList.metadata>
export type ReposListResponse200 = FromSchema<(typeof schemas.ReposList.response)['200']>
export type ReposPullsListMetadataParam = FromSchema<typeof schemas.ReposPullsList.metadata>
export type ReposPullsListResponse200 = FromSchema<(typeof schemas.ReposPullsList.response)['200']>
export type ReposPullsRetrieveMetadataParam = FromSchema<typeof schemas.ReposPullsRetrieve.metadata>
export type ReposPullsRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposPullsRetrieve.response)['200']
>
export type ReposReportRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposReportRetrieve.metadata
>
export type ReposReportRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposReportRetrieve.response)['200']
>
export type ReposReportTreeRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposReportTreeRetrieve.metadata
>
export type ReposReportTreeRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposReportTreeRetrieve.response)['200']
>
export type ReposRetrieveMetadataParam = FromSchema<typeof schemas.ReposRetrieve.metadata>
export type ReposRetrieveResponse200 = FromSchema<(typeof schemas.ReposRetrieve.response)['200']>
export type ReposTestResultsListMetadataParam = FromSchema<
  typeof schemas.ReposTestResultsList.metadata
>
export type ReposTestResultsListResponse200 = FromSchema<
  (typeof schemas.ReposTestResultsList.response)['200']
>
export type ReposTestResultsRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposTestResultsRetrieve.metadata
>
export type ReposTestResultsRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposTestResultsRetrieve.response)['200']
>
export type ReposTotalsRetrieveMetadataParam = FromSchema<
  typeof schemas.ReposTotalsRetrieve.metadata
>
export type ReposTotalsRetrieveResponse200 = FromSchema<
  (typeof schemas.ReposTotalsRetrieve.response)['200']
>
export type RootListMetadataParam = FromSchema<typeof schemas.RootList.metadata>
export type RootListResponse200 = FromSchema<(typeof schemas.RootList.response)['200']>
export type RootRetrieveMetadataParam = FromSchema<typeof schemas.RootRetrieve.metadata>
export type RootRetrieveResponse200 = FromSchema<(typeof schemas.RootRetrieve.response)['200']>
export type UserSessionsListMetadataParam = FromSchema<typeof schemas.UserSessionsList.metadata>
export type UserSessionsListResponse200 = FromSchema<
  (typeof schemas.UserSessionsList.response)['200']
>
export type UsersListMetadataParam = FromSchema<typeof schemas.UsersList.metadata>
export type UsersListResponse200 = FromSchema<(typeof schemas.UsersList.response)['200']>
export type UsersPartialUpdateBodyParam = FromSchema<typeof schemas.UsersPartialUpdate.body>
export type UsersPartialUpdateMetadataParam = FromSchema<typeof schemas.UsersPartialUpdate.metadata>
export type UsersPartialUpdateResponse200 = FromSchema<
  (typeof schemas.UsersPartialUpdate.response)['200']
>
export type UsersRetrieveMetadataParam = FromSchema<typeof schemas.UsersRetrieve.metadata>
export type UsersRetrieveResponse200 = FromSchema<(typeof schemas.UsersRetrieve.response)['200']>
