import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    console.log(city, uf, items);
    const parsedItems: Number[] = String(items)
      .split(", ")
      .map((item) => Number(item.trim()));

    await knex.transaction(async (trx) => {
      const points = await trx("points")
        .join("point_items", "points.id", "=", "point_items.point_id")
        .whereIn("point_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("points.*");
      return response.json(points);
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    await knex.transaction(async (trx) => {
      const point = await trx("points").where("id", id).first();

      if (!point) {
        return response.status(404).json({ message: "Point Not Found" });
      }

      const items = await trx("items")
        .join("point_items", "items.id", "=", "point_items.item_id")
        .where("point_items.item_id", id);

      return response.json({ ...point, items });
    });
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
        image:
          "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80",
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
