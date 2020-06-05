import { Request, Response } from "express";
import knex from "../database/connection";

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems: Number[] = String(items)
      .split(", ")
      .map((item) => Number(item.trim()));

    await knex.transaction(async (trx) => {
      let points;
      if (city && uf && items) {
        points = await trx("points")
          .join("point_items", "points.id", "=", "point_items.point_id")
          .whereIn("point_items.item_id", parsedItems)
          .where("city", String(city))
          .where("uf", String(uf))
          .distinct()
          .select("points.*");
      } else {
        points = await trx("points")
          .join("point_items", "points.id", "=", "point_items.point_id")
          .distinct()
          .select("points.*");
      }

      const serializedPoints = points.map((point) => {
        return {
          ...point,
          image: `http://192.168.0.103:3333/uploads/files/${point.image}`,
        };
      });

      return response.json(serializedPoints);
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
        .where("point_items.point_id", id);

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

    let pointItems: any;
    let point_id: number;
    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    await knex.transaction(async (trx) => {
      const insertedIds = await trx("points").insert(point);
      point_id = Number(insertedIds[0]);
      pointItems = items
        .split(",")
        .map((item: string) => item.trim())
        .map((item_id: Number) => {
          return {
            point_id,
            item_id,
          };
        });
    });

    await knex.transaction(async (trx) => {
      await trx("point_items").insert(pointItems);
      return response.json({ ...point, id: point_id });
    });
  }
}

export default PointsController;
