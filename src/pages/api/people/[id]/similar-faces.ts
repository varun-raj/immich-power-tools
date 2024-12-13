// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CHART_COLORS } from "@/config/constants/chart.constant";
import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { stringToBoolean } from "@/helpers/data.helper";
import { assetFaces, assets, exif, person } from "@/schema";
import { faceSearch } from "@/schema/faceSearch.schema";
import { and, cosineDistance, desc, eq, gt, ne, sql, avg, count } from "drizzle-orm";
import { PgVector } from "drizzle-orm/pg-core";
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

    const {
      id,
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

    const target_faces = db
      .select({
        face_id: sql<string>`x.id`.as('face_id'),
        person_id: sql<string>`x."personId"`.as('person_id'),
        asset_id: sql<string>`x."assetId"`.as('asset_id'),
        embedding: sql<vector>`y.embedding`.as('embedding'),
        dummy1: sql<number>`1`.as('dummy1')
      })
      .from(sql`asset_faces AS x`)
      .innerJoin(sql`face_search AS y`, 
        eq(sql`x."id"`, sql`y."faceId"`)
      )
      .innerJoin(person, eq(person.id, sql<string>`x."personId"`))
      .where(
        and(
          ne(sql`x."personId"`, id)), 
          eq(person.name, '')
      )
      .as('target_faces');
 
  const template_faces = db
    .select({
      face_id: sql<string>`x.id`.as('face_id'),
      person_id: sql<string>`x."personId"`.as('person_id'),
      embedding: sql<vector>`y.embedding`.as('embedding'),
      dummy2: sql<number>`1`.as('dummy2')
    })
    .from(sql`asset_faces AS x`)
    .innerJoin(sql`face_search AS y`,
      eq(sql`x."id"`, sql`y."faceId"`)
    )
    .where(ne(sql`x."personId"`, id))
    .orderBy(sql`RANDOM()`)
    .limit(10)
    .as('template_faces');  
  console.log('haaa');
  const similarity = sql<number>`1 - (${cosineDistance(
    sql`target_faces.embedding`,
    sql`template_faces.embedding`
  )})`.as('similarity');
    const pairs = db
      .select({ 
        face_id: sql<string>`target_faces.face_id`.as('face_id'),
        person_id: sql<string>`target_faces.person_id`.as('person_id'),
        template_person_id: sql<string>`template_faces.person_id`.as('template_person_id'),
        asset_id: target_faces.asset_id,
        similarity
      })
      .from(target_faces)
      .innerJoin(template_faces,
        eq(template_faces.dummy2, target_faces.dummy1)
      ).as('pairs');

    console.log('bbb');  
    const avg_scores = db
      .select({
        person_id_with_avg_score: pairs.person_id,
        avg_score: avg(pairs.similarity),
        num_photos: count()
      })
    .from(pairs)
    .where(gt(pairs.similarity, 0.15))
    .having(({ num_photos }) => gt(num_photos, 3))
      .groupBy(pairs.person_id)
      .orderBy(sql`avg(${pairs.similarity}) desc`)
    .limit(12).as('avg_scores');
      console.log('abg');
    console.log(avg_scores);


    const all_best = db
      .selectDistinctOn([sql`pairs.${pairs.person_id}`], {
        id: person.id,
        name: person.name,
        birthDate: person.birthDate,
        isHidden: person.isHidden,
        updatedAt: person.updatedAt,
        assetId: pairs.asset_id,
        faceSearch: pairs.face_id,
        similarity: pairs.similarity
      })
      .from(pairs)
      .innerJoin(avg_scores, eq(sql`avg_scores.${avg_scores.person_id_with_avg_score}`, sql`pairs.${pairs.person_id}`))
      .innerJoin(person, eq(person.id, sql`pairs.${pairs.person_id}`))
      .where(
        and(
          eq(person.ownerId, currentUser.id),
          ne(sql`pairs.${pairs.person_id}`, pairs.template_person_id),
          gt(pairs.similarity, 0.15)
        ))
      .as('all_best')
      //.toSQL();
      console.log(all_best);

      
      //console.log('huhuh');
      //console.log(all_best?.[0]);
      

      const people = await db
       .select()
        .from(all_best)
        .orderBy(sql`similarity DESC`)
        .limit(12);
    console.log(people);

    return res.status(200).json(people);
   
 
}
