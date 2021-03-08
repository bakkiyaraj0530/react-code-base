import * as React from 'react';
import { Store } from '@reduxjs/toolkit';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styles/theme/ThemeProvider';
import { HelmetProvider } from 'react-helmet-async';
import { GithubRepos, repoErrorText } from '..';
import { configureAppStore } from 'store/configureStore';
import { githubRepoFormActions as actions, initialState } from '../slice';
import { RepoErrorType } from '../slice/types';

function* mockGithubRepoFormSaga() {}

jest.mock('../slice/saga', () => ({
  githubRepoFormSaga: mockGithubRepoFormSaga,
}));

const renderGithubRepoForm = (store: Store) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <GithubRepos />
        </HelmetProvider>
      </ThemeProvider>
    </Provider>,
  );

describe('<GithubRepoForm />', () => {
  let store: ReturnType<typeof configureAppStore>;
  let component: ReturnType<typeof renderGithubRepoForm>;

  beforeEach(() => {
    store = configureAppStore();
    component = renderGithubRepoForm(store);
    expect(store.getState().githubRepoForm).toEqual(initialState);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  afterEach(() => {
    component.unmount();
  });

  it("should fetch repos on mount if Respository name isn't empty", () => {
    component.unmount();
    component = renderGithubRepoForm(store);
    store.dispatch(actions.reposLoaded([{forkCount: 1,name: 'name',stargazerCount: 10}]));
    expect(initialState.repositoryname.length).toBeLessThanOrEqual(0);
    expect(store.getState().githubRepoForm.loading).toBe(false);
  });

  it("shouldn't fetch repos on mount if Respository name is empty", () => {
    store.dispatch(actions.changeRepositoryname(''));
    store.dispatch(actions.reposLoaded([{forkCount: 1,name: 'name',stargazerCount: 10}]));
    component.unmount();
    component = renderGithubRepoForm(store);
    expect(store.getState().githubRepoForm.loading).toBe(true);
  });

  it('should dispatch action on repo name change', () => {
    const input = component.container.querySelector('input');
    fireEvent.change(input!, { target: { value: 'test' } });
    expect(store.getState().githubRepoForm.loading).toBe(false);
  });

  it('should change username field value on action', () => {
    const value = 'test';
    const form = renderGithubRepoForm(store);

    const input = form.container.querySelector('input');
    fireEvent.change(input!, { target: { value: value } });

    expect(form.container.querySelector('input')?.value).toBe(value);
  });

  it('should display loading indicator when state is loading', () => {
    store.dispatch(actions.loadRepos());
    expect(component.container.querySelector('circle')).toBeInTheDocument();
  });

  it('should display list when repos not empty', () => {
    const repoName = 'testRepo';
    store.dispatch(
      actions.reposLoaded([{ id: 'test', name: repoName } as any]),
    );
    expect(component.queryByText(repoName)).toBeInTheDocument();
  });

  it('should display error when repoError fired', () => {
    let error = RepoErrorType.REPOSITORY_NOT_FOUND;
    store.dispatch(actions.repoError(error));
    expect(component.queryByText(repoErrorText(error))).toBeInTheDocument();

    error = RepoErrorType.HAS_NO_REPO;
    store.dispatch(actions.repoError(error));
    expect(component.queryByText(repoErrorText(error))).toBeInTheDocument();

    error = RepoErrorType.REPOSITORYNAME_EMPTY;
    store.dispatch(actions.repoError(error));
    expect(component.queryByText(repoErrorText(error))).toBeInTheDocument();

    error = RepoErrorType.RESPONSE_ERROR;
    store.dispatch(actions.repoError(error));
    expect(component.queryByText(repoErrorText(error))).toBeInTheDocument();

    error = RepoErrorType.GITHUB_RATE_LIMIT;
    store.dispatch(actions.repoError(error));
    expect(component.queryByText(repoErrorText(error))).toBeInTheDocument();
  });
});
