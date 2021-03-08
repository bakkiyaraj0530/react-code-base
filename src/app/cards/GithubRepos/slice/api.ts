import { request } from 'utils/request';
import { queryFetchRepoByName, queryfetchRepos } from './queries';

const URL = 'https://api.github.com/graphql';

export const fetchData = (reponame: String | null) =>
  request(URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 61895de0bf18225d0e8e07cf7dd6c46f5c6109ce',
    },
    body: JSON.stringify(
      reponame ? queryFetchRepoByName(reponame) : queryfetchRepos(),
    ),
  });
