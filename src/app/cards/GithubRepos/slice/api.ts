import { request } from 'utils/request';
import { queryFetchRepoByName, queryfetchRepos } from './queries';

const URL = 'https://api.github.com/graphql';

export const fetchData = (reponame: String | null) =>
  request(URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 8d946bf3c1b5e14a3d7d7d12af16186c56ab4670',
    },
    body: JSON.stringify(
      reponame ? queryFetchRepoByName(reponame) : queryfetchRepos(),
    ),
  });
