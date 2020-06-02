import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const trx = await knex.transaction();
    const points = await trx("points").select("*");
    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const point = await knex("points").where("id", id).first();
    if (!point) {
      return response.status(404).json({ message: "Point Not Found" });
    }
    return response.json(point);
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    await knex.transaction(async (trx) => {
      const point = {
        image: "image-fake",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
      };

      const insertedIds = await trx("points").insert(point);

      const point_id = insertedIds[0];
      const pointItems = items.map((item_id: Number) => {
        return {
          item_id,
          point_id,
        };
      });

      await trx("point_items").insert(pointItems);

      return response.json({ ...point, id: point_id });
    });
  }
}

export default PointsController;
