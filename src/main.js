import { logger } from "./app/logging.js";
import { Web } from "./app/web.js";

const PORT = 3000;
Web.listen(PORT, () => {
  logger.info(`listening on ${PORT}`);
});
