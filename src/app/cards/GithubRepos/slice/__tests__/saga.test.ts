import { put, takeLatest } from 'redux-saga/effects';
import * as slice from '..';

import { githubRepoFormSaga, getAllRepos } from '../saga';
import { RepoErrorType } from '../types';

describe('getAllRepos Saga', () => {
  let respositoryname: any;
  let repos: any;
  let getReposIterator: ReturnType<typeof getAllRepos>;

  // We have to test twice, once for a successful load and once for an unsuccessful one
  // so we do all the stuff that happens beforehand automatically in the beforeEach
  beforeEach(() => {
    getReposIterator = getAllRepos();
    const delayDescriptor = getReposIterator.next().value;
    expect(delayDescriptor).toMatchSnapshot();

    const selectDescriptor = getReposIterator.next().value;
    expect(selectDescriptor).toMatchSnapshot();
  });

  it('should return error if repository is empty', () => {
    respositoryname = '';
    const putDescriptor = getReposIterator.next(respositoryname).value;
    expect(putDescriptor).toEqual(
      put(slice.githubRepoFormActions.repoError(RepoErrorType.REPOSITORYNAME_EMPTY)),
    );

    const iteration = getReposIterator.next();
    expect(iteration.done).toBe(true);
  });

  it('should dispatch the reposLoaded action if it requests the data successfully', () => {
    respositoryname = 'test';
   
    repos = [{
      forkCount: 1,
      name: 'test',
      stargazerCount: 1
    }]
    
    const requestDescriptor = getReposIterator.next(respositoryname).value;
    expect(requestDescriptor).toMatchSnapshot();
  });

  it('should dispatch the user not found error', () => {
    respositoryname = 'test';
    const requestDescriptor = getReposIterator.next(respositoryname).value;
    expect(requestDescriptor).toMatchSnapshot();

    const putDescriptor = getReposIterator.throw({ response: { status: 404 } })
      .value;
    expect(putDescriptor).toEqual(
      put(slice.githubRepoFormActions.repoError(RepoErrorType.REPOSITORY_NOT_FOUND)),
    );
  });

  it('should dispatch the github rate limit error', () => {
    respositoryname = 'test';

    const requestDescriptor = getReposIterator.next(respositoryname).value;
    expect(requestDescriptor).toMatchSnapshot();

    const putDescriptor = getReposIterator.throw(new Error('Failed to fetch'))
      .value;
    expect(putDescriptor).toEqual(
      put(
        slice.githubRepoFormActions.repoError(RepoErrorType.GITHUB_RATE_LIMIT),
      ),
    );
  });

  it('should dispatch the response error', () => {
    respositoryname = 'test';

    const requestDescriptor = getReposIterator.next(respositoryname).value;
    expect(requestDescriptor).toMatchSnapshot();

    const putDescriptor = getReposIterator.throw(new Error('some error')).value;
    expect(putDescriptor).toEqual(
      put(slice.githubRepoFormActions.repoError(RepoErrorType.RESPONSE_ERROR)),
    );
  });
});

describe('githubRepoFormSaga Saga', () => {
  const githubRepoFormIterator = githubRepoFormSaga();
  it('should start task to watch for loadRepos action', () => {
    const takeLatestDescriptor = githubRepoFormIterator.next().value;
    expect(takeLatestDescriptor).toEqual(
      takeLatest(slice.githubRepoFormActions.loadRepos.type, getAllRepos),
    );
  });
});
