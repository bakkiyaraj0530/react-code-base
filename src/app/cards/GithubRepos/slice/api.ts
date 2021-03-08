import { request } from 'utils/request';
import { queryFetchRepoByName, queryfetchRepos } from './queries';

const URL = 'https://api.github.com/graphql';

export const fetchData = (reponame: String | null) =>
  request(URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 2e988a6e11255e5f153beed37087f91b013a93f4',
    },
    body: JSON.stringify(
      reponame ? queryFetchRepoByName(reponame) : queryfetchRepos(),
    ),
  });
