import { request } from 'utils/request';
import { queryFetchRepoByName, queryfetchRepos } from './queries';

const URL = 'https://api.github.com/graphql';

export const fetchData = (reponame: String | null) =>
  request(URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 63b45901ccbccae86fb0f3111c24a0fc00422194',
    },
    body: JSON.stringify(
      reponame ? queryFetchRepoByName(reponame) : queryfetchRepos(),
    ),
  });
