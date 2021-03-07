import { PayloadAction } from '@reduxjs/toolkit';
import { ReposList } from 'types/Repo';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { githubRepoFormSaga } from './saga';
import { GithubRepositiesState, RepoErrorType } from './types';

export const initialState: GithubRepositiesState = {
  repositoryname: '',
  repositories: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'githubRepoForm',
  initialState,
  reducers: {
    changeRepositoryname(state, action: PayloadAction<string>) {
      state.repositoryname = action.payload;
    },
    loadRepos(state) {
      state.loading = true;
      state.error = null;
      state.repositories = [];
    },
    reposLoaded(state, action: PayloadAction<ReposList[]>) {
      const repos = action.payload;
      state.repositories = repos;
      state.loading = false;
    },
    repoError(state, action: PayloadAction<RepoErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
    loadRepoByName(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
      state.repositoryname = action.payload;
    },
    repoLoadedByName(state, action: PayloadAction<ReposList>) {
      const repos = action.payload;
      state.repositories = [repos];
      state.loading = false;
    },
    errorOnLoadingByName(state, action: PayloadAction<RepoErrorType>) {
      state.repositories = [];
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { actions: githubRepoFormActions, reducer } = slice;

export const useGithubRepoFormSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: githubRepoFormSaga });
  return { actions: slice.actions };
};
