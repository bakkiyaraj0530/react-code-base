import { ReposList } from 'types/Repo';

/* --- STATE --- */
export interface GithubRepositiesState {
  repositoryname: string;
  loading: boolean;
  error?: RepoErrorType | null;
  repositories: ReposList[];
}
export enum RepoErrorType {
  RESPONSE_ERROR = 1,
  REPOSITORY_NOT_FOUND = 2,
  REPOSITORYNAME_EMPTY = 3,
  HAS_NO_REPO = 4,
  GITHUB_RATE_LIMIT = 5,
}

export interface Pagination {
  current: number;
  pageSize: number;
}
/* 
  If you want to use 'ContainerState' keyword everywhere in your feature folder, 
  instead of the 'HomePageState' keyword.
*/
export type ContainerState = GithubRepositiesState;
