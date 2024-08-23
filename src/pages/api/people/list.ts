// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CHART_COLORS } from "@/config/constants/chart.constant";
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { stringToBoolean } from "@/helpers/data.helper";
import { assetFaces, assets, exif, person } from "@/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  isNotNull,
  isNull,
  lte,
  ne,
  sql,
  sum,
} from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type ISortField = "assetCount" | "updatedAt" | "createdAt";

interface IQuery {
  page: number;
  perPage: number;
  nameLessOnly: boolean | string;
  maximumAssetCount: number;
  sort: ISortField;
  sortOrder: "asc" | "desc";
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      page = 1,
      perPage = 60,
      nameLessOnly = false,
      maximumAssetCount: maxValue = 1000000,
      sort = "assetCount",
      sortOrder = "desc",
    } = req.query as any as IQuery;

    const currentUser = await getCurrentUser();

    const maximumAssetCount = !maxValue || maxValue <= 0 ? 1000000 : maxValue;
    const whereClause = and(
      eq(person.isHidden, false),
      isNull(assets.duplicateId),
      eq(assets.isVisible, true),
      eq(assets.isArchived, false),
      eq(assets.ownerId, currentUser.id),
      stringToBoolean(nameLessOnly) ? eq(person.name, "") : undefined
    );

    let query = db
      .select({
        id: person.id,
        name: person.name,
        thumbnailPath: person.thumbnailPath,
        birthDate: person.birthDate,
        isHidden: person.isHidden,
        updatedAt: person.updatedAt,
        assetCount: count(assetFaces.id),
      })
      .from(person)
      .leftJoin(assetFaces, eq(assetFaces.personId, person.id))
      .leftJoin(assets, eq(assets.id, assetFaces.assetId))
      .where(whereClause)
      .having(lte(count(assetFaces.id), maximumAssetCount))
      .groupBy(person.id);

    let sortedQuery;
    if (sort === "assetCount") {
      sortedQuery = query.orderBy(
        sortOrder === "asc"
          ? asc(count(assetFaces.id))
          : desc(count(assetFaces.id))
      );
    } else if (sort === "updatedAt") {
      sortedQuery = query.orderBy(
        sortOrder === "asc" ? asc(person.updatedAt) : desc(person.updatedAt)
      );
    }
    const people = await query.limit(perPage).offset((page - 1) * perPage);

 

    return res.status(200).json({
      people,
      total: 10,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
