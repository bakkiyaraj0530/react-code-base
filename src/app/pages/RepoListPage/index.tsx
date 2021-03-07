import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { GithubRepos } from 'app/cards/GithubRepos';
import { PageWrapper } from 'app/components/PageWrapper';

export function RepoListPage() {
  return (
    <>
      <Helmet>
        <title>Repo Listing Page</title>
        <meta
          name="description"
          content="A React Boilerplate application homepage"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <GithubRepos />
      </PageWrapper>
    </>
  );
}
