import { request } from 'utils/request';
import { queryFetchRepoByName, queryfetchRepos } from './queries';

const URL = 'https://api.github.com/graphql';

export const fetchData = (reponame: String | null) =>
  request(URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer e76ccd90c5ddb686d63fa9082ead6dc62a04a440',
    },
    body: JSON.stringify(
      reponame ? queryFetchRepoByName(reponame) : queryfetchRepos(),
    ),
  });
