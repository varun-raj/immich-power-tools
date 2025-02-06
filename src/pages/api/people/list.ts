// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assetFaces, assets, exif, person } from "@/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
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
  type: string;
  maximumAssetCount: number;
  sort: ISortField;
  sortOrder: "asc" | "desc";
  query: string;
  visibility: "all" | "visible" | "hidden";
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      page = 1,
      perPage = 60,
      maximumAssetCount: maxValue = 1000000,
      sort = "assetCount",
      sortOrder = "desc",
      type = "all",
      query = "",
      visibility = "all",
    } = req.query as any as IQuery;

    const currentUser = await getCurrentUser(req);

    const maximumAssetCount = !maxValue || maxValue <= 0 ? 1000000 : maxValue;

    const whereClause = and(
      isNull(assets.duplicateId),
      eq(assets.isVisible, true),
      eq(assets.isArchived, false),
      eq(assets.ownerId, currentUser.id),
      type === "all" ? undefined : (type === "nameless" ? eq(person.name, "") : ne(person.name, "")),
      query && query.length > 0 ? ilike(person.name, `%${query}%`) : undefined,
      visibility === "visible" ? eq(person.isHidden, false) : visibility === "hidden" ? eq(person.isHidden, true) : undefined
    );

    let dbQuery = db
      .select({
        id: person.id,
        name: person.name,
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
      sortedQuery = dbQuery.orderBy(
        sortOrder === "asc"
          ? asc(count(assetFaces.id))
          : desc(count(assetFaces.id))
      );
    } else if (sort === "updatedAt") {
      sortedQuery = dbQuery.orderBy(
        sortOrder === "asc" ? asc(person.updatedAt) : desc(person.updatedAt)
      );
    }
    const people = await dbQuery.limit(perPage).offset((page - 1) * perPage);

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
