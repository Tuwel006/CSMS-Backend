export { MatchesController } from './match.controller';
export { MatchesService } from './match.service';
export { TeamSetupController } from './team-setup.controller';
export { TeamSetupService } from './team-setup.service';
export * from './match.dto';
import './match.swagger';
import { matchPaths as matchesPaths } from './match.swagger';
export { matchesPaths };
export { default as matchesRoutes } from './match.routes';

