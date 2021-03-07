import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'antd';
import { FormLabel } from 'app/components/FormLabel';
import { Input } from './components/Input';
import { TextButton } from './components/TextButton';
import {
  selectRepositoryname,
  selectRepos,
  selectLoading,
  selectError,
} from './slice/selectors';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { RepoErrorType } from './slice/types';
import { useGithubRepoFormSlice } from './slice';
import 'antd/dist/antd.css';

export function GithubRepos() {
  const { actions } = useGithubRepoFormSlice();
  const [pagination, updatePagination] = useState({ current: 1, pageSize: 10 });
  const repositoryname = useSelector(selectRepositoryname);
  const repos = useSelector(selectRepos);
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const dispatch = useDispatch();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name.length - b.name.length,
        multiple: 1,
      },
    },
    {
      title: 'Stars',
      dataIndex: 'stargazerCount',
      render: (stargazerCount: number, index) => {
        console.log(index);
        return `🌟  ${stargazerCount} `;
      },

      sorter: {
        compare: (a, b) => a.stargazerCount - b.stargazerCount,
        multiple: 3,
      },
    },
    {
      title: 'Forks',
      dataIndex: 'forkCount',
      sorter: {
        compare: (a, b) => a.forkCount - b.forkCount,
        multiple: 2,
      },
    },
  ];
  const onChangeRepositoryName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.value) {
      dispatch(actions.loadRepoByName(evt.currentTarget.value));
    } else {
      dispatch(actions.loadRepos());
    }
    dispatch(actions.changeRepositoryname(evt.currentTarget.value));
  };

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    dispatch(actions.loadRepos());
  });

  const onSubmitForm = (evt?: React.FormEvent<HTMLFormElement>) => {
    if (evt !== undefined && evt.preventDefault) {
      evt.preventDefault();
    }
  };
  const onChange = (pagination, filters, sorter, extra) => {
    updatePagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };
  return (
    <Container>
      <Repository>
        <Content>
          <Wrapper>
            <FormGroup onSubmit={onSubmitForm}>
              <FormLabel>Github Respositories</FormLabel>
              <InputWrapper>
                <Input
                  type="text"
                  placeholder="Type any Github repositories"
                  value={repositoryname}
                  onChange={onChangeRepositoryName}
                />
                {isLoading && <LoadingIndicator small />}
              </InputWrapper>
            </FormGroup>
            {repos?.length > 0 ? (
              <List>
                <Table
                  columns={columns}
                  dataSource={repos}
                  onChange={onChange}
                  pagination={pagination}
                />
              </List>
            ) : error ? (
              <ErrorText>{repoErrorText(error)}</ErrorText>
            ) : null}
          </Wrapper>
        </Content>
      </Repository>
    </Container>
  );
}

export const repoErrorText = (error: RepoErrorType) => {
  switch (error) {
    case RepoErrorType.REPOSITORY_NOT_FOUND:
      return 'There is no such Repository 😞';
    case RepoErrorType.REPOSITORYNAME_EMPTY:
      return 'Type any Github username';
    case RepoErrorType.HAS_NO_REPO:
      return 'No repository 🥺';
    case RepoErrorType.GITHUB_RATE_LIMIT:
      return 'Looks like github api`s rate limit(60 request/h) has exceeded 🤔';
    default:
      return 'An error has occurred!';
  }
};

const Container = styled.ul`
  padding: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Repository = styled.li`
  display: flex;

  .feature-icon {
    width: 6.25rem;
    height: 6.25rem;
    margin-right: 2.25rem;
    flex-shrink: 0;
  }
`;

const Wrapper = styled.div`
  ${TextButton} {
    margin: 16px 0;
    font-size: 0.875rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  ${Input} {
    width: ${100 / 3}%;
    margin-right: 0.5rem;
  }
`;

const ErrorText = styled.span`
  color: ${p => p.theme.text};
`;

const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  ${FormLabel} {
    margin-bottom: 0.25rem;
    margin-left: 0.125rem;
  }
`;

const List = styled.div``;
