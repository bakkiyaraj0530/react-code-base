/*
 * List Queries, to fetch repositories based on use case:
 *
 */
// use case 1: List All Repositories irrespective of repo name.
export const queryfetchRepos = () => ({
  query:
    'query { viewer { repositories(first: 100) { nodes {  name forkCount stargazerCount  }  } } }',
});

// use case 2: Fetch Repository based on repo name
export const queryFetchRepoByName = reponame => ({
  query:
    'query ($name: String!) { viewer { repository(name: $name) { name, forkCount, stargazerCount } } }',
  variables: { name: reponame },
});
