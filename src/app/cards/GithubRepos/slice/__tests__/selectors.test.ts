import * as selectors from '../selectors';
import { RootState } from 'types';
import { RepoErrorType } from '../types';
import { initialState } from '..';
import { ReposList } from 'types/Repo';

describe('GithubRepoForm selectors', () => {
  let state: RootState = {};

  beforeEach(() => {
    state = {};
  });

  it('should select the initial state', () => {
    expect(selectors.selectRepositoryname(state)).toEqual(initialState.repositoryname);
  });

  it('should select respo name', () => {
    const reponame = 'test';
    state = {
      githubRepoForm: { ...initialState, repositoryname: reponame },
    };
    expect(selectors.selectRepositoryname(state)).toEqual(reponame);
  });

  it('should select username', () => {
    const repo = { name: 'test' } as ReposList;
    state = {
      githubRepoForm: { ...initialState, repositories: [repo] },
    };
    expect(selectors.selectRepos(state)).toEqual([repo]);
  });

  it('should select error', () => {
    const error = RepoErrorType.REPOSITORY_NOT_FOUND;
    state = {
      githubRepoForm: { ...initialState, error: error },
    };
    expect(selectors.selectError(state)).toEqual(error);
  });

  it('should select loading', () => {
    const loading = true;
    state = {
      githubRepoForm: { ...initialState, loading: loading },
    };
    expect(selectors.selectLoading(state)).toEqual(loading);
  });
});
