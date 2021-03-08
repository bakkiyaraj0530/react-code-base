import * as slice from '..';
import { ContainerState, RepoErrorType } from '../types';
import { ReposList } from 'types/Repo';

describe('GithubRepoForm slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should return the initial state', () => {
    expect(slice.reducer(undefined, { type: '' })).toEqual(state);
  });

  it('should handle changeUsername', () => {
    const text = 'test';
    expect(
      slice.reducer(state, slice.githubRepoFormActions.changeRepositoryname(text)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      repositoryname: text,
    });
  });

  it('should handle loadRepos', () => {
    expect(
      slice.reducer(state, slice.githubRepoFormActions.loadRepos()),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: true,
      repositories: [],
      error: null,
    });
  });

  it('should handle reposLoaded', () => {
    const repos = [{ name: 'test' }] as ReposList[];
    expect(
      slice.reducer(state, slice.githubRepoFormActions.reposLoaded(repos)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      loading: false,
      repositories: repos,
    });
  });

  it('should handle repoError', () => {
    const repoError = RepoErrorType.REPOSITORY_NOT_FOUND;
    expect(
      slice.reducer(state, slice.githubRepoFormActions.repoError(repoError)),
    ).toEqual<ContainerState>({
        repositoryname: '',
        repositories: [],
        loading: false,
       error: repoError,
    });
  });
});
