import { ENV } from "@/config/environment";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { z } from "zod";
import { removeNullOrUndefinedProperties } from "./data.helper";

const gemini = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

interface FindQuery {
  query: string;
  personIds?: string[];
  city?: string;
  size?: number;
  model?: string;
  createdAfter?: string;
  state?: string;
}
const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    query: { type: SchemaType.STRING, description: "Gist of the query. Remove the details of tags" },
    personIds: { type: SchemaType.ARRAY,
      description: "List of person ids that match the query which starts with @",
       items: { type: SchemaType.STRING } 
    },
    city: { type: SchemaType.STRING,
      description: "City of the query"
    },
    size: {
      type: SchemaType.INTEGER,
      description: "Size of the file in bytes"
    },
    country: {
      type: SchemaType.STRING,
      description: "Any reference to a country (United States, Canada, etc) in the query, return full country name"
    },
    state: {
      type: SchemaType.STRING,
      description: "Any reference to a state (California, New York, etc) in the query"
    },
    takenAfter: {
      type: SchemaType.STRING,
      description: "Extract the date from the query and return it in the format YYYY-MM-DD but only if it is a valid date"
    },
    takenBefore: {
      type: SchemaType.STRING,
      description: "Extract the date from the query and return it in the format YYYY-MM-DD but only if it is a valid date"
    },
    model: {
      type: SchemaType.STRING,
      description: "Name of the device that the query is about"
    },
  },
  required: ["query"],
};

export const parseFindQuery = async (query: string): Promise<FindQuery>  => {

  const prompt = `
    Parse the following query and return the query and tags: ${query}.
    Dont include any information that are not intentionally provided in the query.
    Additional Information For Parsing:
    today's date is ${new Date().toISOString().split('T')[0]}
  `;

  const { response } = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    }
  });

  const parsedResponse = JSON.parse(response.text()) as FindQuery;
  const cleanedResponse = {
    ...parsedResponse
  };
  return removeNullOrUndefinedProperties(cleanedResponse) as any as FindQuery;
}
