import createApp from "./src/app/app.ts";
import connectDb from "./src/database/db.ts";
import env from "./src/config/env.ts";
import logger from "./src/config/logger.ts";
(function startServer() {
  connectDb()
    .then(() => {
      createApp().listen(env.PORT, () => {
        logger.info({ port: env.PORT }, "your app is running ");
      });
    })
    .catch((error) =>
      logger.error({ error: error }, "there is something error "),
    );
})();
