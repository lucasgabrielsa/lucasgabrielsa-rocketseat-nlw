import express from "express";

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

const routes = express.Router();

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.list);

routes.get("/points", pointsController.list);
routes.post("/points", pointsController.create);

export default routes;
