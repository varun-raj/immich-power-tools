import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { and, desc, eq, isNotNull, inArray, like, ilike, gte, lte, between, isNull, isNotNull as isNot } from "drizzle-orm";

import { db } from "@/config/db";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { assets } from "@/schema/assets.schema";
import { exif } from "@/schema/exif.schema";
import { cleanUpAsset, isFlipped } from "@/helpers/asset.helper";
import { ASSET_VIDEO_PATH } from "@/config/routes";
import type { AssetFilter } from "@/types/filter";

interface FilterAssetsRequest extends NextApiRequest {
  body: {
    filters: AssetFilter[];
    page?: number;
    limit?: number;
  };
}

export default async function handler(
  req: FilterAssetsRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const currentUser = await getCurrentUser(req);
  if (!currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { filters = [], page = 1, limit = 100 } = req.body;

  try {
    // Build filter conditions based on the filters array
    const filterConditions = [];

    // Base conditions for active assets
    filterConditions.push(
      eq(assets.visibility, "timeline"),
      eq(assets.status, "active"),
      eq(assets.ownerId, currentUser.id)
    );

    // Process each filter
    filters.forEach((filter) => {
      const { type, operator, value } = filter;

      switch (type) {
        case 'make':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.make, value as string));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.make, value as string));
          } else if (operator === 'contains' && value) {
            filterConditions.push(ilike(exif.make, `%${value}%`));
          } else if (operator === 'doesNotContain' && value) {
            filterConditions.push(ilike(exif.make, `%${value}%`));
          } else if (operator === 'startsWith' && value) {
            filterConditions.push(ilike(exif.make, `${value}%`));
          } else if (operator === 'endsWith' && value) {
            filterConditions.push(ilike(exif.make, `%${value}`));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.make));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.make));
          }
          break;

        case 'model':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.model, value as string));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.model, value as string));
          } else if (operator === 'contains' && value) {
            filterConditions.push(ilike(exif.model, `%${value}%`));
          } else if (operator === 'doesNotContain' && value) {
            filterConditions.push(ilike(exif.model, `%${value}%`));
          } else if (operator === 'startsWith' && value) {
            filterConditions.push(ilike(exif.model, `${value}%`));
          } else if (operator === 'endsWith' && value) {
            filterConditions.push(ilike(exif.model, `%${value}`));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.model));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.model));
          }
          break;

        case 'lensModel':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.lensModel, value as string));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.lensModel, value as string));
          } else if (operator === 'contains' && value) {
            filterConditions.push(ilike(exif.lensModel, `%${value}%`));
          } else if (operator === 'doesNotContain' && value) {
            filterConditions.push(ilike(exif.lensModel, `%${value}%`));
          } else if (operator === 'startsWith' && value) {
            filterConditions.push(ilike(exif.lensModel, `${value}%`));
          } else if (operator === 'endsWith' && value) {
            filterConditions.push(ilike(exif.lensModel, `%${value}`));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.lensModel));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.lensModel));
          }
          break;

        case 'city':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.city, value as string));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.city, value as string));
          } else if (operator === 'contains' && value) {
            filterConditions.push(ilike(exif.city, `%${value}%`));
          } else if (operator === 'doesNotContain' && value) {
            filterConditions.push(ilike(exif.city, `%${value}%`));
          } else if (operator === 'startsWith' && value) {
            filterConditions.push(ilike(exif.city, `${value}%`));
          } else if (operator === 'endsWith' && value) {
            filterConditions.push(ilike(exif.city, `%${value}`));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.city));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.city));
          }
          break;

        case 'state':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.state, value as string));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.state, value as string));
          } else if (operator === 'contains' && value) {
            filterConditions.push(ilike(exif.state, `%${value}%`));
          } else if (operator === 'doesNotContain' && value) {
            filterConditions.push(ilike(exif.state, `%${value}%`));
          } else if (operator === 'startsWith' && value) {
            filterConditions.push(ilike(exif.state, `${value}%`));
          } else if (operator === 'endsWith' && value) {
            filterConditions.push(ilike(exif.state, `%${value}`));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.state));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.state));
          }
          break;

        case 'country':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.country, value as string));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.country, value as string));
          } else if (operator === 'contains' && value) {
            filterConditions.push(ilike(exif.country, `%${value}%`));
          } else if (operator === 'doesNotContain' && value) {
            filterConditions.push(ilike(exif.country, `%${value}%`));
          } else if (operator === 'startsWith' && value) {
            filterConditions.push(ilike(exif.country, `${value}%`));
          } else if (operator === 'endsWith' && value) {
            filterConditions.push(ilike(exif.country, `%${value}`));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.country));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.country));
          }
          break;

        case 'projectionType':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.projectionType, value as string));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.projectionType, value as string));
          } else if (operator === 'contains' && value) {
            filterConditions.push(ilike(exif.projectionType, `%${value}%`));
          } else if (operator === 'doesNotContain' && value) {
            filterConditions.push(ilike(exif.projectionType, `%${value}%`));
          } else if (operator === 'startsWith' && value) {
            filterConditions.push(ilike(exif.projectionType, `${value}%`));
          } else if (operator === 'endsWith' && value) {
            filterConditions.push(ilike(exif.projectionType, `%${value}`));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.projectionType));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.projectionType));
          }
          break;

        case 'colorspace':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.colorspace, value as string));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.colorspace, value as string));
          } else if (operator === 'contains' && value) {
            filterConditions.push(ilike(exif.colorspace, `%${value}%`));
          } else if (operator === 'doesNotContain' && value) {
            filterConditions.push(ilike(exif.colorspace, `%${value}%`));
          } else if (operator === 'startsWith' && value) {
            filterConditions.push(ilike(exif.colorspace, `${value}%`));
          } else if (operator === 'endsWith' && value) {
            filterConditions.push(ilike(exif.colorspace, `%${value}`));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.colorspace));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.colorspace));
          }
          break;

        case 'bitsPerSample':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.bitsPerSample, Number(value)));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.bitsPerSample, Number(value)));
          } else if (operator === 'isLessThan' && value) {
            filterConditions.push(lte(exif.bitsPerSample, Number(value)));
          } else if (operator === 'isLessThanOrEqualTo' && value) {
            filterConditions.push(lte(exif.bitsPerSample, Number(value)));
          } else if (operator === 'isGreaterThan' && value) {
            filterConditions.push(gte(exif.bitsPerSample, Number(value)));
          } else if (operator === 'isGreaterThanOrEqualTo' && value) {
            filterConditions.push(gte(exif.bitsPerSample, Number(value)));
          } else if (operator === 'isBetween' && Array.isArray(value) && value.length === 2) {
            filterConditions.push(between(exif.bitsPerSample, Number(value[0]), Number(value[1])));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.bitsPerSample));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.bitsPerSample));
          }
          break;

        case 'rating':
          if (operator === 'is' && value) {
            filterConditions.push(eq(exif.rating, Number(value)));
          } else if (operator === 'isNot' && value) {
            filterConditions.push(eq(exif.rating, Number(value)));
          } else if (operator === 'isLessThan' && value) {
            filterConditions.push(lte(exif.rating, Number(value)));
          } else if (operator === 'isLessThanOrEqualTo' && value) {
            filterConditions.push(lte(exif.rating, Number(value)));
          } else if (operator === 'isGreaterThan' && value) {
            filterConditions.push(gte(exif.rating, Number(value)));
          } else if (operator === 'isGreaterThanOrEqualTo' && value) {
            filterConditions.push(gte(exif.rating, Number(value)));
          } else if (operator === 'isBetween' && Array.isArray(value) && value.length === 2) {
            filterConditions.push(between(exif.rating, Number(value[0]), Number(value[1])));
          } else if (operator === 'isEmpty') {
            filterConditions.push(isNull(exif.rating));
          } else if (operator === 'isNotEmpty') {
            filterConditions.push(isNot(exif.rating));
          }
          break;
      }
    });

    // Query the database with all filter conditions
    const dbAssets = await db.selectDistinctOn([assets.id], {
      id: assets.id,
      deviceId: assets.deviceId,
      type: assets.type,
      originalPath: assets.originalPath,
      isFavorite: assets.isFavorite,
      encodedVideoPath: assets.encodedVideoPath,
      originalFileName: assets.originalFileName,
      sidecarPath: assets.sidecarPath,
      deletedAt: assets.deletedAt,
      localDateTime: assets.localDateTime,
      exifImageWidth: exif.exifImageWidth,
      exifImageHeight: exif.exifImageHeight,
      ownerId: assets.ownerId,
      dateTimeOriginal: exif.dateTimeOriginal,
      orientation: exif.orientation,
      duration: assets.duration,
      // Additional EXIF fields for filtering
      make: exif.make,
      model: exif.model,
      lensModel: exif.lensModel,
      city: exif.city,
      state: exif.state,
      country: exif.country,
      projectionType: exif.projectionType,
      colorspace: exif.colorspace,
      bitsPerSample: exif.bitsPerSample,
      rating: exif.rating,
    })
      .from(assets)
      .leftJoin(exif, eq(assets.id, exif.assetId))
      .where(and(...filterConditions))
      .orderBy(desc(assets.id), desc(assets.localDateTime))
      .limit(limit)
      .offset(limit * (page - 1));

    // Clean and process the assets
    const cleanedAssets = dbAssets.map((asset) => {
      return {
        ...asset,
        exifImageHeight: (isFlipped(asset?.orientation)
          ? asset?.exifImageWidth
          : asset?.exifImageHeight) || 0,
        exifImageWidth: (isFlipped(asset?.orientation)
          ? asset?.exifImageHeight
          : asset?.exifImageWidth) || 0,
        orientation: asset?.orientation,
        downloadUrl: asset?.id ? ASSET_VIDEO_PATH(asset.id) : '',
        url: '',
        previewUrl: '',
        duration: asset?.duration ? Number(asset.duration) : 0,
        dateTimeOriginal: asset?.dateTimeOriginal ? asset.dateTimeOriginal.toISOString() : new Date().toISOString(),
      };
    }).map(cleanUpAsset).sort((b, a) => {
      return new Date(b.localDateTime || 0).getTime() - new Date(a.localDateTime || 0).getTime();
    });

    res.status(200).json({
      assets: cleanedAssets,
      pagination: {
        page,
        limit,
        total: cleanedAssets.length,
        hasMore: cleanedAssets.length === limit,
      },
      filters: filters,
    });

  } catch (error) {
    console.error('Error filtering assets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
