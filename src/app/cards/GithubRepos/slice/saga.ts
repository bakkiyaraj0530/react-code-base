import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { selectRepositoryname } from './selectors';
import { githubRepoFormActions as actions } from '.';
import { ReposList, RepoListData, RepoData } from 'types/Repo';
import { RepoErrorType } from './types';
import { fetchData } from './api';

/**
 * Github repos request/response handler
 */
export function* getAllRepos() {
  yield delay(500);
  try {
    const repos: RepoListData = yield call(fetchData, '');
    if (repos?.data?.viewer?.repositories?.nodes?.length > 0) {
      // Add the repos list into repositoties store
      yield put(actions.reposLoaded(repos?.data?.viewer?.repositories?.nodes));
    } else if(repos?.data?.viewer === undefined) {
      yield put(actions.repoError(RepoErrorType.REPOSITORYNAME_EMPTY));
     } else {
      yield put(actions.repoError(RepoErrorType.REPOSITORY_NOT_FOUND));
     }
  } catch (err) {
    if (err.response?.status === 404) {
      yield put(actions.repoError(RepoErrorType.REPOSITORY_NOT_FOUND));
    } else if (err.message === 'Failed to fetch') {
      yield put(actions.repoError(RepoErrorType.GITHUB_RATE_LIMIT));
    } else if (err.message === 'Failed to fetch') {
      yield put(actions.repoError(RepoErrorType.GITHUB_RATE_LIMIT));
    } else {
      yield put(actions.repoError(RepoErrorType.RESPONSE_ERROR));
    }
  }
}

/**
 * Fetch Repos by name -  request/response handler
 */

export function* getRepoByName() {
  yield delay(500);
  // Select Repository Name from store
  const repositoryname: string = yield select(selectRepositoryname);
  if (repositoryname.length === 0) {
    yield put(actions.repoError(RepoErrorType.REPOSITORYNAME_EMPTY));
    return;
  }

  try {
    const repository: RepoData = yield call(fetchData, repositoryname);

    const repodata: ReposList = repository?.data?.viewer?.repository;
    if (repodata !== null) {
      yield put(actions.repoLoadedByName(repodata));
    } else {
      yield put(
        actions.errorOnLoadingByName(RepoErrorType.REPOSITORY_NOT_FOUND),
      );
    }
  } catch (err) {
    if (err.response?.status === 404) {
      yield put(actions.repoError(RepoErrorType.HAS_NO_REPO));
    } else if (err.message === 'Failed to fetch') {
      yield put(actions.repoError(RepoErrorType.GITHUB_RATE_LIMIT));
    } else {
      yield put(actions.repoError(RepoErrorType.RESPONSE_ERROR));
    }
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* githubRepoFormSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadRepos.type, getAllRepos);
  yield takeLatest(actions.loadRepoByName.type, getRepoByName);
}
