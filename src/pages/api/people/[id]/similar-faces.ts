// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CHART_COLORS } from "@/config/constants/chart.constant";
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { stringToBoolean } from "@/helpers/data.helper";
import { assetFaces, assets, exif, person } from "@/schema";
import { faceSearch } from "@/schema/faceSearch.schema";
import { and, cosineDistance, desc, eq, gt, ne, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

type ISortField = "assetCount" | "updatedAt" | "createdAt";

interface IQuery {
  id: string;
  page: number;
  perPage: number;
  nameLessOnly: boolean | string;
  minimumAssetCount: number;
  sort: ISortField;
  sortOrder: "asc" | "desc";
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      id,
      page = 1,
      perPage = 60,
      nameLessOnly = false,
      minimumAssetCount = 0,
      sort = "assetCount",
      sortOrder = "desc",
    } = req.query as any as IQuery;

  const currentUser = await getCurrentUser(req);
    const personRecords = await db
      .select()
      .from(person)
      .where(eq(person.id, id))
      .limit(1);

    const personRecord = personRecords?.[0];
    if (!personRecord) {
      return res.status(404).json({
        error: "Person not found",
      });
    }

    const assetFaceRecords = await db
      .select()
      .from(assetFaces)
      .where(eq(assetFaces.personId, personRecord.id))
      .limit(1);
    const assetFaceRecord = assetFaceRecords?.[0];

    if (!assetFaceRecord) {
      return res.status(404).json({
        error: "Person has no face",
      });
    }

    const faceSearchRecords = await db
      .select()
      .from(faceSearch)
      .where(eq(faceSearch.faceId, assetFaceRecord.id))
      .limit(1);

    const faceSearchRecord = faceSearchRecords?.[0];
    if (!faceSearchRecord) {
      return res.status(404).json({
        error: "No similar faces found",
      });
    }

    const similarity = sql<number>`1 - (${cosineDistance(
      faceSearch.embedding,
      faceSearchRecord.embedding
    )})`;

    const people = await db
      .selectDistinctOn([person.id], {
        id: person.id,
        name: person.name,
        thumbnailPath: person.thumbnailPath,
        birthDate: person.birthDate,
        isHidden: person.isHidden,
        updatedAt: person.updatedAt,
        assetId: assetFaces.id,
        faceSearch: faceSearch.faceId,
        similarity,
      })
      .from(faceSearch)
      .leftJoin(assetFaces, eq(assetFaces.id, faceSearch.faceId))
      .innerJoin(person, eq(person.id, assetFaces.personId))

      .where(
        and(
          ne(person.id, id),
          eq(person.ownerId, currentUser.id),
          gt(similarity, 0.5)
        )
      )
      .limit(12);

    return res.status(200).json(people);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message,
    });
  }
}
