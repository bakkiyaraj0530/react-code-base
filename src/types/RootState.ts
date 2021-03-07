import { GithubRepositiesState } from 'app/cards/GithubRepos/slice/types';
import { ThemeState } from 'styles/theme/slice/types';


export interface RootState {
  theme?: ThemeState;
  githubRepoForm?: GithubRepositiesState;
}
