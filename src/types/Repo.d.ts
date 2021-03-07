
export interface ReposList {
  forkCount: number;
  name: string;
  stargazerCount: number;
}

export interface RepoListData {
  data: {
    viewer: {
      repositories: {
        nodes: Array<ReposList>
      }
    }
  }
}

export interface RepoData {
  data: {
    viewer: {
      repository: ReposList
    }
  }
}
