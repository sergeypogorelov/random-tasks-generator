import { Observable } from 'rxjs';

export interface NameUnusedService {
  checkIfNameUnused: (name: string, originName?: string) => Observable<boolean>;
}
